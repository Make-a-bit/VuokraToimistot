using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class CustomerRepository
    {
        private readonly DBManager _dbManager;

        public CustomerRepository(DBManager dbManager)
        {
            _dbManager = dbManager;
        }

        /// <summary>
        /// Asynchronously retrieves a list of all customers from the database.
        /// </summary>
        /// <remarks>This method establishes a connection to the database, executes a query to select all
        /// customer records, and returns them as a list of <see cref="Customer"/> objects. Ensure that the database
        /// connection is properly configured before calling this method.</remarks>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Customer"/>
        /// objects representing all customers in the database. The list will be empty if no customers are found.</returns>
        public async Task<List<Customer>> GetAllCustomersAsync()
        {
            var customers = new List<Customer>();

            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT * FROM Customers", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var customer = new Customer
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("customer_id")),
                        Name = reader.GetString(reader.GetOrdinal("customer_name")),
                        Email = reader.GetString(reader.GetOrdinal("customer_email")),
                        Phone = reader.GetString(reader.GetOrdinal("customer_phone")),
                        Address = reader.GetString(reader.GetOrdinal("customer_address")),
                        PostalCode = reader.GetString(reader.GetOrdinal("customer_postalcode")),
                        City = reader.GetString(reader.GetOrdinal("customer_city")),
                        Country = reader.GetString(reader.GetOrdinal("customer_country"))
                    };

                    customers.Add(customer);
                }
                return customers;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Asynchronously retrieves a customer by their unique identifier.
        /// </summary>
        /// <remarks>This method opens a connection to the database and executes a query to retrieve the
        /// customer details. Ensure that the database connection is properly configured before calling this
        /// method.</remarks>
        /// <param name="customerId">The unique identifier of the customer to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="Customer"/>
        /// object with the specified identifier, or a default <see cref="Customer"/> object if no customer is found.</returns>
        public async Task<Customer> GetCustomerAsync(int customerId)
        {
            var customer = new Customer();

            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT * FROM Customers 
                WHERE customer_id = @customerId", conn);

                cmd.Parameters.AddWithValue("@customerId", customerId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    customer.Id = reader.GetInt32(reader.GetOrdinal("customer_id"));
                    customer.Name = reader.GetString(reader.GetOrdinal("customer_name"));
                    customer.Address = reader.GetString(reader.GetOrdinal("customer_address"));
                    customer.PostalCode = reader.GetString(reader.GetOrdinal("customer_postalcode"));
                    customer.City = reader.GetString(reader.GetOrdinal("customer_city"));
                    customer.Country = reader.GetString(reader.GetOrdinal("customer_country"));
                    customer.Email = reader.GetString(reader.GetOrdinal("customer_email"));
                    customer.Phone = reader.GetString(reader.GetOrdinal("customer_phone"));
                }
                return customer;
            }
            catch
            {
                throw;
            }
        }
    }
}