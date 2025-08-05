using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class PropertyController : Controller
    {
        private readonly PropertyAdd _propertyAdd;
        private readonly PropertyDelete _propertyDelete;
        private readonly PropertyRepository _propertyRepository;
        private readonly PropertyUpdate _propertyUpdate;

        public PropertyController(PropertyAdd pa, PropertyRepository pr, PropertyUpdate pu, PropertyDelete pd)
        {
            _propertyAdd = pa;
            _propertyDelete = pd;
            _propertyRepository = pr;
            _propertyUpdate = pu;
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<Property>>> GetProperties()
        {
            try
            {
                var properties = await _propertyRepository.GetAllPropertiesAsync();

                return Ok(properties);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("by-office")]
        public async Task<ActionResult<List<Property>>> GetProperties([FromQuery] int id)
        {
            try
            {
                var properties = await _propertyRepository.GetAllPropertiesAsync(id);

                if (properties.Count > 0)
                    return Ok(properties);

                else return NotFound();
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateOfficeProperty([FromBody] Property property)
        {
            try
            {
                var propertyId = await _propertyAdd.AddPropertyAsync(property);

                if (!propertyId.HasValue)
                    return BadRequest();

                property.Id = propertyId.Value;
                return Ok(property);
            }
            catch  
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateProperty([FromBody] Property property)
        {
            try
            {
                if (await _propertyUpdate.UpdatePropertyAsync(property))
                {
                    var updatedProperty = await _propertyRepository.GetPropertyAsync(property.Id);
                    return Ok(updatedProperty);
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
        public async Task<ActionResult> DeleteProperty([FromRoute] int id)
        {
            try
            {
                if (await _propertyDelete.DeletePropertyAsync(id))
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
