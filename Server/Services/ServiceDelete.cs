using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class ServiceDelete
    {
        private readonly DBManager _dbManager;

        public ServiceDelete(DBManager db)
        {
            _dbManager = db;
        }
        /// <summary>
        /// Asynchronously deletes a service from the database based on the specified service ID.
        /// </summary>
        /// <remarks>This method performs the deletion within a database transaction. If an error occurs
        /// during the operation, the transaction is rolled back, and the method returns <see
        /// langword="false"/>.</remarks>
        /// <param name="id">The unique identifier of the service to be deleted. Must be a valid service ID.</param>
        /// <returns><see langword="true"/> if the service was successfully deleted; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> DeleteServiceAsync(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Office_services
                WHERE service_id = @id", 
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch (SqlException ex)
            {
                // logger
                await transaction.RollbackAsync();
                return false;
            }
        }
    }
}
