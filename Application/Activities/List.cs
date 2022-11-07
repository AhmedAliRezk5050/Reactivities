using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<PagedList<ActivityDto>>>
    {
        public ActivityParams ActivityParams { get; set; } = null!;
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
        private readonly DataContext _context;

        private readonly IMapper _mapper;
        private readonly IUserNameAccessor _userNameAccessor;

        public Handler(DataContext context, IMapper mapper, IUserNameAccessor userNameAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userNameAccessor = userNameAccessor;
        }


        public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Activities
                .Where(d => d.Date >= request.ActivityParams.StartDate)
                .OrderBy(a => a.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                    new { currentUsername = _userNameAccessor.GetUserName() });

            if (request.ActivityParams.IsGoing && !request.ActivityParams.IsHost)
            {
                query = query
                    .Where(d =>
                        d.Attendees
                            .Any(a =>
                                a.UserName ==
                                _userNameAccessor.GetUserName()));
            }

            if (request.ActivityParams.IsHost && !request.ActivityParams.IsGoing)
            {
                query = query
                    .Where(d =>
                        d.HostUserName == _userNameAccessor
                            .GetUserName());
            }


            return Result<PagedList<ActivityDto>>.Success(await
                PagedList<ActivityDto>
                    .CreateAsync(query,
                        request.ActivityParams.PageNumber,
                        request.ActivityParams.PageSize));
        }
    }
}