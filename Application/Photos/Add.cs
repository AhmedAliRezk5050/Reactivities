using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class Add
{
    public class Command : IRequest<Result>
    {
        public IFormFile File { get; set; } = null!;
    }

    public class Handler : IRequestHandler<Command, Result>
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

        public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _dataContext.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.UserName == _userNameAccessor.GetUserName());

            if (user == null) return Result.Success(null);

            var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

            var photo = new Photo()
            {
                Id = photoUploadResult!.PublicId,
                Url = photoUploadResult.Url,
            };

            if (!user.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }
            
            user.Photos.Add(photo);

            var result = await _dataContext.SaveChangesAsync() > 0;

            if (!result) return Result.Failure("Adding photo failed");

            return Result.Success(photo);
        }
    }
}