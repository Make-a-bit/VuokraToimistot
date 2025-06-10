using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    public class CustomerController : Controller
    {
        private readonly CustomerAdd _customerAdd;
        private readonly CustomerRepository _customerRepo;

        public CustomerController(CustomerAdd customerAdd, CustomerRepository customerRepo)
        {
            _customerAdd = customerAdd;
            _customerRepo = customerRepo;
        }

        [HttpPost]
        public async Task<ActionResult> CreateCustomer([FromBody] Customer customer)
        {
            var success = await _customerAdd.AddCustomer(customer);

            if (success) return Ok();

            else return BadRequest();
        }

        [HttpGet]
        public async Task<ActionResult<List<Customer>>> GetCustomers()
        {
            var customers = await _customerRepo.GetCustomers();

            return Ok(customers);
        }
    }
}
