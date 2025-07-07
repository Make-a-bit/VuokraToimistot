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

        public async Task<bool> DeleteReservationCascade(int reservationId)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            {
                await DeleteReservationDevices(reservationId, conn, transaction);
                await DeleteReservationServices(reservationId, conn, transaction);
                var result = await DeleteReservation(reservationId, conn, transaction);

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteReservation(int reservationId, SqlConnection conn, SqlTransaction transaction)
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

        public async Task DeleteReservationDevices(int reservationId, SqlConnection conn, SqlTransaction transaction)
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

        public async Task DeleteReservationServices(int reservationId, SqlConnection conn, SqlTransaction transaction)
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
