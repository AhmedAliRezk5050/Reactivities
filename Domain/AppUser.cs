using Microsoft.AspNetCore.Identity;

namespace Domain;

public class AppUser : IdentityUser
{
  public string? DisplayName { get; set; }

  public string? Bio { get; set; }

  public ICollection<ActivityAttendee> Activities { get; set; } = new List<ActivityAttendee>();

  public List<Photo> Photos { get; set; } = new();

  public List<Comment> Comments { get; set; } = new();

  public List<UserFollowing> Followers { get; set; } = new();

  public List<UserFollowing> Following { get; set; } = new();

  public List<RefreshToken> RefreshTokens { get; set; } = new();
}