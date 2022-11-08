using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;
public class ListActivities
{
  public class Query : IRequest<Result<List<UserActivityDto>>?>
  {
    public string Predicate { get; set; } = null!;

    public string Username { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>?>
  {
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;
    public Handler(DataContext dataContext, IMapper mapper)
    {
      _mapper = mapper;
      _dataContext = dataContext;
    }

    public async Task<Result<List<UserActivityDto>>?> Handle(Query request, CancellationToken cancellationToken)
    {
      var query = _dataContext
      .ActivityAttendees
      .Where(activityAttendee =>
       activityAttendee.AppUser.UserName == request.Username)
      .OrderBy(activityAttendee => activityAttendee.Activity.Date)
      .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
      .AsQueryable();

      query = request.Predicate switch
      {
        "past" => query.Where(a => a.Date <= DateTime.UtcNow),
        "hosting" => query.Where(a => a.HostUsername == request.Username),
        _ => query.Where(a => a.Date >= DateTime.UtcNow)
      };

      var activities = await query.ToListAsync();
      
      return Result<List<UserActivityDto>>.Success(activities);
    }
  }

}