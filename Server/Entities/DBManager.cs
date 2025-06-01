using Microsoft.Data.SqlClient;

namespace API.Entitys
{
    /// <summary>
    /// Class for managing the connection to the database.
    /// </summary>
    public class DBManager
    {
        private readonly string connectionString;

        public DBManager()
        {
            connectionString = GetConnectionString();
        }

        public SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }

        public string GetConnectionString()
        {
            return Environment.GetEnvironmentVariable("VUOKRATOIMISTOT_CONNECTIONSTRING");
        }
    }
}
