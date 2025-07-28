using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class OfficeAdd
    {
        private readonly DBManager _dbManager;

        public OfficeAdd(DBManager dBManager)
        {
            _dbManager = dBManager;
        }

        /// <summary>
        /// Adds a new office to the database and returns the unique identifier of the newly inserted office.
        /// </summary>
        /// <remarks>This method opens a database connection and begins a transaction to insert a new
        /// office record. The transaction is committed if the insertion is successful, or rolled back if an exception
        /// occurs.</remarks>
        /// <param name="office">The <see cref="Office"/> object containing the details of the office to be added. Cannot be null.</param>
        /// <returns>The unique identifier of the newly inserted office.</returns>
        public async Task<int?> AddOfficeAsync(Office office)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                INSERT INTO Offices (
                    office_name, 
                    office_address, 
                    office_postalcode, 
                    office_city, 
                    office_country, 
                    office_phone, 
                    office_email)
                OUTPUT INSERTED.office_id
                VALUES (
                    @name, 
                    @address, 
                    @postal, 
                    @city, 
                    @country, 
                    @phone, 
                    @email)",
                conn, transaction);

                cmd.Parameters.AddWithValue("@name", office.Name);
                cmd.Parameters.AddWithValue("@address", office.Address);
                cmd.Parameters.AddWithValue("@postal", office.PostalCode);
                cmd.Parameters.AddWithValue("@city", office.City);
                cmd.Parameters.AddWithValue("@country", office.Country);
                cmd.Parameters.AddWithValue("@phone", office.Phone);
                cmd.Parameters.AddWithValue("@email", office.Email);

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
