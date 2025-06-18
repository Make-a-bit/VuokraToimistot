using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class PropertyUpdate
    {
        private readonly DBManager _dbManager;

        public PropertyUpdate(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> UpdateProperty(Property property)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("UPDATE Properties " +
                    "SET office_id = @oId, property_name = @name, property_area = @area " +
                    "WHERE property_id = @id", conn);

                cmd.Parameters.AddWithValue("@oId", property.OfficeId);
                cmd.Parameters.AddWithValue("@name", property.Name);
                cmd.Parameters.AddWithValue("@area", property.Area);
                cmd.Parameters.AddWithValue("id", property.Id);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: ", ex);
            }
            return false;
        }
    }
}