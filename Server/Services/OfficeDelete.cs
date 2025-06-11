using Microsoft.Data.SqlClient;

namespace API.Services
{
    public class OfficeDelete
    {
        private readonly DBManager _dbManager;

        public OfficeDelete(DBManager db)
        {
            _dbManager = db;
        }

        public async Task<bool> DeleteOffice(int id)
        {
            try
            {
                var conn = _dbManager.GetConnection();
                await conn.OpenAsync();

                using var cmd = new SqlCommand("DELETE FROM Offices " +
                    "WHERE office_id = @id", conn);

                cmd.Parameters.AddWithValue("@id", id);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return false;
        }
    }
}
