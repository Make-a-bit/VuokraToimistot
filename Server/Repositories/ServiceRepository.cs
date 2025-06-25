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

        public async Task<List<Service>> GetServicesByOfficeId(int id)
        {
            var services = new List<Service>();

            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            using var cmd = new SqlCommand("SELECT * FROM Office_services " +
                "WHERE office_id = @id", conn);
            cmd.Parameters.AddWithValue("@id", id);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var service = new Service
                {
                    Id = reader.GetInt32(reader.GetOrdinal("service_id")),
                    OfficeId = reader.GetInt32(reader.GetOrdinal("office_id")),
                    Name = reader.GetString(reader.GetOrdinal("service_name")),
                    Unit = reader.GetString(reader.GetOrdinal("service_unit")),
                    Price = reader.GetDecimal(reader.GetOrdinal("service_price"))
                };

                services.Add(service);
            }
            return services;
        }

        public async Task<Service> GetServiceById(int id)
        {
            var service = new Service();

            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();

            using var cmd = new SqlCommand("SELECT * FROM Office_services " +
                "WHERE service_id = @id", conn);

            cmd.Parameters.AddWithValue("@id", id);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                service.Id = reader.GetInt32(reader.GetOrdinal("service_id"));
                service.OfficeId = reader.GetInt32(reader.GetOrdinal("office_id"));
                service.Name = reader.GetString(reader.GetOrdinal("service_name"));
                service.Unit = reader.GetString(reader.GetOrdinal("service_unit"));
                service.Price = reader.GetDecimal(reader.GetOrdinal("service_price"));
            }
            return service;
        }
    }
}
