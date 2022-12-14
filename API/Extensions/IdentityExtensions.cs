using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions;

public static class IdentityExtensions
{
  public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
  {
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(connectionString));

  }

  public static void ConfigureIdentity(this IServiceCollection services, IConfiguration config)
  {
    services.AddIdentityCore<AppUser>(options =>
    {
      options.Password.RequireNonAlphanumeric = false;
      options.SignIn.RequireConfirmedEmail = true;
    })
        .AddEntityFrameworkStores<DataContext>()
        .AddSignInManager<SignInManager<AppUser>>()
        .AddDefaultTokenProviders();
  }
}