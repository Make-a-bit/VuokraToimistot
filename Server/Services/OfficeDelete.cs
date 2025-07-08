using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class OfficeDelete
    {
        private readonly DBManager _dbManager;

        public OfficeDelete(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> DeleteOffice(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Offices
                WHERE office_id = @id", conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                // Logger
                await transaction.RollbackAsync();
            }
            return false;
        }
    }
}
