using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class InvoiceUpdate
    {
        private readonly DBManager _dbManager;

        public InvoiceUpdate(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Asynchronously updates the specified invoice in the database.
        /// </summary>
        /// <remarks>This method updates the invoice's date, due date, and payment status in the database.
        /// It uses a transaction to ensure that the update is atomic. If the update fails, the transaction is rolled
        /// back.</remarks>
        /// <param name="invoice">The invoice object containing updated information. The <paramref name="invoice"/> parameter must not be null
        /// and must have a valid <c>Id</c>.</param>
        /// <returns><see langword="true"/> if the invoice was successfully updated; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> UpdateInvoiceAsync(Invoice invoice)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            {
                using var cmd = new SqlCommand(@"
                UPDATE Invoices
                SET 
                    invoice_date = @iDate,
                    invoice_duedate = @dDate,
                    invoice_paid = @paid
                WHERE invoice_id = @id", 
                conn, transaction);

                cmd.Parameters.AddWithValue("@iDate", invoice.InvoiceDate);
                cmd.Parameters.AddWithValue("@dDate", invoice.DueDate);
                cmd.Parameters.AddWithValue("@paid", invoice.Paid);
                cmd.Parameters.AddWithValue("@id", invoice.Id);

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
