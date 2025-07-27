using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class InvoiceRepository
    {
        private readonly DBManager _dbManager;

        public InvoiceRepository(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<Invoice> GetInvoice(int invoiceId)
        {
            var invoice = new Invoice();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT * FROM Invoices
                WHERE invoice_id = @Iid", conn);

                cmd.Parameters.AddWithValue("@Iid", invoiceId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    invoice.Id = reader.GetInt32(reader.GetOrdinal("invoice_id"));
                    invoice.CustomerId = reader.GetInt32(reader.GetOrdinal("customer_id"));
                    invoice.ReservationId = reader.GetInt32(reader.GetOrdinal("reservation_id"));
                    invoice.InvoiceDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("invoice_date")));
                    invoice.DueDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("invoice_duedate")));
                    invoice.SubTotal = reader.GetDecimal(reader.GetOrdinal("invoice_subtotal"));
                    invoice.Discounts = reader.GetDecimal(reader.GetOrdinal("invoice_discounts"));
                    invoice.VatTotal = reader.GetDecimal(reader.GetOrdinal("invoice_vattotal"));
                    invoice.TotalSum = reader.GetDecimal(reader.GetOrdinal("invoice_totalsum"));
                    invoice.Paid = reader.GetBoolean(reader.GetOrdinal("invoice_paid"));
                }

                return invoice;
            }
            catch
            {
                throw;
            }
        }
    }
}
