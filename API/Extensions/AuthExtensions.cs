using System.Text;
using API.Services;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class AuthExtensions
{
  public static void ConfigureAuth(this IServiceCollection services, IConfiguration config)
  {
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(o =>
        {
          o.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
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
      options.AddPolicy("IsActivityHost", policy => { policy.Requirements.Add(new HostRequirement()); });
    });
    services.AddTransient<IAuthorizationHandler, HostRequirementHandler>();
    services.AddScoped<AuthService>();
  }
}