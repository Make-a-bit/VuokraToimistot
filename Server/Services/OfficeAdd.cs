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

        public async Task<bool> AddOffice(Office office)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("INSERT INTO Offices " +
                    "office_name, office_address, office_postalcode, office_city, " +
                    "office_country, office_phone, office_email) " +
                    "VALUES (@name, @address, @postal, @city, @country, @phone, @email)", conn);

                cmd.Parameters.AddWithValue("@name", office.Name);
                cmd.Parameters.AddWithValue("@address", office.Address);
                cmd.Parameters.AddWithValue("@postal", office.PostalCode);
                cmd.Parameters.AddWithValue("@city", office.City);
                cmd.Parameters.AddWithValue("@country", office.Country);
                cmd.Parameters.AddWithValue("@phone", office.Phone);
                cmd.Parameters.AddWithValue("@email", office.Email);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR: ", ex.ToString());
                return false;
            }
        }
    }
}
