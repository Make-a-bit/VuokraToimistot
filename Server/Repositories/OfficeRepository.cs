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
        /// Asynchronously retrieves a list of all offices from the database.
        /// </summary>
        /// <remarks>This method establishes a connection to the database, executes a query to select all
        /// records from the Offices table, and returns a list of <see cref="Office"/> objects representing each
        /// office.</remarks>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Office"/>
        /// objects, each representing an office retrieved from the database. The list will be empty if no offices are
        /// found.</returns>
        public async Task<List<Office>> GetAllOfficesAsync()
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
        /// Asynchronously retrieves the details of an office by its unique identifier.
        /// </summary>
        /// <remarks>This method opens a database connection to retrieve office details. Ensure that the
        /// database connection is properly configured before calling this method. The method will throw exceptions for
        /// any database-related issues, which should be handled by the caller.</remarks>
        /// <param name="officeId">The unique identifier of the office to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="Office"/> object
        /// with the details of the specified office. If the office is not found, the properties of the returned <see
        /// cref="Office"/> object will be uninitialized.</returns>
        public async Task<Office> GetOfficeAsync(int officeId)
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
