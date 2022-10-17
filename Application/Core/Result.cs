namespace Application.Core;

public class Result
{
    public bool IsSuccess { get; set; }

    public object? Value { get; set; }

    public object? Error { get; set; }

    public static Result Success(object? value) => new() {IsSuccess = true, Value = value};
    
    public static Result Failure(object error) => new() {IsSuccess = false, Error = error};
    
    
}
