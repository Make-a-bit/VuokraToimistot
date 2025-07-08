using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class ServiceAdd
    {
        private readonly DBManager _dbManager;

        public ServiceAdd(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<int?> AddService(Service service)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = (SqlTransaction)await conn.BeginTransactionAsync();

            try
            {
                using var cmd = new SqlCommand(@"
                INSERT INTO Office_services (
                    office_id, 
                    service_name, 
                    service_unit, 
                    service_price, 
                    service_vat) 
                OUTPUT INSERTED.service_id
                VALUES (
                    @id, 
                    @name, 
                    @unit, 
                    @price, 
                    @vat)", 
                conn, transaction);

                cmd.Parameters.AddWithValue("@id", service.OfficeId);
                cmd.Parameters.AddWithValue("@name", service.Name);
                cmd.Parameters.AddWithValue("@unit", service.Unit);
                cmd.Parameters.AddWithValue("@price", service.Price);
                cmd.Parameters.AddWithValue("@vat", service.Vat);

                var result = await cmd.ExecuteScalarAsync();
                await transaction.CommitAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch 
            {
                // logger
                await transaction.RollbackAsync();
            }

            return null;
        }
    }
}
