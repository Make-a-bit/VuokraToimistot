using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class DeviceUpdate
    {
        private readonly DBManager _dbManager;

        public DeviceUpdate(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> UpdateDevice(Device device)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                UPDATE Office_devices
                SET 
                    device_name = @name, 
                    device_price = @price, 
                    device_vat = @vat
                WHERE device_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", device.Id);
                cmd.Parameters.AddWithValue("@name", device.Name);
                cmd.Parameters.AddWithValue("@price", device.Price);
                cmd.Parameters.AddWithValue("@vat", device.Vat);

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
