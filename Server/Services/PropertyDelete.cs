using Microsoft.Data.SqlClient;
using System.Runtime.CompilerServices;

namespace API.Services
{
    public class PropertyDelete
    {
        private readonly DBManager _dbManager;

        public PropertyDelete(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> DeleteProperty(int id)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("DELETE FROM Properties " +
                    "WHERE property_id = @id", conn);

                cmd.Parameters.AddWithValue("@id", id);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return false;
        }
    }
}
