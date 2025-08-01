using API.Controllers;
using Microsoft.Data.SqlClient;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;

namespace API.Services
{
    /// <summary>
    /// Class for managing user access.
    /// </summary>
    public class UserAccessManager
    {
        private readonly DBManager _dbManager;
        private readonly string _salt;

        public UserAccessManager(DBManager dbManager)
        {
            _dbManager = dbManager;
            _salt = Environment.GetEnvironmentVariable("VUOKRATOIMISTOT_SALT") ?? "";
        }


        /// <summary>
        /// Method for checking if a user exists in the database.
        /// </summary>
        /// <param name="credentials">Login credentials</param>
        /// <returns>True if user exists, otherwise false</returns>
        public async Task<bool> ValidateUser(Credentials credentials)
        {

            try
            {
                using var connection = _dbManager.GetConnection();
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                SELECT userPassword FROM Users
                WHERE userID = @userID", connection);

                command.Parameters.AddWithValue("@userID", credentials.UserName);
                using var reader = await command.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    return false;
                }

                var storedPassword = reader.GetString(0);

                var computedHash = await GetRFCHash(credentials.Password, _salt, 10000);

                return CryptographicOperations.FixedTimeEquals(
                Convert.FromBase64String(storedPassword),
                Convert.FromBase64String(computedHash)
                );
            }
            catch
            {
                throw;
            }
        }

        private async Task<string> GetRFCHash(string password, string salt, int rounds)
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var saltBytes = Encoding.UTF8.GetBytes(salt);
            var hashedPasswordBytes = Rfc2898DeriveBytes.Pbkdf2(passwordBytes, saltBytes, rounds, HashAlgorithmName.SHA256, 32);
            var base64String = Convert.ToBase64String(hashedPasswordBytes);

            return base64String;
        }
    }
}
