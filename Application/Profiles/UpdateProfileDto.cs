using System.ComponentModel.DataAnnotations;

namespace Application.Profiles
{
  public class UpdateProfileDto
  {
    [Required]
    public string DisplayName { get; set; } = null!;

    public string? Bio { get; set; }
  }
}