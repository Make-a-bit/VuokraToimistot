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

        /// <summary>
        /// Updates the details of an existing customer in the database.
        /// </summary>
        /// <remarks>This method performs an asynchronous update operation within a database transaction.
        /// If the update fails, the transaction is rolled back, and the method returns <see
        /// langword="false"/>.</remarks>
        /// <param name="customer">The customer object containing updated information. The <see cref="Customer.Id"/> must match an existing
        /// customer in the database.</param>
        /// <returns><see langword="true"/> if the customer was successfully updated; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> UpdateCustomerAsync(Customer customer)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                UPDATE Customers
                SET 
                    customer_name = @name, 
                    customer_email = @email, 
                    customer_phone = @phone, 
                    customer_address = @address, 
                    customer_postalcode = @postal, 
                    customer_city = @city, 
                    customer_country = @country 
                WHERE customer_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@name", customer.Name);
                cmd.Parameters.AddWithValue("@email", customer.Email);
                cmd.Parameters.AddWithValue("@phone", customer.Phone);
                cmd.Parameters.AddWithValue("@address", customer.Address);
                cmd.Parameters.AddWithValue("@postal", customer.PostalCode);
                cmd.Parameters.AddWithValue("@city", customer.City);
                cmd.Parameters.AddWithValue("@country", customer.Country);
                cmd.Parameters.AddWithValue("@id", customer.Id);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                // logger
                await transaction.RollbackAsync();
                return false;
            }
        }
    }
}
