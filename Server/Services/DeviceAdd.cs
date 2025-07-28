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

        /// <summary>
        /// Adds a new device to the database and returns the generated device ID.
        /// </summary>
        /// <remarks>This method opens a database connection and executes an SQL command to insert a new
        /// device record. It uses a transaction to ensure that the operation is atomic. If an exception occurs during
        /// the operation, the transaction is rolled back, and the method returns <see langword="null"/>.</remarks>
        /// <param name="device">The <see cref="Device"/> object containing the details of the device to be added. The <paramref
        /// name="device"/> cannot be null.</param>
        /// <returns>The ID of the newly inserted device if the operation is successful; otherwise, <see langword="null"/>.</returns>
        public async Task<int?> AddDeviceAsync(Device device)
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
