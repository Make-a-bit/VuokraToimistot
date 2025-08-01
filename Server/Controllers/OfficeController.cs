using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
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
            try
            {
                var offices = await _officeRepo.GetAllOfficesAsync();

                return Ok(offices);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateOffice([FromBody] Office office)
        {
            try
            {
                var officeID = await _officeAdd.AddOfficeAsync(office);

                if (!officeID.HasValue)
                    return BadRequest();

                office.Id = officeID.Value;
                return Ok(office);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateOffice([FromBody] Office office)
        {
            try
            {
                if (await _officeUpdate.UpdateOfficeAsync(office))
                {
                    var updatedOffice = await _officeRepo.GetOfficeAsync(office.Id);
                    return Ok(updatedOffice);
                }

                else return NotFound();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteOffice([FromRoute] int id)
        {
            try
            {
                if (await _officeDelete.DeleteOfficeAsync(id))
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
