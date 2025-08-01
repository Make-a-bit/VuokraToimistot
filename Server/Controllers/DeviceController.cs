using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
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

        [HttpGet("all")]
        public async Task<ActionResult<List<Device>>> GetDevices()
        {
            try
            {
                var properties = await _deviceRepository.GetAllDevicesAsync();

                return Ok(properties);
            }
            catch
            {
                return BadRequest();
            }
        }


        [HttpGet("by-office")]
        public async Task<ActionResult> GetDevices([FromQuery] int id)
        {
            try
            {
                var devices = await _deviceRepository.GetAllDevicesAsync(id);

                if (devices.Count > 0)
                    return Ok(devices);

                else return NotFound();
            }
            catch
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
                var deviceId = await _deviceAdd.AddDeviceAsync(device);

                if (!deviceId.HasValue)
                    return BadRequest();

                device.Id = deviceId.Value;
                return Ok(device);
            }
            catch
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
                if (await _deviceUpdate.UpdateDeviceAsync(device))
                {
                    var updatedDevice = await _deviceRepository.GetDeviceAsync(device.Id);
                    return Ok(updatedDevice);
                }

                else return NotFound();
            }
            catch
            {
                // logger
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteDevice([FromRoute] int id)
        {
            try
            {
                if (await _deviceDelete.DeleteDeviceAsync(id))
                    return Ok();

                else return NotFound();
            }
            catch
            {
                // Logger
                return BadRequest();
            }
        }
    }
}
