using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Profile = Application.Profiles.Profile;

namespace Application.Followers;

public class List
{
    public class Query : IRequest<Result>
    {
        public string Predicate { get; set; } = null!;

        public string Username { get; set; } = null!;
    }

    public class Handler : IRequestHandler<Query, Result>
    {
        private readonly DataContext _dataContext;

        private readonly IMapper _mapper;

        public Handler(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }

        public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<Profile>();

            if (request.Predicate == "following")
            {
                profiles  = await _dataContext
                    .UserFollowings
                    .Where(u => u.Follower.UserName == request.Username)
                    .Select(u => u.Following)
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .ToListAsync();
            }
            
            if (request.Predicate == "followers")
            {
                profiles  = await _dataContext
                    .UserFollowings
                    .Where(u => u.Following.UserName == request.Username)
                    .Select(u => u.Follower)
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .ToListAsync();
            }

            return Result.Success(profiles);
        }
    }
}