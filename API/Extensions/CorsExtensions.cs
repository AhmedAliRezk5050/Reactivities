namespace API.Extensions;

public static class CorsExtensions
{
  public static void ConfigureCors(this IServiceCollection services)
  {
    services.AddCors(o =>
    {
      o.AddPolicy("CorsPolicy",
              policyBuilder =>
                  policyBuilder
                      // .AllowAnyOrigin()
                      .WithOrigins("https://localhost:3000")
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .WithExposedHeaders("WWW-Authenticate", "pagination")
                      .AllowCredentials()
          );
    });
  }
}