using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class DeviceRepository
    {
        private readonly DBManager _dbManager;

        public DeviceRepository(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Get all devices from the database
        /// </summary>
        /// <returns></returns>
        public async Task<List<Device>> GetDevices()
        {
            var devices = new List<Device>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    d.device_id,
                    d.office_id,
                    d.device_name,
                    d.device_price,
                    v.vat_value,
                    o.office_name
                FROM Office_devices d
                JOIN VAT v ON d.device_vat = v.vat_id
                JOIN Offices o ON d.office_id = o.office_id", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var device = new Device
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("device_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        OfficeName = reader.GetString(reader.GetOrdinal("office_name")),
                        Name = reader.GetString(reader.GetOrdinal("device_name")),
                        Price = reader.GetDecimal(reader.GetOrdinal("device_price")),
                        Vat = reader.GetDecimal(reader.GetOrdinal("vat_value"))
                    };
                    devices.Add(device);
                }
                return devices;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get all devices by office from the database
        /// </summary>
        /// <param name="officeId"></param>
        /// <returns></returns>
        public async Task<List<Device>> GetDevices(int officeId)
        {
            var devices = new List<Device>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    d.device_id,
                    d.office_id,
                    d.device_name,
                    d.device_price,
                    v.vat_value,
                    o.office_name
                FROM Office_devices d
                JOIN VAT v ON d.device_vat = v.vat_id
                JOIN Offices o ON d.office_id = o.office_id
                WHERE d.office_id = @officeId", conn);

                cmd.Parameters.AddWithValue("@officeId", officeId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var device = new Device
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("device_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        OfficeName = reader.GetString(reader.GetOrdinal("office_name")),
                        Name = reader.GetString(reader.GetOrdinal("device_name")),
                        Price = reader.GetDecimal(reader.GetOrdinal("device_price")),
                        Vat = reader.GetDecimal(reader.GetOrdinal("vat_value"))
                    };

                    devices.Add(device);
                }
                return devices;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get device by device id from the database
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task<Device> GetDevice(int deviceId)
        {
            var device = new Device();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT * FROM Office_devices 
                WHERE device_id = @device", conn);

                cmd.Parameters.AddWithValue("@device", deviceId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    device.Id = reader.GetInt32(reader.GetOrdinal("device_id"));
                    device.OfficeId = reader.GetInt32(reader.GetOrdinal("office_id"));
                    device.Name = reader.GetString(reader.GetOrdinal("device_name"));
                    device.Price = reader.GetDecimal(reader.GetOrdinal("device_price"));
                    device.Vat = reader.GetDecimal(reader.GetOrdinal("device_vat"));
                }

                return device;
            }
            catch
            {
                throw;
            }
        }
    }
}
