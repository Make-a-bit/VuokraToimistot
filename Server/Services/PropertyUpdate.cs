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

        public async Task<bool> UpdateProperty(Property property)
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