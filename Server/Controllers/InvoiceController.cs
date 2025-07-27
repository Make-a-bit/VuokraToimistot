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
        private readonly InvoiceRepository _invoices;
        private readonly ReservationUpdate _reservationUpdate;

        public InvoiceController(InvoiceAdd ia, InvoiceRepository ir, ReservationUpdate ru)
        {
            _invoiceAdd = ia;
            _invoices = ir;
            _reservationUpdate = ru;
        }

        [HttpGet]
        public async Task<ActionResult<List<Invoice>>> GetInvoices()
        {
            try
            {
                var invoices = await _invoices.GetInvoicesAsync();

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
                await _reservationUpdate.SetInvoiced(reservation.Id);

                var invoice = await _invoices.GetInvoiceAsync(invoiceId.Value);
                return Ok(invoice);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
