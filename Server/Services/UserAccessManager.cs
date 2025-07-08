using API.Controllers;
using Microsoft.Data.SqlClient;
using System.Diagnostics;

namespace API.Services
{
    /// <summary>
    /// Class for managing user access.
    /// </summary>
    public class UserAccessManager
    {
        private readonly DBManager _dbManager;

        public UserAccessManager(DBManager dbManager)
        {
            _dbManager = dbManager;
        }


        /// <summary>
        /// Method for checking if a user exists in the database.
        /// </summary>
        /// <param name="credentials">Login credentials</param>
        /// <returns>True if user exists, otherwise false</returns>
        public bool GetUser(Credentials credentials)
        {
            try
            {
                using var connection = _dbManager.GetConnection();
                connection.Open();

                using var command = new SqlCommand(@"
                SELECT * FROM Users
                WHERE userID = @userID AND userPassword = @password", connection);

                command.Parameters.AddWithValue("@userID", credentials.UserName);
                command.Parameters.AddWithValue("@password", credentials.Password);

                using var reader = command.ExecuteReader();

                Debug.WriteLine(reader);

                return reader.HasRows;
            }
            catch
            {
                throw;
            }
        }
    }
}
