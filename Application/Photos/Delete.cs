using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class Delete
{
  public class Command : IRequest<Result<Unit>?>
  {
    public string Id { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Command, Result<Unit>?>
  {
    private readonly DataContext _dataContext;
    private readonly IPhotoAccessor _photoAccessor;
    private readonly IUserNameAccessor _userNameAccessor;

    public Handler(
        DataContext dataContext,
        IPhotoAccessor photoAccessor,
        IUserNameAccessor userNameAccessor
    )
    {
      _dataContext = dataContext;
      _photoAccessor = photoAccessor;
      _userNameAccessor = userNameAccessor;
    }

    public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
    {
      var user = await _dataContext.Users
          .Include(u => u.Photos)
          .FirstOrDefaultAsync(u => u.UserName == _userNameAccessor.GetUserName());

      if (user == null) return null;

      var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

      if (photo == null) return null;

      if (photo.IsMain) return Result<Unit>.Failure("Main photo can't be deleted");

      var photoDeletionResult = await _photoAccessor.DeletePhoto(photo.Id);

      if (photoDeletionResult == null) return Result<Unit>.Failure("Failed deleting photo from cloudinary");

      user.Photos.Remove(photo);

      var savingResult = await _dataContext.SaveChangesAsync() > 0;

      if (!savingResult) return Result<Unit>.Failure("Failed deleting photo from API");

      return Result<Unit>.Success(Unit.Value);
    }
  }
}