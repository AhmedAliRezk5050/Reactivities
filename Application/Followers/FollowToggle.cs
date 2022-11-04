using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;
public class FollowToggle
{
  public class Command : IRequest<Result>
  {
    public string FollowingUsername { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Command, Result>
  {
    private readonly IUserNameAccessor _userNameAccessor;
    private readonly DataContext _dataContext;
    public Handler(IUserNameAccessor userNameAccessor, DataContext dataContext)
    {
      _userNameAccessor = userNameAccessor;
      _dataContext = dataContext;
    }

    public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
    {
      var follower = await _dataContext.Users
        .FirstOrDefaultAsync(u => u.UserName == _userNameAccessor.GetUserName());

      var following = await _dataContext.Users
      .FirstOrDefaultAsync(u => u.UserName == request.FollowingUsername);

      if (following == null) return Result.Success(null);


      var userFollowing = await _dataContext.UserFollowings
      .FindAsync(follower!.Id, following.Id);

      if (userFollowing is null)
      {
        var u = new UserFollowing()
        {
          Follower = follower,
          Following = following
        };
        _dataContext.UserFollowings.Add(u);

      }
      else
      {
        _dataContext.UserFollowings.Remove(userFollowing);
      }

      var isSuccessSave = await _dataContext.SaveChangesAsync() > 0;

      if (!isSuccessSave) return Result.Failure("Failed to follow/unfollow user");

      return Result.Success("Success");
    }
  }
}