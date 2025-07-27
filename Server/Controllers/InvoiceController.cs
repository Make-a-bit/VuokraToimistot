using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    public class InvoiceController : Controller
    {
        private readonly InvoiceAdd _invoiceAdd;
        private readonly InvoiceDelete _invoiceDelete;
        private readonly InvoiceRepository _invoices;
        private readonly ReservationUpdate _reservationUpdate;

        public InvoiceController(InvoiceAdd ia, InvoiceRepository ir, ReservationUpdate ru, InvoiceDelete id)
        {
            _invoiceAdd = ia;
            _invoices = ir;
            _reservationUpdate = ru;
            _invoiceDelete = id;
        }

        [HttpGet]
        public async Task<ActionResult<List<Invoice>>> GetInvoices()
        {
            try
            {
                var invoices = await _invoices.GetAllInvoicesAsync();

                return Ok(invoices);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateInvoice([FromBody] Reservation reservation)
        {
            try
            {
                var invoiceId = await _invoiceAdd.CreateInvoice(reservation);

                if (!invoiceId.HasValue)
                    return BadRequest();

                // set invoiced status true into respective reservation
                await _reservationUpdate.SetInvoiced(reservation.Id, true);

                var invoice = await _invoices.GetInvoiceAsync(invoiceId.Value);
                return Ok(invoice);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteInvoice([FromBody] Invoice invoice)
        {
            bool result = false;

            try
            {
                if (!invoice.Paid)
                {
                    result = await _invoiceDelete.DeleteInvoiceAsync(invoice.Id);
                }

                if (result)
                {
                    // set invoiced status false into respective reservation
                    await _reservationUpdate.SetInvoiced(invoice.ReservationId, false);

                    return Ok();
                }
                else
                {
                    return Conflict();
                }
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
