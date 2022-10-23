using System.Text.Json.Serialization;
using API;
using API.Middleware;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddControllers(o =>
{
  var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
  o.Filters.Add(new AuthorizeFilter(policy));
}).AddJsonOptions(options =>
{
  options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
  options.JsonSerializerOptions.WriteIndented = true;
});;

builder.Services.ConfigureCors();

builder.Services.AddAutoMapper(typeof(MappingProfiles));

builder.Services.AddMediatR(typeof(List.Handler).Assembly);

builder.Services.AddScoped<IUserNameAccessor, UserNameAccessor>();

builder.Services.ConfigureDbContext(configuration);
builder.Services.ConfigureIdentity(configuration);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddValidatorsFromAssemblyContaining<ActivityValidator>();

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