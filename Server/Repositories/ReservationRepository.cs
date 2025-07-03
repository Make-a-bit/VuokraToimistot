using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class ReservationRepository
    {
        private readonly DBManager _dbManager;

        public ReservationRepository(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<List<DateOnly>> GetReservedDates(int propertyId)
        {
            var dates = new List<DateOnly>();
            var today = DateOnly.FromDateTime(DateTime.Today);

            var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            var cmd = new SqlCommand("SELECT reservation_start, reservation_end FROM Reservations " +
                "WHERE property_id = @pId", conn);

            cmd.Parameters.AddWithValue("@pId", propertyId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var start = DateOnly.FromDateTime(reader.GetDateTime(0));
                var end = DateOnly.FromDateTime(reader.GetDateTime(1));

                // Add each date in the range [start, end] if it's today or in the future
                for (var date = start; date <= end; date = date.AddDays(1))
                {
                    if (date >= today) dates.Add(date);
                }
            }

            return dates;
        }
    }
}
