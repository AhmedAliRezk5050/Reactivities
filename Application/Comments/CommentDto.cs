namespace Application.Comments;
public class CommentDto
{
  public int Id { get; set; }

  public DateTime CreatedAt { get; set; }

  public string Body { get; set; } = null!;

  public string DisplayName { get; set; } = null!;

  public string UserName { get; set; } = null!;

  public string Image { get; set; } = null!;

}