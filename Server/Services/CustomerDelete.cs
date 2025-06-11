using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class CustomerDelete
    {
        private readonly DBManager _dbManager;

        public CustomerDelete(DBManager dBManager)
        {
            _dbManager = dBManager;
        }

        public async Task<bool> DeleteCustomer(int id)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("DELETE FROM Customers " +
                    "WHERE customer_id = @id", conn);

                cmd.Parameters.AddWithValue("@id", id);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return false;
        }
    }
}
