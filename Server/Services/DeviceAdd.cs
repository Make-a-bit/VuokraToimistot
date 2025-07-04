using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class DeviceAdd
    {
        private readonly DBManager _dbManager;


        public DeviceAdd(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<int?> AddDevice(Device device)
        {
            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("INSERT INTO Office_devices " +
                    "(office_id, device_name, device_price, device_vat) " +
                    "OUTPUT INSERTED.device_id " +
                    "VALUES (@id, @name, @price, @vat)", conn);

                cmd.Parameters.AddWithValue("@id", device.OfficeId);
                cmd.Parameters.AddWithValue("@name", device.Name);
                cmd.Parameters.AddWithValue("@price", device.Price);
                cmd.Parameters.AddWithValue("@vat", device.Vat);

                var result = await cmd.ExecuteScalarAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine("Database error: ", ex.Message);
                throw;
            }

            return null;
        }
    }
}
