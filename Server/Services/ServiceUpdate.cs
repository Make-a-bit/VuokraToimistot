using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class ServiceUpdate
    {
        private readonly DBManager _dbManager;

        public ServiceUpdate(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> UpdateService(Service service)
        {
            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("UPDATE Office_services " +
                    "SET service_name = @name, service_unit = @unit, service_price = @price " +
                    "WHERE service_id = @id", conn);

                cmd.Parameters.AddWithValue("@id", service.Id);
                cmd.Parameters.AddWithValue("@name", service.Name);
                cmd.Parameters.AddWithValue("@unit", service.Unit);
                cmd.Parameters.AddWithValue("@price", service.Price);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (SqlException)
            {
                throw;
            }
        }
    }
}
