using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LoginDto
{
    [EmailAddress] public string Email { get; set; } = null!;

    [Required]
    [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$",
        ErrorMessage = "Invalid Password")]
    public string Password { get; set; } = null!;
}