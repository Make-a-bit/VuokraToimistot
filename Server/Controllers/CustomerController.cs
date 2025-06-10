using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]

    public class CustomerController : Controller
    {
        private readonly CustomerAdd _customerAdd;

        public CustomerController(CustomerAdd customerAdd)
        {
            _customerAdd = customerAdd;
        }

        [HttpPost]
        public async Task<ActionResult> CreateCustomer([FromBody] Customer customer)
        {
            var success = await _customerAdd.AddCustomer(customer);

            if (success) return Ok();

            else return BadRequest();
        }
    }
}
