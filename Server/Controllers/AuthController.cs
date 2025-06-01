using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

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
        private readonly UserAccessManager AccessManager;

        public AuthController(UserAccessManager userAccessManager)
        {
            AccessManager = userAccessManager;
            keyString = Environment.GetEnvironmentVariable("VUOKRATOIMISTOT_JWT_SECRET_KEY");
        }


        /// <summary>
        /// Authenticates the user and returns a JWT token.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult<string> Authenticate([FromBody] Credentials request)
        {
            var validation = AccessManager.GetUser(request);

            if (!validation)
            {
                return Unauthorized();
            }

            var randomBytes = Convert.FromBase64String(keyString);
            var key = new SymmetricSecurityKey(randomBytes);
            var signCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken(
                issuer: "VuokraToimistot",
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: signCredentials
            );

            var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            return Ok(token);
        }
    }
}
