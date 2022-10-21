namespace API.DTOs;

public class UserDto
{
  public string DisplayName { get; set; } = null!;

  public string UserName { get; set; } = null!;

  public string? Image { get; set; }

  public string Token { get; set; } = null!;
}