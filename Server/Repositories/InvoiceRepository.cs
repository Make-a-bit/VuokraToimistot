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

        /// <summary>
        /// Asynchronously retrieves an invoice by its unique identifier.
        /// </summary>
        /// <remarks>This method opens a database connection to retrieve the invoice details. Ensure that
        /// the database connection is properly configured before calling this method. The method will throw an
        /// exception if the connection fails or if the query execution encounters an error.</remarks>
        /// <param name="invoiceId">The unique identifier of the invoice to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="Invoice"/> object
        /// corresponding to the specified <paramref name="invoiceId"/>. If no invoice is found, the returned object
        /// will have default values.</returns>
        public async Task<Invoice> GetInvoiceAsync(int invoiceId)
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
                    invoice.Customer.Id = reader.GetInt32(reader.GetOrdinal("customer_id"));
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


        /// <summary>
        /// Asynchronously retrieves a list of all invoices from the database.
        /// </summary>
        /// <remarks>This method fetches invoice details including customer information and financial
        /// data. It returns a list of <see cref="Invoice"/> objects, each representing an invoice with its associated
        /// details.</remarks>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Invoice"/>
        /// objects.</returns>
        public async Task<List<Invoice>> GetAllInvoicesAsync()
        {
            var invoices = new List<Invoice>();
            
            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    i.invoice_id,
                    i.reservation_id,
                    i.customer_id,
                    i.invoice_date,
                    i.invoice_due_date,
                    i.invoice_subtotal,
                    i.invoice_discounts,
                    i.invoice_vattotal,
                    i.invoice_totalsum,
                    i.invoice_paid,
                    c.customer_name
                FROM Invoices i
                JOIN Customers c ON i.customer_id = c.customer_id", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var invoice = new Invoice();
                    invoice.Customer = new Customer();

                    invoice.Id = reader.GetInt32(reader.GetOrdinal("invoice_id"));
                    invoice.ReservationId = reader.GetInt32(reader.GetOrdinal("reservation_id"));
                    invoice.Customer.Id = reader.GetInt32(reader.GetOrdinal("customer_id"));
                    invoice.Customer.Name = reader.GetString(reader.GetOrdinal("customer_name"));
                    invoice.InvoiceDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("invoice_date")));
                    invoice.DueDate = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("invoice_due_date")));
                    invoice.SubTotal = reader.GetDecimal(reader.GetOrdinal("invoice_subtotal"));
                    invoice.Discounts = reader.GetDecimal(reader.GetOrdinal("invoice_discounts"));
                    invoice.VatTotal = reader.GetDecimal(reader.GetOrdinal("invoice_vattotal"));
                    invoice.TotalSum = reader.GetDecimal(reader.GetOrdinal("invoice_totalsum"));
                    invoice.Paid = reader.GetBoolean(reader.GetOrdinal("invoice_paid"));

                    invoices.Add(invoice);
                }
                return invoices;
            }
            catch
            {
                throw;
            }
        }
    }
}
