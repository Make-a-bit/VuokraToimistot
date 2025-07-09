using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class InvoiceAdd
    {
        private readonly DBManager _dbManager;

        public InvoiceAdd(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<int?> CreateInvoice(Invoice invoice)
        {
            int? invoiceId = null;

            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            {
                using var cmd = new SqlCommand(@"
                INSERT INTO Invoices (
                    reservation_id,
                    customer_id,
                    invoice_date,
                    invoice_duedate,
                    invoice_subtotal,
                    invoice_discounts,
                    invoice_vat-total,
                    invoice_totalsum,
                    invoice_description,
                    invoice_paid)
                OUTPUT INSERTED.invoice_id
                VALUES (
                    @rid,
                    @cid,
                    @iDate,
                    @dDate,
                    @subTotal,
                    @discounts,
                    @vatTotal,
                    @totalSum,
                    @description,
                    @paid",
                conn, transaction);

                cmd.Parameters.AddWithValue("@rid", invoice.Reservation.Id);
                cmd.Parameters.AddWithValue("@cid", invoice.Customer.Id);
                cmd.Parameters.AddWithValue("@iDate", invoice.InvoiceDate);
                cmd.Parameters.AddWithValue("@dDate", invoice.DueDate);
                cmd.Parameters.AddWithValue("@subTotal", invoice.SubTotal);
                cmd.Parameters.AddWithValue("@discounts", invoice.Discounts);
                cmd.Parameters.AddWithValue("@vatTotal", invoice.VatTotal);
                cmd.Parameters.AddWithValue("@totalSum", invoice.TotalSum);
                cmd.Parameters.AddWithValue("@description", invoice.Description);
                cmd.Parameters.AddWithValue("@paid", invoice.Paid);

                var result = await cmd.ExecuteScalarAsync();
                await transaction.CommitAsync();

                if (result != null && int.TryParse(result.ToString(), out int parseId))
                {
                    invoiceId = parseId;
                }
            }
            catch
            {
                await transaction.RollbackAsync();
            }

            return invoiceId;
        }
    }
}