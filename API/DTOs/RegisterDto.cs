namespace API.DTOs;

public class RegisterDto : LoginDto
{
  public string DisplayName { get; set; } = null!;
  public string UserName { get; set; } = null!;
}