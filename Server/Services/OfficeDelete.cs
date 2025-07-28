using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class OfficeDelete
    {
        private readonly DBManager _dbManager;

        public OfficeDelete(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Deletes the office with the specified identifier from the database.
        /// </summary>
        /// <remarks>This method performs the deletion within a database transaction. If the operation
        /// fails, the transaction is rolled back.</remarks>
        /// <param name="id">The unique identifier of the office to be deleted. Must be a positive integer.</param>
        /// <returns><see langword="true"/> if the office was successfully deleted; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> DeleteOfficeAsync(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Offices
                WHERE office_id = @id", conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                // Logger
                await transaction.RollbackAsync();
            }
            return false;
        }
    }
}
