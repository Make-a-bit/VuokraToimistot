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

        public async Task DeleteReservationDevices(int reservationId)
        {
            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("DELETE FROM Reservation_devices " +
                    "WHERE reservation_id = @rid", conn);
                cmd.Parameters.AddWithValue("@rid", reservationId);

                await cmd.ExecuteNonQueryAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task DeleteReservationServices(int reservationId)
        {
            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("DELETE FROM Reservation_services " +
                    "WHERE reservation_id = @rid", conn);
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
