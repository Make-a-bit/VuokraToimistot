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

        public async Task<bool> IsTaxInUseAsync(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            // Tarkista, onko vat_id käytössä Services- tai Devices-tauluissa
            using var cmd = new SqlCommand(@"
            SELECT COUNT(*) FROM Services WHERE vat_id = @id
            UNION ALL
            SELECT COUNT(*) FROM Devices WHERE vat_id = @id", 
            conn);

            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                if (reader.GetInt32(0) > 0)
                    return true; 
            }
            return false; 
        }
    }
}
