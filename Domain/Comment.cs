namespace Domain;
public class Comment
{
  public int Id { get; set; }

  public string Body { get; set; } = null!;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public AppUser Author { get; set; } = null!;

  public Activity Activity { get; set; } = null!;
}