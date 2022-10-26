using API;
using API.Middleware;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using Infrastructure;
using Infrastructure.Photos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddControllers(o =>
{
  var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
  o.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.ConfigureCors();

builder.Services.AddAutoMapper(typeof(MappingProfiles));

builder.Services.AddMediatR(typeof(List.Handler).Assembly);

builder.Services.AddScoped<IUserNameAccessor, UserNameAccessor>();

builder.Services.ConfigureDbContext(configuration);
builder.Services.ConfigureIdentity(configuration);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddValidatorsFromAssemblyContaining<ActivityValidator>();

builder.Services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// we are not using https now
// app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await Utility.MigrateAndSeed(app);

app.Run();