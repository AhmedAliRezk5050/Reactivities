using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions;

public static class IdentityExtensions
{
  public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddDbContext<DataContext>(options =>
        {
          options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
        }
    );
  }

  public static void ConfigureIdentity(this IServiceCollection services, IConfiguration config)
  {
    services.AddIdentityCore<AppUser>(options => { options.Password.RequireNonAlphanumeric = false; })
        .AddEntityFrameworkStores<DataContext>()
        .AddSignInManager<SignInManager<AppUser>>();
  }
}