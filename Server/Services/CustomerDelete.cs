using Microsoft.Data.SqlClient;
using System.Transactions;

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
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Customers
                WHERE customer_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                // logger
                await transaction.RollbackAsync();
                return false;
            }
        }
    }
}
