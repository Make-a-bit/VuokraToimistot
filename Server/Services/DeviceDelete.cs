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

        public async Task<bool> DeleteDevice(int id)
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
