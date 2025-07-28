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
        /// Asynchronously retrieves a list of all devices from the database.
        /// </summary>
        /// <remarks>This method connects to the database to fetch device information, including device
        /// ID, office ID, device name, price, VAT value, and office name. It returns a list of <see cref="Device"/>
        /// objects representing each device.</remarks>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Device"/>
        /// objects, where each object includes details such as the device ID, office ID, office name, device name,
        /// price, and VAT value.</returns>
        public async Task<List<Device>> GetAllDevicesAsync()
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
        /// Asynchronously retrieves a list of all devices associated with a specified office.
        /// </summary>
        /// <param name="officeId">The unique identifier of the office for which to retrieve devices. Must be a valid office ID.</param>
        /// <returns>A task representing the asynchronous operation. The task result contains a list of <see cref="Device"/>
        /// objects associated with the specified office. The list will be empty if no devices are found.</returns>
        public async Task<List<Device>> GetAllDevicesAsync(int officeId)
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
        /// Asynchronously retrieves a device by its identifier from the database.
        /// </summary>
        /// <remarks>This method establishes a connection to the database, executes a query to find the
        /// device with the specified identifier, and populates a <see cref="Device"/> object with the retrieved
        /// data.</remarks>
        /// <param name="deviceId">The unique identifier of the device to retrieve. Must be a positive integer.</param>
        /// <returns>A <see cref="Device"/> object representing the device with the specified identifier. If no device is found,
        /// the returned object will have default values.</returns>
        public async Task<Device> GetDeviceAsync(int deviceId)
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
