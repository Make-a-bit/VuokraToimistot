using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers
{
    /// <summary>
    /// Controller for handling authentication.
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly string keyString;
        private readonly string salt;
        private readonly UserAccessManager AccessManager;

        public AuthController(UserAccessManager userAccessManager)
        {
            AccessManager = userAccessManager;
            keyString = Environment.GetEnvironmentVariable("VUOKRATOIMISTOT_JWT_SECRET_KEY") ?? "";
        }


        /// <summary>
        /// Authenticates the user and returns a JWT token.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<string>> Authenticate([FromBody] Credentials request)
        {
            try
            {
                var validation = await AccessManager.ValidateUser(request);

                if (!validation)
                {
                    return Unauthorized();
                }

                var randomBytes = Convert.FromBase64String(keyString);
                var key = new SymmetricSecurityKey(randomBytes);
                var signCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var jwtToken = new JwtSecurityToken(
                    issuer: "VuokraToimistot",
                    audience: "VuokraToimistot",
                    claims: new[] { new Claim(ClaimTypes.Name, request.UserName) },
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: signCredentials
                );

                var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);

                return Ok(token);
            }
            catch (Exception ex)
            {
                // Log the exception (to file, console, or Application Insights)
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
