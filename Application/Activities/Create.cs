using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Create
{
  public class Command : IRequest<Result>
  {
    public Activity Activity { get; set; } = null!;
  }

  public class CommandValidator : AbstractValidator<Command>
  {
    public CommandValidator()
    {
      RuleFor(a => a.Activity)
          .SetValidator(new ActivityValidator());
    }
  }

  public class Handler : IRequestHandler<Command, Result>
  {
    private readonly IMapper _mapper;
    private readonly DataContext _context;

    private readonly IValidator<Activity> _validator;

    private readonly IUserNameAccessor _userNameAccessor;

    public Handler(
      DataContext context,
       IValidator<Activity> validator,
        IUserNameAccessor userNameAccessor,
        IMapper mapper
        )
    {
      _context = context;
      _validator = validator;
      _userNameAccessor = userNameAccessor;
      _mapper = mapper;
    }

    public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
    {
      ValidationResult? validationResult = await _validator.ValidateAsync(request.Activity);

      if (!validationResult.IsValid)
      {
        return Result.Failure(new { validationErrors = validationResult.ToDictionary() });
      }

      var user = _context.Users.FirstOrDefault(u => u.UserName == _userNameAccessor.GetUserName());

      if (user == null) return Result.Failure("Failed to create activity");

      var attendee = new ActivityAttendee()
      {
        Activity = request.Activity,
        AppUser = user,
        IsHost = true
      };

      request.Activity.Attendees.Add(attendee);

      _context.Activities.Add(request.Activity);

      bool persistResult = await _context.SaveChangesAsync() > 0;

      if (!persistResult) return Result.Failure("Failed to create activity");

      return Result.Success(_mapper.Map<ActivityDto>(request.Activity));
    }
  }
}