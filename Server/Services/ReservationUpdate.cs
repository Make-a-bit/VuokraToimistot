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

        public async Task<bool> UpdateReservation(Reservation reservation)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                if (await _reservationRepository.HasDevicesOnReservation(reservation.Id))
                {
                    await _reservationDelete.DeleteReservationDevices(reservation.Id, conn, transaction);
                }

                if (await _reservationRepository.HasServicesOnReservation(reservation.Id))
                {
                    await _reservationDelete.DeleteReservationServices(reservation.Id, conn, transaction);
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

        public async Task<bool> SetInvoiced(int reservationId, bool status)
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