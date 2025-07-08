using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class ServiceDelete
    {
        private readonly DBManager _dbManager;

        public ServiceDelete(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> DeleteService(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Office_services
                WHERE service_id = @id", 
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch (SqlException ex)
            {
                // logger
                await transaction.RollbackAsync();
                return false;
            }
        }
    }
}
