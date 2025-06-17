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

        public async Task<int?> AddCustomer(Customer customer)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("INSERT INTO Customers " +
                    "(customer_name, customer_email, customer_phone, customer_address, " +
                    "customer_postalcode, customer_city, customer_country) " +
                    "OUTPUT INSERTED.customer_id " + 
                    "VALUES " +
                    "(@name, @email, @phone, @address, @postal, @city, @country)", conn);

                cmd.Parameters.AddWithValue("@name", customer.Name);
                cmd.Parameters.AddWithValue("@email", customer.Email);
                cmd.Parameters.AddWithValue("@phone", customer.Phone);
                cmd.Parameters.AddWithValue("@address", customer.Address);
                cmd.Parameters.AddWithValue("@postal", customer.PostalCode);
                cmd.Parameters.AddWithValue("@city", customer.City);
                cmd.Parameters.AddWithValue("@country", customer.Country);

                var result = await cmd.ExecuteScalarAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error while creating a new customer: ", ex.ToString());
            }

            return null;
        }
    }
}