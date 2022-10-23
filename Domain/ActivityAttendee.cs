namespace Domain;

public class ActivityAttendee
{
  public string AppUserId { get; set; } = null!;

  public AppUser AppUser { get; set; } = null!;

  public Guid ActivityId { get; set; }

  public Activity Activity { get; set; } = null!;


  public bool IsHost { get; set; }

}