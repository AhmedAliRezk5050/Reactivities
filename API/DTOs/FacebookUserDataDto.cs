namespace API.DTOs;

public class FacebookUserDataDto
{
  public string Id { get; set; } = null!;
  public string Email { get; set; } = null!;
  public string Name { get; set; } = null!;

  public FacebookPictureDataDto Picture { get; set; } = null!;
}