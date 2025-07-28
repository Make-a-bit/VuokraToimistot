using API.Entities;
using API.Repositories;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class ReservationUpdate
    {
        private readonly DBManager _dbManager;
        private readonly ReservationDelete _reservationDelete;
        private readonly ReservationRepository _reservationRepository;

        public ReservationUpdate(DBManager db, ReservationDelete rd, ReservationRepository rr)
        {
            _dbManager = db;
            _reservationDelete = rd;
            _reservationRepository = rr;
        }

        /// <summary>
        /// Updates an existing reservation in the database with the provided details.
        /// </summary>
        /// <remarks>This method updates the reservation's basic details, as well as associated devices
        /// and services. It uses a database transaction to ensure that all updates are applied atomically. If the
        /// reservation has associated devices or services, they are first removed and then re-added with the updated
        /// details.</remarks>
        /// <param name="reservation">The reservation object containing updated details. Must not be null and must have a valid reservation ID.</param>
        /// <returns><see langword="true"/> if the reservation was successfully updated; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> UpdateReservationAsync(Reservation reservation)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                if (await _reservationRepository.HasDevicesOnReservationAsync(reservation.Id))
                {
                    await _reservationDelete.DeleteReservationDevicesAsync(reservation.Id, conn, transaction);
                }

                if (await _reservationRepository.HasServicesOnReservationAsync(reservation.Id))
                {
                    await _reservationDelete.DeleteReservationServicesAsync(reservation.Id, conn, transaction);
                }

                using var cmd = new SqlCommand(@"
                UPDATE Reservations 
                SET 
                    property_id = @pid, 
                    customer_id = @cid, 
                    reservation_start = @start, 
                    reservation_end = @end, 
                    invoiced = @inv,
                    reservation_description = @descr
                WHERE reservation_id = @rid",
                conn, transaction);

                cmd.Parameters.AddWithValue("@pid", reservation.Property.Id);
                cmd.Parameters.AddWithValue("@cid", reservation.Customer.Id);
                cmd.Parameters.AddWithValue("@start", reservation.StartDate);
                cmd.Parameters.AddWithValue("@end", reservation.EndDate);
                cmd.Parameters.AddWithValue("@inv", reservation.Invoiced);
                cmd.Parameters.AddWithValue("@descr", reservation.Description);
                cmd.Parameters.AddWithValue("@rid", reservation.Id);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                using var deviceCmd = new SqlCommand(@"
                INSERT INTO Reservation_devices (
                    reservation_id, 
                    device_id, 
                    device_price, 
                    device_vat,
                    device_qty, 
                    device_discount)
                VALUES (
                    @rid, 
                    @did, 
                    @price, 
                    @vat, 
                    @qty, 
                    @discount)",
                conn, transaction);

                foreach (var device in reservation.Devices)
                {
                    deviceCmd.Parameters.AddWithValue("@rid", reservation.Id);
                    deviceCmd.Parameters.AddWithValue("@did", device.Id);
                    deviceCmd.Parameters.AddWithValue("@price", device.Price);
                    deviceCmd.Parameters.AddWithValue("@vat", device.Vat);
                    deviceCmd.Parameters.AddWithValue("@qty", device.Qty);
                    deviceCmd.Parameters.AddWithValue("@discount", device.Discount);

                    await deviceCmd.ExecuteNonQueryAsync();
                    deviceCmd.Parameters.Clear();
                }

                using var serviceCmd = new SqlCommand(@"
                INSERT INTO Reservation_services (
                    reservation_id, 
                    service_id, 
                    service_price, 
                    service_vat,
                    service_qty, 
                    service_discount)
                VALUES (
                    @rid, 
                    @sid, 
                    @price, 
                    @vat, 
                    @qty, 
                    @discount)",
                conn, transaction);

                foreach (var service in reservation.Services)
                {
                    serviceCmd.Parameters.AddWithValue("@rid", reservation.Id);
                    serviceCmd.Parameters.AddWithValue("@sid", service.Id);
                    serviceCmd.Parameters.AddWithValue("@price", service.Price);
                    serviceCmd.Parameters.AddWithValue("@vat", service.Vat);
                    serviceCmd.Parameters.AddWithValue("@qty", service.Qty);
                    serviceCmd.Parameters.AddWithValue("@discount", service.Discount);

                    await serviceCmd.ExecuteNonQueryAsync();
                    serviceCmd.Parameters.Clear();
                }

                await transaction.CommitAsync();
                return rowsAffected > 0;
            }
            catch (SqlException error)
            {
                // Log error
                await transaction.RollbackAsync();
                return false;
            }
        }


        /// <summary>
        /// Asynchronously updates the invoiced status of a reservation.
        /// </summary>
        /// <remarks>This method uses a database transaction to ensure that the update is atomic. If the
        /// transaction fails, it will be rolled back.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation to update.</param>
        /// <param name="status">The new invoiced status to set for the reservation. <see langword="true"/> if invoiced; otherwise, <see
        /// langword="false"/>.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains <see langword="true"/> if the
        /// update was successful; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> SetInvoicedAsync(int reservationId, bool status)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                UPDATE Reservations
                SET invoiced = @status
                WHERE reservation_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@status", status);
                cmd.Parameters.AddWithValue("@id", reservationId);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}