using API.Repositories;
using API.Services;
using Microsoft.IdentityModel.Tokens;
using System.Threading.RateLimiting;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            var corsPolicyName = "AllowFrontend";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(corsPolicyName, policy =>
                {
                    policy
                        .WithOrigins("https://zealous-plant-0981ddf03.2.azurestaticapps.net")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            builder.Services.AddRateLimiter(options =>
            {
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 20,
                            Window = TimeSpan.FromMinutes(1),
                            QueueLimit = 0
                        }
                    )
                );
            });

            builder.Services.AddEndpointsApiExplorer();

            // Register Singleton services (shared instances)
            builder.Services.AddSingleton<DBManager>();

            // Register extended instances (per request)
            builder.Services.AddScoped<CustomerAdd>();
            builder.Services.AddScoped<CustomerDelete>();
            builder.Services.AddScoped<CustomerRepository>();
            builder.Services.AddScoped<CustomerUpdate>();
            builder.Services.AddScoped<DeviceAdd>();
            builder.Services.AddScoped<DeviceDelete>();
            builder.Services.AddScoped<DeviceRepository>();
            builder.Services.AddScoped<DeviceUpdate>();
            builder.Services.AddScoped<InvoiceAdd>();
            builder.Services.AddScoped<InvoiceDelete>();
            builder.Services.AddScoped<InvoiceRepository>();
            builder.Services.AddScoped<InvoiceUpdate>();
            builder.Services.AddScoped<OfficeAdd>();
            builder.Services.AddScoped<OfficeDelete>();
            builder.Services.AddScoped<OfficeRepository>();
            builder.Services.AddScoped<OfficeUpdate>();
            builder.Services.AddScoped<PropertyAdd>();
            builder.Services.AddScoped<PropertyDelete>();
            builder.Services.AddScoped<PropertyRepository>();
            builder.Services.AddScoped<PropertyUpdate>();
            builder.Services.AddScoped<ReservationAdd>();
            builder.Services.AddScoped<ReservationDelete>();
            builder.Services.AddScoped<ReservationRepository>();
            builder.Services.AddScoped<ReservationUpdate>();
            builder.Services.AddScoped<ServiceAdd>();
            builder.Services.AddScoped<ServiceDelete>();
            builder.Services.AddScoped<ServiceRepository>();
            builder.Services.AddScoped<ServiceUpdate>();
            builder.Services.AddScoped<TaxAdd>();
            builder.Services.AddScoped<TaxDelete>();
            builder.Services.AddScoped<TaxRepository>();
            builder.Services.AddScoped<UserAccessManager>();

            builder.Services.AddAuthentication("Bearer").AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "VuokraToimistot",
                    ValidAudience = "VuokraToimistot",
                    IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(Environment.GetEnvironmentVariable("VUOKRATOIMISTOT_JWT_SECRET_KEY")))
                };
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseHttpsRedirection();
            app.UseCors(corsPolicyName);
            app.UseRateLimiter();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            // Add this test endpoint to verify CORS
            app.MapGet("/test-cors", () => "CORS OK").RequireCors(corsPolicyName);

            app.Run();
        }
    }
}
