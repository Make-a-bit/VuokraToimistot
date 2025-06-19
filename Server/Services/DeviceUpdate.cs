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

            using var cmd = new SqlCommand("UPDATE Office_devices " +
                "SET device_name = @name, device_price = @price, reserved = @rsv " +
                "WHERE device_id = @id", conn);

            cmd.Parameters.AddWithValue("@id", device.Id);
            cmd.Parameters.AddWithValue("@name", device.Name);
            cmd.Parameters.AddWithValue("@price", device.Price);
            cmd.Parameters.AddWithValue("@rsv", device.Reserved);

            int rowsAffected = await cmd.ExecuteNonQueryAsync();

            return rowsAffected > 0;
        }
    }
}
