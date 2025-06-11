using API.Repositories;
using API.Services;

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
                options.AddPolicy(name: corsPolicyName, policy =>
                {
                    policy.WithOrigins(
                        "http://localhost:3000",     
                        "http://localhost:3001",     
                        "https://localhost:3000",    
                        "https://localhost:3001",    
                        "https://localhost:7017",    
                        "http://localhost:5140"      
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            builder.Services.AddEndpointsApiExplorer();

            // Register Singleton services (shared instances)
            builder.Services.AddSingleton<DBManager>();

            // Register extended instances (per request)
            builder.Services.AddScoped<CustomerAdd>();
            builder.Services.AddScoped<CustomerDelete>();
            builder.Services.AddScoped<CustomerRepository>();
            builder.Services.AddScoped<CustomerUpdate>();
            builder.Services.AddScoped<UserAccessManager>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseHttpsRedirection();
            app.UseCors(corsPolicyName);

            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
