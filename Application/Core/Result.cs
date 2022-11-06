namespace Application.Core;

public class Result<T>
{
  public bool IsSuccess { get; set; }
  public T? Value { get; set; }
  public object Error { get; set; } = null!;

  public static Result<T> Success(T? value) => new Result<T> { IsSuccess = true, Value = value };
  public static Result<T> Failure(object error) => new Result<T> { IsSuccess = false, Error = error };
}
