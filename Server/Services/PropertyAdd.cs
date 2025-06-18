using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class PropertyAdd
    {
        private readonly DBManager _dbManager;

        public PropertyAdd(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<int?> AddProperty(Property property)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("INSERT INTO Properties " +
                    "(office_id, property_name, property_area) " +
                    "OUTPUT INSERTED.property_id " +
                    "VALUES (@oId, @name, @area)", conn);

                cmd.Parameters.AddWithValue("@oId", property.OfficeId);
                cmd.Parameters.AddWithValue("@name", property.Name);
                cmd.Parameters.AddWithValue("@area", property.Area);

                var result = await cmd.ExecuteScalarAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while creating a new property: ", ex.ToString());
            }

            return null;
        }
    }
}
