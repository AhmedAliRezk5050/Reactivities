using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class SetMain
{
    public class Command : IRequest<Result>
    {
        public string Id { get; set; } = null!;
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

            var requestedPhoto = user.Photos.FirstOrDefault(p => p.Id == request.Id);

            if(requestedPhoto == null) return Result.Success(null);
            
            if(requestedPhoto.IsMain) return Result.Failure("Failed setting main photo. The photo is already main");
            
            var currentMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);

            if (currentMainPhoto != null) currentMainPhoto.IsMain = false;
            
            requestedPhoto.IsMain = true;
            
            var savingResult = await _dataContext.SaveChangesAsync() > 0;

            if (!savingResult) return Result.Failure("Failed setting main photo");

            return Result.Success(requestedPhoto.Id);
        }
    }
}