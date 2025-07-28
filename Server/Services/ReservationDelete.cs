using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class ReservationDelete
    {
        private readonly DBManager _dbManager;
        public ReservationDelete(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Deletes a reservation and its associated devices and services from the database in a single transaction.
        /// </summary>
        /// <remarks>This method performs a cascading delete operation, removing the reservation along
        /// with any related devices and services. The operation is executed within a database transaction to ensure
        /// atomicity. If any part of the deletion process fails, the transaction is rolled back, and an exception is
        /// thrown.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation to be deleted.</param>
        /// <returns><see langword="true"/> if the reservation and all associated entities were successfully deleted; otherwise,
        /// <see langword="false"/>.</returns>
        public async Task<bool> DeleteReservationCascadeAsync(int reservationId)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                await DeleteReservationDevicesAsync(reservationId, conn, transaction);
                await DeleteReservationServicesAsync(reservationId, conn, transaction);
                var result = await DeleteReservationAsync(reservationId, conn, transaction);

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        /// <summary>
        /// Deletes a reservation from the database based on the specified reservation ID.
        /// </summary>
        /// <remarks>This method performs the deletion within the context of the provided SQL transaction.
        /// Ensure that the transaction is properly committed or rolled back after calling this method.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation to be deleted. Must be a valid reservation ID.</param>
        /// <param name="conn">An open <see cref="SqlConnection"/> to the database. The connection must be valid and open before calling
        /// this method.</param>
        /// <param name="transaction">The <see cref="SqlTransaction"/> within which the delete operation should be executed. This transaction must
        /// be active.</param>
        /// <returns><see langword="true"/> if the reservation was successfully deleted; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> DeleteReservationAsync(int reservationId, SqlConnection conn, SqlTransaction transaction)
        {
            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Reservations
                WHERE reservation_id = @rid", conn, transaction);
                cmd.Parameters.AddWithValue("@rid", reservationId);

                var result = await cmd.ExecuteNonQueryAsync();
                return result > 0;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Deletes all devices associated with a specified reservation from the database.
        /// </summary>
        /// <remarks>This method performs a database operation that deletes all entries in the
        /// Reservation_devices table that are associated with the specified reservation ID. Ensure that the provided
        /// <paramref name="conn"/> is open and the <paramref name="transaction"/> is active before calling this
        /// method.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation whose devices are to be deleted. Must be a valid reservation ID.</param>
        /// <param name="conn">An open <see cref="SqlConnection"/> to the database. The connection must be valid and open.</param>
        /// <param name="transaction">The <see cref="SqlTransaction"/> within which the command executes. The transaction must be active.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task DeleteReservationDevicesAsync(int reservationId, SqlConnection conn, SqlTransaction transaction)
        {
            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Reservation_devices
                WHERE reservation_id = @rid", conn, transaction);
                cmd.Parameters.AddWithValue("@rid", reservationId);

                await cmd.ExecuteNonQueryAsync();
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Deletes all services associated with a specified reservation.
        /// </summary>
        /// <remarks>This method deletes all entries in the Reservation_services table that are associated
        /// with the specified reservation ID. Ensure that the provided <paramref name="conn"/> is open and the
        /// <paramref name="transaction"/> is active before calling this method.</remarks>
        /// <param name="reservationId">The unique identifier of the reservation whose services are to be deleted. Must be a valid reservation ID.</param>
        /// <param name="conn">The <see cref="SqlConnection"/> to the database. Must be open and valid.</param>
        /// <param name="transaction">The <see cref="SqlTransaction"/> under which the command executes. Must be a valid transaction.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task DeleteReservationServicesAsync(int reservationId, SqlConnection conn, SqlTransaction transaction)
        {
            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Reservation_services
                WHERE reservation_id = @rid", conn, transaction);
                cmd.Parameters.AddWithValue("@rid", reservationId);

                await cmd.ExecuteNonQueryAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}
