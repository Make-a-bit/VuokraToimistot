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

        /// <summary>
        /// Asynchronously deletes an invoice from the database.
        /// </summary>
        /// <remarks>This method attempts to delete the specified invoice within a database transaction.
        /// If the operation fails, the transaction is rolled back, and the method returns <see
        /// langword="false"/>.</remarks>
        /// <param name="invoiceId">The unique identifier of the invoice to be deleted. Must be a valid, existing invoice ID.</param>
        /// <returns><see langword="true"/> if the invoice was successfully deleted; otherwise, <see langword="false"/>.</returns>
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
