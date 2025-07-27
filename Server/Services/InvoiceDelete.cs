using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class InvoiceDelete
    {
        private readonly DBManager _dbManager;

        public InvoiceDelete(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> DeleteInvoiceAsync(int invoiceId)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Invoices
                WHERE invoice_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", invoiceId);
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
