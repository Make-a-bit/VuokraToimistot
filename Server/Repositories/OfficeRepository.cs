using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class OfficeRepository
    {
        private readonly DBManager _dbManager;

        public OfficeRepository(DBManager dBManager)
        {
            _dbManager = dBManager;
        }

        /// <summary>
        /// Get all offices from the database
        /// </summary>
        /// <returns></returns>
        public async Task<List<Office>> GetOffices()
        {
            var offices = new List<Office>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT * FROM Offices", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var office = new Office
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("office_id")),
                        Name = reader.GetString(reader.GetOrdinal("office_name")),
                        Address = reader.GetString(reader.GetOrdinal("office_address")),
                        PostalCode = reader.GetString(reader.GetOrdinal("office_postalcode")),
                        City = reader.GetString(reader.GetOrdinal("office_city")),
                        Country = reader.GetString(reader.GetOrdinal("office_country")),
                        Phone = reader.GetString(reader.GetOrdinal("office_phone")),
                        Email = reader.GetString(reader.GetOrdinal("office_email")),
                    };

                    offices.Add(office);
                }
                return offices;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get office by office id from the database
        /// </summary>
        /// <param name="officeId"></param>
        /// <returns></returns>
        public async Task<Office> GetOffice(int officeId)
        {
            var office = new Office();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT * FROM Offices 
                WHERE office_id = @officeId", conn);

                cmd.Parameters.AddWithValue("@officeId", officeId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    office.Id = reader.GetInt32(reader.GetOrdinal("office_id"));
                    office.Name = reader.GetString(reader.GetOrdinal("office_name"));
                    office.Address = reader.GetString(reader.GetOrdinal("office_address"));
                    office.PostalCode = reader.GetString(reader.GetOrdinal("office_postalcode"));
                    office.City = reader.GetString(reader.GetOrdinal("office_city"));
                    office.Country = reader.GetString(reader.GetOrdinal("office_country"));
                    office.Email = reader.GetString(reader.GetOrdinal("office_email"));
                    office.Phone = reader.GetString(reader.GetOrdinal("office_phone"));
                }

                return office;
            }
            catch
            {
                throw;
            }
        }
    }
}
