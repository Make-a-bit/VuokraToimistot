using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class PropertyRepository
    {
        private readonly DBManager _dbManager;

        public PropertyRepository(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<List<Property>> GetProperties()
        {
            var properties = new List<Property>();

            var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            using var cmd = new SqlCommand("SELECT * FROM Properties", conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var property = new Property
                {
                    Id = reader.GetInt32(reader.GetOrdinal("property_id")),
                    OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                    Name = reader.GetString(reader.GetOrdinal("property_name")),
                    Area = reader.GetString(reader.GetOrdinal("property_area")),
                };

                properties.Add(property);
            }
            return properties;
        }

        public async Task<Property> GetPropertyById(int id)
        {
            var property = new Property();
            var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            using var cmd = new SqlCommand("SELECT * FROM Properties WHERE property_id = @id", conn);
            cmd.Parameters.AddWithValue("@id", id);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                property.Id = reader.GetInt32(reader.GetOrdinal("property_id"));
                property.OfficeId = reader.GetInt32(reader.GetOrdinal("office_id"));
                property.Name = reader.GetString(reader.GetOrdinal("property_name"));
                property.Area = reader.GetString(reader.GetOrdinal("property_area"));
            }

            return property;
        }
    }
}
