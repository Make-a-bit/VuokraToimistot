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

        /// <summary>
        /// Updates the specified device in the database with new values.
        /// </summary>
        /// <remarks>This method updates the device's name, price, and VAT in the database. It uses a
        /// transaction to ensure that the update is atomic. If the update fails, the transaction is rolled back, and
        /// the method returns <see langword="false"/>.</remarks>
        /// <param name="device">The <see cref="Device"/> object containing updated information to be saved.</param>
        /// <returns><see langword="true"/> if the device was successfully updated; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> UpdateDeviceAsync(Device device)
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
                cmd.Parameters.AddWithValue("@vat", device.VatId);

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
