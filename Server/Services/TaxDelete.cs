using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class TaxDelete
    {
        private readonly DBManager _dbManager;

        public TaxDelete(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> DeleteTaxAsync(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM VAT
                WHERE vat_id = @id", 
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }
    }
}
