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
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                INSERT INTO Office_devices (
                    office_id, 
                    device_name, 
                    device_price, 
                    device_vat) 
                OUTPUT INSERTED.device_id
                VALUES (
                    @id, 
                    @name, 
                    @price, 
                    @vat)",
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", device.OfficeId);
                cmd.Parameters.AddWithValue("@name", device.Name);
                cmd.Parameters.AddWithValue("@price", device.Price);
                cmd.Parameters.AddWithValue("@vat", device.Vat);

                var result = await cmd.ExecuteScalarAsync();
                await transaction.CommitAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch (SqlException ex)
            {
                // logger
                await transaction.RollbackAsync();
            }

            return null;
        }
    }
}
