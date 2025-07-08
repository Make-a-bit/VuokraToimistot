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

        public async Task<int?> AddOffice(Office office)
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
