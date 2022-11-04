using Domain;

namespace Application.Profiles;

public class Profile
{
  public string UserName { get; set; } = null!;
  
  public string? DisplayName { get; set; }

  public string? Bio { get; set; }

  public string? Image { get; set; }

  public bool IsFollowing { get; set; }

  public int FollowingCount { get; set; }

  public int FollowersCount { get; set; }

  public List<Photo> Photos { get; set; } = null!;
}