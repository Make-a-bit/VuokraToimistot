using API.Entities;
using API.Services;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public class TaxRepository
    {
        private readonly DBManager _dbManager;

        public TaxRepository(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<List<Tax>> GetAllTaxesAsync()
        {
            var taxes = new List<Tax>();

            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("SELECT * FROM VAT", conn);
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var tax = new Tax
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("vat_id")),
                        VatValue = reader.GetDecimal(reader.GetOrdinal("vat_value")),
                        Description = reader.GetString(reader.GetOrdinal("vat_description"))
                    };

                    taxes.Add(tax);
                }
                return taxes;
            }
            catch
            {
                throw;
            }
        }
    }
}
