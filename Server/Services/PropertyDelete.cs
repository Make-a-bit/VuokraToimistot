using Microsoft.Data.SqlClient;
using System.Runtime.CompilerServices;

namespace API.Services
{
    public class PropertyDelete
    {
        private readonly DBManager _dbManager;

        public PropertyDelete(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Deletes a property from the database based on the specified identifier.
        /// </summary>
        /// <remarks>This method performs the deletion from a database with transaction. If the operation
        /// fails, the transaction is rolled back.</remarks>
        /// <param name="id">The unique identifier of the property to be deleted. Must be a positive integer.</param>
        /// <returns><see langword="true"/> if the property was successfully deleted; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> DeletePropertyAsync(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Office_Properties
                WHERE property_id = @id",
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
            }
            return false;
        }
    }
}
