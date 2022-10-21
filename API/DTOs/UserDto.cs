namespace API.DTOs;

public class UserDto : RegisterDto
{
  public string? Image { get; set; }

  public string Token { get; set; } = null!;
}