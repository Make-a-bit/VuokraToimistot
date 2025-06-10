using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class CustomerAdd
    {
        private readonly DBManager _dbManager;

        public CustomerAdd(DBManager dBManager)
        {
            _dbManager = dBManager;
        }

        public async Task<bool> AddCustomer(Customer customer)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("INSERT INTO Customers " +
                    "(customer_name, customer_email, customer_phone, customer_address, " +
                    "customer_postalcode, customer_city, customer_country) VALUES " +
                    "(@name, @email, @phone, @address, @postal, @city, @country)", conn);

                cmd.Parameters.AddWithValue("@name", customer.Name);
                cmd.Parameters.AddWithValue("@email", customer.Email);
                cmd.Parameters.AddWithValue("@phone", customer.Phone);
                cmd.Parameters.AddWithValue("@address", customer.Address);
                cmd.Parameters.AddWithValue("@postal", customer.PostalCode);
                cmd.Parameters.AddWithValue("@city", customer.City);
                cmd.Parameters.AddWithValue("@country", customer.Country);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: ", ex);
            }

            return false;
        }
    }
}