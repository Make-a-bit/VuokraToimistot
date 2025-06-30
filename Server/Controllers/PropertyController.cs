using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
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

        [HttpGet]
        public async Task<ActionResult<List<Property>>> GetProperties([FromQuery] int id)
        {
            var properties = await _propertyRepository.GetPropertiesByOfficeId(id);

            return Ok(properties);
        }

        [HttpPost]
        public async Task<ActionResult> CreateOfficeProperty([FromBody] Property property)
        {
            try
            {
                var propertyId = await _propertyAdd.AddProperty(property);

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
            var success = await _propertyUpdate.UpdateProperty(property);

            if (success)
            {
                var updatedProperty = await _propertyRepository.GetPropertyById(property.Id);
                return Ok(updatedProperty);
            }

            else return BadRequest();
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteProperty([FromRoute] int id)
        {
            var success = await _propertyDelete.DeleteProperty(id);

            if (success) return Ok();

            else return BadRequest();
        }
    }
}
