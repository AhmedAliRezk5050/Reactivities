using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Profile = Application.Profiles.Profile;

namespace Application.Followers;

public class List
{
  public class Query : IRequest<Result<List<Profile>>>
  {
    public string Predicate { get; set; } = null!;

    public string Username { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Query, Result<List<Profile>>>
  {
    private readonly DataContext _dataContext;

    private readonly IMapper _mapper;

    private readonly IUserNameAccessor _userNameAccessor;

    public Handler(DataContext dataContext, IMapper mapper, IUserNameAccessor userNameAccessor)
    {
      _dataContext = dataContext;
      _mapper = mapper;
      _userNameAccessor = userNameAccessor;
    }

    public async Task<Result<List<Profile>>> Handle(Query request, CancellationToken cancellationToken)
    {
      var profiles = new List<Profile>();

      if (request.Predicate == "following")
      {
        profiles = await _dataContext
            .UserFollowings
            .Where(u => u.Follower.UserName == request.Username)
            .Select(u => u.Following)
            .ProjectTo<Profile>(_mapper.ConfigurationProvider,
                new { currentUsername = _userNameAccessor.GetUserName() })
            .ToListAsync();
      }

      if (request.Predicate == "followers")
      {
        profiles = await _dataContext
            .UserFollowings
            .Where(u => u.Following.UserName == request.Username)
            .Select(u => u.Follower)
            .ProjectTo<Profile>(_mapper.ConfigurationProvider,
                new { currentUsername = _userNameAccessor.GetUserName() })
            .ToListAsync();
      }

      return Result<List<Profile>>.Success(profiles);
    }
  }
}