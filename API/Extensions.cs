using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API;

public static class Extensions
{
    public static void ConfigureCors(this IServiceCollection services)
    {
        services.AddCors(o =>
        {
            o.AddPolicy("CorsPolicy",
                policyBuilder =>
                    policyBuilder
                        // .AllowAnyOrigin()
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
        });
    }

    public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
            }
        );
    }

    public static void ConfigureIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentityCore<AppUser>(options => { options.Password.RequireNonAlphanumeric = false; })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();

        services.AddAuthentication();
    }
}