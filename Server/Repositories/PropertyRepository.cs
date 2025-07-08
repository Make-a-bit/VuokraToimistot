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

        /// <summary>
        /// Get all properties from the database
        /// </summary>
        /// <returns></returns>
        public async Task<List<Property>> GetProperties()
        {
            var properties = new List<Property>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT * FROM Office_properties", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var property = new Property
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("property_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        Name = reader.GetString(reader.GetOrdinal("property_name")),
                        Area = reader.GetDecimal(reader.GetOrdinal("property_area")),
                        Price = reader.GetDecimal(reader.GetOrdinal("property_price"))
                    };
                    properties.Add(property);
                }
                return properties;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get properties by office propertyId from the database
        /// </summary>
        /// <param name="officeId"></param>
        /// <returns></returns>
        public async Task<List<Property>> GetProperties(int officeId)
        {
            var properties = new List<Property>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT * FROM Office_Properties 
                WHERE office_id = @officeId", conn);

                cmd.Parameters.AddWithValue("@officeId", officeId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var property = new Property
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("property_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        Name = reader.GetString(reader.GetOrdinal("property_name")),
                        Area = reader.GetDecimal(reader.GetOrdinal("property_area")),
                        Price = reader.GetDecimal(reader.GetOrdinal("property_price")),
                    };

                    properties.Add(property);
                }
                return properties;
            }
            catch
            {
                throw;
            }
        }

        public async Task<Property> GetProperty(int propertyId)
        {
            var property = new Property();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT * FROM Office_Properties 
                WHERE property_id = @property", conn);

                cmd.Parameters.AddWithValue("@property", propertyId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    property.Id = reader.GetInt32(reader.GetOrdinal("property_id"));
                    property.OfficeId = reader.GetInt32(reader.GetOrdinal("office_id"));
                    property.Name = reader.GetString(reader.GetOrdinal("property_name"));
                    property.Area = reader.GetDecimal(reader.GetOrdinal("property_area"));
                    property.Price = reader.GetDecimal(reader.GetOrdinal("property_price"));
                }

                return property;
            }
            catch
            {
                throw;
            }
        }
    }
}
