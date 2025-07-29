using API.Entities;
using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class TaxAdd
    {
        private readonly DBManager _dbManager;

        public TaxAdd(DBManager db)
        {
            _dbManager = db;
        }

        /// <summary>
        /// Asynchronously adds a new tax entry to the database and returns the generated identifier.
        /// </summary>
        /// <remarks>This method opens a database connection and begins a transaction to insert a new tax
        /// entry. If the insertion is successful, the transaction is committed, and the new entry's identifier is
        /// returned. If an error occurs, the transaction is rolled back, and <see langword="null"/> is
        /// returned.</remarks>
        /// <param name="tax">The <see cref="Tax"/> object containing the tax value and description to be added.</param>
        /// <returns>The identifier of the newly inserted tax entry if the operation is successful; otherwise, <see
        /// langword="null"/>.</returns>
        public async Task<int?> AddTaskAsync(Tax tax)
        {
            using var conn = _dbManager.GetConnection();
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            {
                using var cmd = new SqlCommand(@"
                INSERT INTO VAT (
                    vat_value,
                    vat_description)
                OUTPUT INSERTED.vat_id
                VALUES (
                    @value,
                    @descript)", 
                conn, transaction);

                cmd.Parameters.AddWithValue("@value", tax.VatValue);
                cmd.Parameters.AddWithValue("@descript", tax.Description);

                var result = await cmd.ExecuteScalarAsync();
                await transaction.CommitAsync();

                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    return newId;
                }
            }
            catch
            {
                await transaction.RollbackAsync();
            }
            return null;
        }
    }
}
