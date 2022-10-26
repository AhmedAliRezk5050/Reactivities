namespace Application.Activities;

public class AttendeeDto
{
    public string UserName { get; set; } = null!;
    
    public string? DisplayName { get; set; }
    
    public string? Bio { get; set; }
    
    public string? Image { get; set; }
}