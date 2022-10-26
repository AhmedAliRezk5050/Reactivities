namespace Domain;

public class Photo
{
    public string Id { get; set; } = null!;
    
    public string Url { get; set; } = null!;
    
    public bool IsMain { get; set; }
}