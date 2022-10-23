using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure;

public class UserNameAccessor : IUserNameAccessor
{
  private readonly IHttpContextAccessor _accessor;

  public UserNameAccessor(IHttpContextAccessor accessor)
  {
    _accessor = accessor;
  }

  public string? GetUserName()
  {
    return _accessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);
  }
}