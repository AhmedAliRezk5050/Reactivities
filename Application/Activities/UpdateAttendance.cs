using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class UpdateAttendance
{
  public class Command : IRequest<Result<Unit>?>
  {
    public Guid ActivityId { get; set; }
  }

  public class Handler : IRequestHandler<Command, Result<Unit>?>
  {
    private readonly DataContext _context;

    private readonly IUserNameAccessor _userNameAccessor;

    private readonly IMapper _mapper;

    public Handler(DataContext context, IUserNameAccessor userNameAccessor, IMapper mapper)
    {
      _context = context;
      _userNameAccessor = userNameAccessor;
      _mapper = mapper;
    }

    public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
    {
      var activity = await _context.Activities
          .Include(activity => activity.Attendees)
          .ThenInclude(attendee => attendee.AppUser)
          .FirstOrDefaultAsync(activity => activity.Id == request.ActivityId);

      if (activity == null) return null;

      var username = _userNameAccessor.GetUserName();

      var authUser = await _context.Users.FirstOrDefaultAsync(
          user => user.UserName == username);

      if (authUser == null) return Result<Unit>.Success(Unit.Value);

      var hostUsername = activity.Attendees.FirstOrDefault(attendee => attendee.IsHost)?.AppUser.UserName;

      if (hostUsername == null)
      {
        activity.Attendees.Add(new ActivityAttendee()
        {
          Activity = activity,
          AppUser = authUser,
          IsHost = true
        });
        return await HandleResponse(activity);
      }

      var userIsHost = authUser.UserName == hostUsername;

      if (userIsHost)
      {
        activity.IsCancelled = !activity.IsCancelled;
        return await HandleResponse(activity);
      }

      if (activity.IsCancelled)
      {
        return Result<Unit>.Failure("Failed to Update Attendance");
      }

      var attendeeUser = activity.Attendees
          .FirstOrDefault(attendee => attendee.AppUserId == authUser.Id);

      if (attendeeUser == null)
      {
        activity.Attendees.Add(new ActivityAttendee()
        {
          Activity = activity,
          AppUser = authUser,
          IsHost = false
        });
      }
      else
      {
        activity.Attendees.Remove(attendeeUser);
      }

      return await HandleResponse(activity);
    }

    private async Task<Result<Unit>?> HandleResponse(Activity activity)
    {
      var success = await _context.SaveChangesAsync() > 0;

      return success
          ? Result<Unit>.Success(Unit.Value)
          : Result<Unit>.Failure("Failed to Update Attendance");
    }
  }
}