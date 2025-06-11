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
        private readonly OfficeRepository _officeRepo; 
        private readonly OfficeUpdate _officeUpdate;

        public OfficeController(OfficeAdd officeAdd, OfficeRepository officeRepo, OfficeUpdate update)
        {
            _officeAdd = officeAdd;
            _officeRepo = officeRepo;
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
            var success = await _officeAdd.AddOffice(office);

            if (success) return Ok();

            else return BadRequest();
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateOffice([FromBody] Office office)
        {
            var success = await _officeUpdate.UpdateOffice(office);

            if (success) return Ok();

            else return BadRequest();
        }
    }
}
