using API.Entities;
using Microsoft.Data.SqlClient;
using System.Diagnostics;

namespace API.Services
{
    public class InvoiceAdd
    {
        private readonly DBManager _dbManager;

        public InvoiceAdd(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<int?> CreateInvoice(Reservation reservation)
        {
            int? invoiceId = null;

            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            decimal subTotal = 0;
            decimal discounts = 0;
            decimal VAT = 0;
            decimal TotalSum = 0;

            try
            {
                // calculate subtotal and vat from services
                if (reservation.Services.Count > 0)
                {
                    foreach (var item in reservation.Services)
                    {
                        var rowPrice = item.Price * item.Qty;

                        if (item.Discount > 0)
                        {
                            var discounted = rowPrice - (rowPrice * item.Discount);
                            subTotal += discounted;
                            discounts += rowPrice * item.Discount;
                            VAT += subTotal * item.Vat;

                            continue;
                        }

                        subTotal += rowPrice;
                        VAT += subTotal / 100 * item.Vat;
                    }
                }

                // calculate subtotal and vat from devices
                if (reservation.Devices.Count > 0)
                {
                    foreach (var item in reservation.Devices)
                    {
                        var rowPrice = item.Price * item.Qty;

                        if (item.Discount > 0)
                        {
                            var discounted = rowPrice - (rowPrice * item.Discount);
                            subTotal += discounted;
                            discounts += rowPrice * item.Discount;
                            VAT += subTotal * item.Vat;

                            continue;
                        }

                        subTotal += rowPrice;
                        VAT += subTotal * item.Vat;
                    }
                }

                TotalSum = subTotal + VAT;

                using var cmd = new SqlCommand(@"
                INSERT INTO Invoices (
                    reservation_id,
                    customer_id,
                    invoice_date,
                    invoice_duedate,
                    invoice_subtotal,
                    invoice_discounts,
                    invoice_vattotal,
                    invoice_totalsum)
                OUTPUT INSERTED.invoice_id
                VALUES (
                    @rid,
                    @cid,
                    @iDate,
                    @dDate,
                    @subTotal,
                    @discounts,
                    @vatTotal,
                    @totalSum)",
                conn, transaction);

                cmd.Parameters.AddWithValue("@rid", reservation.Id);
                cmd.Parameters.AddWithValue("@cid", reservation.Customer.Id);
                cmd.Parameters.AddWithValue("@iDate", reservation.DateInvoiced);
                cmd.Parameters.AddWithValue("@dDate", reservation.DueDate);
                cmd.Parameters.AddWithValue("@subTotal", subTotal);
                cmd.Parameters.AddWithValue("@discounts", discounts);
                cmd.Parameters.AddWithValue("@vatTotal", VAT);
                cmd.Parameters.AddWithValue("@totalSum", TotalSum);

                var result = await cmd.ExecuteScalarAsync();
                await transaction.CommitAsync();

                if (result != null && int.TryParse(result.ToString(), out int parseId))
                {
                    invoiceId = parseId;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("ERROR", ex);
                await transaction.RollbackAsync();
            }

            return invoiceId;
        }
    }
}