using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddControllers();

builder.Services.AddDbContext<DataContext>(options =>
                {
                  options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
                }
            );

//-- 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// we are not using https now
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

await Migrate(app);

app.Run();

// -- -- 
async Task Migrate(WebApplication app)
{
  try
  {
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
  }
  catch (Exception e)
  {
    app.Logger.LogError(e, "An error occured during migration");
  }
}