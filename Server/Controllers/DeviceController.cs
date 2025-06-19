using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    public class DeviceController : Controller
    {
        private readonly DeviceAdd _deviceAdd;
        private readonly DeviceDelete _deviceDelete;
        private readonly DeviceRepository _deviceRepository;
        private readonly DeviceUpdate _deviceUpdate;

        public DeviceController(DeviceAdd da, DeviceRepository dr, DeviceUpdate du, DeviceDelete dd)
        {
            _deviceAdd = da;
            _deviceDelete = dd;
            _deviceRepository = dr;
            _deviceUpdate = du;
        }

        [HttpGet]
        public async Task<ActionResult<List<Device>>> GetDevicesByOfficeId([FromQuery] int id)
        {
            try
            {
                var devices = await _deviceRepository.GetDevicesByOfficeId(id);

                return Ok(devices);
            }
            catch (Exception ex)
            {
                // Logger
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateDevice([FromBody] Device device)
        {
            try
            {
                var deviceId = await _deviceAdd.AddDevice(device);
                device.Id = deviceId.Value;

                return Ok(device);
            }
            catch (Exception ex)
            {
                // logger
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateDevice([FromBody] Device device)
        {
            try
            {
                var success = await _deviceUpdate.UpdateDevice(device);

                if (success)
                {
                    var updatedDevice = await _deviceRepository.GetDeviceById(device.Id);
                    return Ok(updatedDevice);
                }
            }
            catch (Exception ex) 
            {
                // logger
            }
            
            return BadRequest();
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteDevice([FromRoute] int id)
        {
            try
            {
                var success = await _deviceDelete.DeleteDevice(id);

                if (success) return Ok();
            }
            catch (Exception ex)
            {
                // Logger
            }
            
            return BadRequest();
        }
    }
}
