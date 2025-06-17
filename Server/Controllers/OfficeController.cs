using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    public class OfficeController : Controller
    {
        private readonly OfficeAdd _officeAdd;
        private readonly OfficeDelete _officeDelete;
        private readonly OfficeRepository _officeRepo; 
        private readonly OfficeUpdate _officeUpdate;

        public OfficeController(OfficeAdd add, OfficeDelete delete, OfficeRepository repo, OfficeUpdate update)
        {
            _officeAdd = add;
            _officeDelete = delete;
            _officeRepo = repo;
            _officeUpdate = update;
        }

        [HttpGet]
        public async Task<ActionResult<List<Office>>> GetOffices()
        {
            var offices = await _officeRepo.GetOffices();

            return Ok(offices);
        }

        [HttpPost]
        public async Task<ActionResult> CreateOffice([FromBody] Office office)
        {
            try
            {
                var officeID = await _officeAdd.AddOffice(office);

                office.Id = officeID.Value;

                return Ok(office);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateOffice([FromBody] Office office)
        {
            var success = await _officeUpdate.UpdateOffice(office);

            if (success)
            {
                var updatedOffice = await _officeRepo.GetOfficeById(office.Id);
                return Ok(updatedOffice);
            }

            else return BadRequest();
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteOffice([FromRoute] int id)
        {
            var success = await _officeDelete.DeleteOffice(id);

            if (success) return Ok();

            else return BadRequest();
        }
    }
}
