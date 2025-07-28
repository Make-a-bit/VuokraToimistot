using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class OfficeUpdate
    {
        private readonly DBManager _dbManager;

        public OfficeUpdate(DBManager dBManager)
        {
            _dbManager = dBManager;
        }

        /// <summary>
        /// Updates the details of an existing office in the database.
        /// </summary>
        /// <remarks>This method performs an asynchronous update operation on the database. It uses a
        /// transaction to ensure that the update is atomic. If an exception occurs during the update, the transaction
        /// is rolled back, and the method returns <see langword="false"/>.</remarks>
        /// <param name="office">The <see cref="Office"/> object containing updated information for the office. The <c>Id</c> property must
        /// be set to identify the office to update.</param>
        /// <returns><see langword="true"/> if the office was successfully updated; otherwise, <see langword="false"/>.</returns>
        public async Task<bool> UpdateOfficeAsync(Office office)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                UPDATE Offices 
                SET 
                    office_name = @name, 
                    office_email = @email, 
                    office_phone = @phone,
                    office_address = @address, 
                    office_postalcode = @postal, 
                    office_city = @city, 
                    office_country = @country  
                WHERE office_id = @id",
                conn, transaction);

                cmd.Parameters.AddWithValue("@name", office.Name);
                cmd.Parameters.AddWithValue("@email", office.Email);
                cmd.Parameters.AddWithValue("@phone", office.Phone);
                cmd.Parameters.AddWithValue("@address", office.Address);
                cmd.Parameters.AddWithValue("@postal", office.PostalCode);
                cmd.Parameters.AddWithValue("@city", office.City);
                cmd.Parameters.AddWithValue("@country", office.Country);
                cmd.Parameters.AddWithValue("@id", office.Id);

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
