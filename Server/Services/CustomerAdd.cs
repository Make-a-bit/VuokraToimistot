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

        /// <summary>
        /// Adds a new customer to the database and returns the unique identifier of the newly inserted customer.   
        /// </summary>
        /// <returns>The unique identifier of the newly inserted customer if the operation is successful; otherwise, <see
        /// langword="null"/>.</returns>
        public async Task<int?> AddCustomerAsync(Customer customer)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                INSERT INTO Customers (
                    customer_name, 
                    customer_email, 
                    customer_phone, 
                    customer_address, 
                    customer_postalcode, 
                    customer_city, 
                    customer_country)
                OUTPUT INSERTED.customer_id 
                VALUES (
                    @name, 
                    @email, 
                    @phone, 
                    @address, 
                    @postal, 
                    @city, 
                    @country)",
                conn, transaction);

                cmd.Parameters.AddWithValue("@name", customer.Name);
                cmd.Parameters.AddWithValue("@email", customer.Email);
                cmd.Parameters.AddWithValue("@phone", customer.Phone);
                cmd.Parameters.AddWithValue("@address", customer.Address);
                cmd.Parameters.AddWithValue("@postal", customer.PostalCode);
                cmd.Parameters.AddWithValue("@city", customer.City);
                cmd.Parameters.AddWithValue("@country", customer.Country);

                var result = await cmd.ExecuteScalarAsync();
                await transaction.CommitAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch (Exception ex)
            {
                // logger
                await transaction.RollbackAsync();
            }

            return null;
        }
    }
}