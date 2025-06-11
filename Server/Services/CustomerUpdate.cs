using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class CustomerUpdate
    {
        private readonly DBManager _dbManager;

        public CustomerUpdate(DBManager dBManager)
        {
            _dbManager = dBManager;
        }

        public async Task<bool> UpdateCustomer(Customer customer)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("UPDATE Customers " +
                    "SET customer_name = @name, customer_email = @email, customer_phone = @phone, " +
                    "customer_address = @address, customer_postalcode = @postal, customer_city = @city, " +
                    "customer_country = @country " +
                    "WHERE customer_id = @id", conn);

                cmd.Parameters.AddWithValue("@name", customer.Name);
                cmd.Parameters.AddWithValue("@email", customer.Email);
                cmd.Parameters.AddWithValue("@phone", customer.Phone);
                cmd.Parameters.AddWithValue("@address", customer.Address);
                cmd.Parameters.AddWithValue("@postal", customer.PostalCode);
                cmd.Parameters.AddWithValue("@city", customer.City);
                cmd.Parameters.AddWithValue("@country", customer.Country);
                cmd.Parameters.AddWithValue("@id", customer.Id);

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
