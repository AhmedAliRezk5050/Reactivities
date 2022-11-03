using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

  public static void ConfigureIdentity(this IServiceCollection services, IConfiguration config)
  {
    services.AddIdentityCore<AppUser>(options => { options.Password.RequireNonAlphanumeric = false; })
        .AddEntityFrameworkStores<DataContext>()
        .AddSignInManager<SignInManager<AppUser>>();

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(o =>
        {
          o.TokenValidationParameters = new TokenValidationParameters
          {
            // validate token against our provided secret key("super secret key")
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false

          };

          o.Events = new JwtBearerEvents
          {
            OnMessageReceived = context =>
            {
              var accessToken = context.Request.Query["access_token"];
              var path = context.HttpContext.Request.Path;
              if (!string.IsNullOrEmpty(accessToken) &&
                  (path.StartsWithSegments("/chat")))
              {
                context.Token = accessToken;
              }
              return Task.CompletedTask;
            }
          };
        });

    services.AddAuthorization(options =>
    {
      options.AddPolicy("IsActivityHost", policy =>
          {
          policy.Requirements.Add(new HostRequirement());
        });
    });
    services.AddTransient<IAuthorizationHandler, HostRequirementHandler>();
    services.AddScoped<AuthService>();
  }
}