using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class PropertyAdd
    {
        private readonly DBManager _dbManager;

        public PropertyAdd(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<int?> AddProperty(Property property)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                INSERT INTO Office_Properties (
                    office_id, 
                    property_name, 
                    property_area, 
                    property_price) 
                OUTPUT INSERTED.property_id
                VALUES (
                    @oId, 
                    @name, 
                    @area, 
                    @price)",
                conn, transaction);

                cmd.Parameters.AddWithValue("@oId", property.OfficeId);
                cmd.Parameters.AddWithValue("@name", property.Name);
                cmd.Parameters.AddWithValue("@area", property.Area);
                cmd.Parameters.AddWithValue("@price", property.Price);

                var result = await cmd.ExecuteScalarAsync();
                await transaction.CommitAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch (Exception ex)
            {
                // logger
                await transaction.RollbackAsync();
            }

            return null;
        }
    }
}
