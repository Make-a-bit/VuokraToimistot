using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class DeviceDelete
    {
        private readonly DBManager _dbManager;

        public DeviceDelete(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Deletes a device from the database based on the specified device ID.
        /// </summary>
        /// <remarks>This method performs the deletion within a database transaction. If the operation
        /// fails, the transaction is rolled back.</remarks>
        /// <param name="id">The unique identifier of the device to be deleted. Must be a positive integer.</param>
        /// <returns><see langword="true"/> if the device was successfully deleted; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> DeleteDeviceAsync(int id)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                DELETE FROM Office_devices
                WHERE device_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", id);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch
            {
                // logger
                await transaction.RollbackAsync();
                return false;
            }
        }
    }
}
