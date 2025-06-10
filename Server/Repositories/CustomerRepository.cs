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

        public async Task<List<Customer>> GetCustomers()
        {
            var customers = new List<Customer>();

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
    }
}