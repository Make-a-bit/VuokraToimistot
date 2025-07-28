using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class PropertyUpdate
    {
        private readonly DBManager _dbManager;

        public PropertyUpdate(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Asynchronously updates the specified property in the database.
        /// </summary>
        /// <remarks>This method uses a database transaction to ensure that the update operation is
        /// atomic. If an exception occurs during the update, the transaction is rolled back, and the method returns
        /// <see langword="false"/>.</remarks>
        /// <param name="property">The property to update, containing the new values for the office ID, name, area, and price.</param>
        /// <returns><see langword="true"/> if the property was successfully updated; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> UpdatePropertyAsync(Property property)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                UPDATE Office_Properties
                SET 
                    office_id = @oId, 
                    property_name = @name, 
                    property_area = @area, 
                    property_price = @price
                WHERE property_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@oId", property.OfficeId);
                cmd.Parameters.AddWithValue("@name", property.Name);
                cmd.Parameters.AddWithValue("@area", property.Area);
                cmd.Parameters.AddWithValue("@id", property.Id);
                cmd.Parameters.AddWithValue("@price", property.Price);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                await transaction.CommitAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                // logger
                await transaction.RollbackAsync();
            }
            return false;
        }
    }
}