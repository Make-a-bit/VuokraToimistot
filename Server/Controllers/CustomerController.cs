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
        private readonly CustomerDelete _customerDel;
        private readonly CustomerRepository _customerRepo;
        private readonly CustomerUpdate _customerUpdate;

        public CustomerController(CustomerAdd customerAdd, CustomerDelete customerDel, CustomerRepository customerRepo, CustomerUpdate customerUpdate)
        {
            _customerAdd = customerAdd;
            _customerDel = customerDel;
            _customerRepo = customerRepo;
            _customerUpdate = customerUpdate;
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

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateCustomer([FromBody] Customer customer)
        {
            var success = await _customerUpdate.UpdateCustomer(customer);

            if (success) return Ok();

            else return BadRequest();
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteCustomer([FromRoute] int id)
        {
            var success = await _customerDel.DeleteCustomer(id);

            if (success) return Ok();

            else return BadRequest();
        }
    }
}
