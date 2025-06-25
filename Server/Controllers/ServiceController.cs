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

        [HttpGet]
        public async Task<ActionResult> GetServices([FromQuery] int id)
        {
            try
            {
                var services = await _serviceRepository.GetServicesByOfficeId(id);

                return Ok(services);
            }
            catch (Exception ex) 
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
                var serviceId = await _serviceAdd.AddService(service);

                if (serviceId == null)
                {
                    return StatusCode(500);
                }

                service.Id = serviceId.Value;

                return Ok(service);
            }
            catch (Exception ex)
            {
                // logger
                return StatusCode(500);
            }
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateService([FromBody] Service service)
        {
            try
            {
                var success = await _serviceUpdate.UpdateService(service);

                if (success)
                {
                    var updatedService = await _serviceRepository.GetServiceById(service.Id);
                    return Ok(updatedService);
                }
            }
            catch
            {
                // logger
            }
            return BadRequest();
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteService([FromRoute] int id)
        {
            try
            {
                var success = await _serviceDelete.DeleteService(id);

                if (success) return Ok();
            }
            catch
            {
                // logger
            }
            return BadRequest();
        }
    }
}
