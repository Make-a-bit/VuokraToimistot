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

        public OfficeController(OfficeAdd officeAdd, OfficeRepository officeRepo)
        {
            _officeAdd = officeAdd;
            _officeRepo = officeRepo;
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
    }
}
