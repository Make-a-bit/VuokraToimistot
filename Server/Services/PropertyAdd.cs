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

        /// <summary>
        /// Asynchronously adds a new property to the database and returns the generated property ID.
        /// </summary>
        /// <remarks>This method opens a database connection and begins a transaction to insert a new
        /// property record. If the insertion is successful, the transaction is committed, and the new property ID is
        /// returned. In case of an exception, the transaction is rolled back, and <see langword="null"/> is
        /// returned.</remarks>
        /// <param name="property">The property to be added, containing details such as office ID, name, area, and price.</param>
        /// <returns>The ID of the newly inserted property if the operation is successful; otherwise, <see langword="null"/>.</returns>
        public async Task<int?> AddPropertyAsync(Property property)
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
                    property_price,
                    property_vat) 
                OUTPUT INSERTED.property_id
                VALUES (
                    @oId, 
                    @name, 
                    @area, 
                    @price,
                    @vat)",
                conn, transaction);

                cmd.Parameters.AddWithValue("@oId", property.OfficeId);
                cmd.Parameters.AddWithValue("@name", property.Name);
                cmd.Parameters.AddWithValue("@area", property.Area);
                cmd.Parameters.AddWithValue("@price", property.Price);
                cmd.Parameters.AddWithValue("@vat", property.VAT);

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
                Console.WriteLine(ex.ToString());
                await transaction.RollbackAsync();
            }

            return null;
        }
    }
}
