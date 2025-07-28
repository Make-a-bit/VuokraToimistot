using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    public class ServiceController : Controller
    {
        private readonly ServiceAdd _serviceAdd;
        private readonly ServiceDelete _serviceDelete;
        private readonly ServiceRepository _serviceRepository;
        private readonly ServiceUpdate _serviceUpdate;

        public ServiceController(ServiceAdd sa, ServiceRepository sr, ServiceUpdate su, ServiceDelete sd)
        {
            _serviceAdd = sa;
            _serviceDelete = sd;
            _serviceRepository = sr;
            _serviceUpdate = su;
        }

        [HttpGet("all")]
        public async Task<ActionResult> GetServices()
        {
            try
            {
                var services = await _serviceRepository.GetAllServicesAsync();

                return Ok(services);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("by-office")]
        public async Task<ActionResult> GetServices([FromQuery] int officeId)
        {
            try
            {
                var services = await _serviceRepository.GetAllServicesAsync(officeId);

                if (services.Count > 0)
                    return Ok(services);

                else return NotFound();
            }
            catch
            {
                // Logger
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateService([FromBody] Service service)
        {
            try
            {
                var serviceId = await _serviceAdd.AddServiceAsync(service);

                if (!serviceId.HasValue)
                    return BadRequest();

                service.Id = serviceId.Value;
                return Ok(service);
            }
            catch
            {
                // logger
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateService([FromBody] Service service)
        {
            try
            {
                if (await _serviceUpdate.UpdateServiceAsync(service))
                {
                    var updatedService = await _serviceRepository.GetServiceAsync(service.Id);
                    return Ok(updatedService);
                }

                else return NotFound();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("delete/{officeId}")]
        public async Task<ActionResult> DeleteService([FromRoute] int id)
        {
            try
            {
                if (await _serviceDelete.DeleteServiceAsync(id))
                    return Ok();

                else return NotFound();
            }
            catch
            {
                // logger
                return BadRequest();
            }
        }
    }
}
