using Microsoft.Data.SqlClient;
using System.Transactions;

namespace API.Services
{
    public class CustomerDelete
    {
        private readonly DBManager _dbManager;

        public CustomerDelete(DBManager dBManager)
        {
            _dbManager = dBManager;
        }

        /// <summary>
        /// Deletes a customer from the database based on the specified customer ID.
        /// </summary>
        /// <remarks>This method performs the deletion within a database transaction. If an error occurs
        /// during the operation, the transaction is rolled back, and the method returns <see
        /// langword="false"/>.</remarks>
        /// <param name="id">The unique identifier of the customer to be deleted. Must be a positive integer.</param>
        /// <returns><see langword="true"/> if the customer was successfully deleted; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> DeleteCustomerAsync(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Customers
                WHERE customer_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
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
