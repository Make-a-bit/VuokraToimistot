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
