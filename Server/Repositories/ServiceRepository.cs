using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class ServiceRepository
    {
        private readonly DBManager _dbManager;

        public ServiceRepository(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Asynchronously retrieves a list of all services from the database.
        /// </summary>
        /// <remarks>This method connects to the database, executes a query to retrieve service details,
        /// and returns a list of <see cref="Service"/> objects. Each service includes information such as the service
        /// ID, office ID, office name, service name, unit, price, and VAT value.</remarks>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="Service"/>
        /// objects representing all services available in the database.</returns>
        public async Task<List<Service>> GetAllServicesAsync()
        {
            var services = new List<Service>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    s.service_id,
                    s.office_id,
                    s.service_name,
                    s.service_unit,
                    s.service_price,
                    v.vat_value,
                    o.office_name
                FROM Office_services s
                JOIN VAT v ON s.service_vat = v.vat_id
                JOIN Offices o ON s.office_id = o.office_id", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var service = new Service
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("service_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        OfficeName = reader.GetString(reader.GetOrdinal("office_name")),
                        Name = reader.GetString(reader.GetOrdinal("service_name")),
                        Unit = reader.GetString(reader.GetOrdinal("service_unit")),
                        Price = reader.GetDecimal(reader.GetOrdinal("service_price")),
                        Vat = reader.GetDecimal(reader.GetOrdinal("vat_value"))
                    };
                    services.Add(service);
                }
                return services;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves a list of services for a specified office.
        /// </summary>
        /// <param name="officeId">The identifier of the office for which to retrieve services. Must be a valid office ID.</param>
        /// <returns>A task representing the asynchronous operation. The task result contains a list of <see cref="Service"/>
        /// objects associated with the specified office.</returns>
        public async Task<List<Service>> GetAllServicesAsync(int officeId)
        {
            var services = new List<Service>();

            try
            {
                using var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand(@"
                SELECT 
                    o.service_id,
                    o.office_id,
                    o.service_name,
                    o.service_unit,
                    o.service_price,
                    v.vat_value
                FROM Office_services o
                JOIN VAT v ON o.service_vat = v.vat_id
                WHERE o.office_id = @officeId", conn);

                cmd.Parameters.AddWithValue("@officeId", officeId);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var service = new Service
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("service_id")),
                        OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                        OfficeName = reader.GetString(reader.GetOrdinal("office_name")),
                        Name = reader.GetString(reader.GetOrdinal("service_name")),
                        Unit = reader.GetString(reader.GetOrdinal("service_unit")),
                        Price = reader.GetDecimal(reader.GetOrdinal("service_price")),
                        Vat = reader.GetDecimal(reader.GetOrdinal("vat_value"))
                    };

                    services.Add(service);
                }
                return services;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Asynchronously retrieves a service by its identifier from the database.
        /// </summary>
        /// <remarks>This method establishes a connection to the database, executes a query to retrieve
        /// the service details, and populates a <see cref="Service"/> object with the retrieved data. Ensure that the
        /// database connection is properly configured before calling this method.</remarks>
        /// <param name="serviceId">The unique identifier of the service to retrieve. Must be a positive integer.</param>
        /// <returns>A <see cref="Service"/> object representing the service with the specified identifier. If no service is
        /// found, returns a default <see cref="Service"/> object with uninitialized properties.</returns>
        public async Task<Service> GetServiceAsync(int serviceId)
        {
            var service = new Service();

            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            using var cmd = new SqlCommand(@"
            SELECT * FROM Office_services
            WHERE service_id = @service", conn);

            cmd.Parameters.AddWithValue("@service", serviceId);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                service.Id = reader.GetInt32(reader.GetOrdinal("service_id"));
                service.OfficeId = reader.GetInt32(reader.GetOrdinal("office_id"));
                service.Name = reader.GetString(reader.GetOrdinal("service_name"));
                service.Unit = reader.GetString(reader.GetOrdinal("service_unit"));
                service.Price = reader.GetDecimal(reader.GetOrdinal("service_price"));
                service.Vat = reader.GetDecimal(reader.GetOrdinal("service_vat"));
            }
            return service;
        }
    }
}
