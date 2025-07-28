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
            try
            {
                var customerID = await _customerAdd.AddCustomerAsync(customer);

                if (!customerID.HasValue)
                    return BadRequest();

                customer.Id = customerID.Value;
                return Ok(customer);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Customer>>> GetCustomers()
        {
            try
            {
                var customers = await _customerRepo.GetAllCustomersAsync();

                return Ok(customers);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("update")]
        public async Task<ActionResult> UpdateCustomer([FromBody] Customer customer)
        {
            try
            {
                if (await _customerUpdate.UpdateCustomerAsync(customer))
                {
                    var updatedCustomer = await _customerRepo.GetCustomerAsync(customer.Id);
                    return Ok(updatedCustomer);
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
        public async Task<ActionResult> DeleteCustomer([FromRoute] int id)
        {
            try
            {
                if (await _customerDel.DeleteCustomerAsync(id))
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
