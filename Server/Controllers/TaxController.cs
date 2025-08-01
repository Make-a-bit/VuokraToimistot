using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class TaxController : Controller
    {
        private readonly TaxAdd _taxAdd;
        private readonly TaxDelete _taxDelete;
        private readonly TaxRepository _taxes;

        public TaxController(TaxAdd ta, TaxRepository tr, TaxDelete td)
        {
            _taxAdd = ta;
            _taxes = tr;
            _taxDelete = td;
        }

        [HttpPost]
        public async Task<ActionResult> CreateTax([FromBody] Tax tax)
        {
            try
            {
                var taxID = await _taxAdd.AddTaskAsync(tax);

                if (!taxID.HasValue)
                    return BadRequest();

                tax.Id = taxID.Value;
                return Ok(tax);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Tax>>> GetTaxes()
        {
            try
            {
                var taxes = await _taxes.GetAllTaxesAsync();

                return Ok(taxes);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteTax([FromRoute] int id)
        {
            try
            {
                if (await _taxDelete.DeleteTaxAsync(id))
                    return Ok();

                else return NotFound();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
