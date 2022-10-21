using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API;

public static class Utility
{
  public static async Task MigrateAndSeed(WebApplication app)
  {
    try
    {
      using var scope = app.Services.CreateScope();
      var services = scope.ServiceProvider;
      var context = services.GetRequiredService<DataContext>();
      var userManager = services.GetRequiredService<UserManager<AppUser>>();
      await context.Database.MigrateAsync();
      await Seed.SeedData(context, userManager);
    }
    catch (Exception e)
    {
      app.Logger.LogError(e, "An error occured during migration");
    }
  }
}