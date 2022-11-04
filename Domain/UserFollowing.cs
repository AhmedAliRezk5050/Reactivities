namespace Domain;

public class UserFollowing
{
  public string FollowerId { get; set; } = null!;

  public AppUser Follower { get; set; } = null!;

  public string FollowingId { get; set; } = null!;

  public AppUser Following { get; set; } = null!;
}