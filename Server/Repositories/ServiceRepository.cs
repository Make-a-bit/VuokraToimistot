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
        /// Get all services from the database
        /// </summary>
        /// <returns></returns>
        public async Task<List<Service>> GetServices()
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
        /// Get services by office id from the database
        /// </summary>
        /// <param name="officeId"></param>
        /// <returns></returns>
        public async Task<List<Service>> GetServices(int officeId)
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
        /// Get service by service id from the database
        /// </summary>
        /// <param name="serviceId"></param>
        /// <returns></returns>
        public async Task<Service> GetService(int serviceId)
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
