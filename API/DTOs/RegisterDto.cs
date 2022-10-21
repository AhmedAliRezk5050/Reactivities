using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto : LoginDto
{
  [Required]
  public string DisplayName { get; set; } = null!;

  [Required]
  public string UserName { get; set; } = null!;
}