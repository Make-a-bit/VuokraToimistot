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
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Office_Properties
                WHERE property_id = @id",
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
            }
            return false;
        }
    }
}
