using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Edit
{
  public class Command : IRequest<Result>
  {
    public Guid Id { get; set; }
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
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IValidator<Activity> _validator;

    public Handler(DataContext context, IMapper mapper, IValidator<Activity> validator)
    {
      _context = context;
      _mapper = mapper;
      _validator = validator;
    }

    public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
    {
      var activityToUpdate = await _context.Activities
        .FindAsync(request.Id);

      if (activityToUpdate is null) return Result.Success(null);


      ValidationResult? validationResult = await _validator.ValidateAsync(request.Activity);

      if (!validationResult.IsValid)
      {
        return Result.Failure(new { validationErrors = validationResult.ToDictionary() });
      }

      // activityToUpdate.Title = request.Activity.Title;
      // activityToUpdate.Date = request.Activity.Date;
      // activityToUpdate.Description = request.Activity.Description;
      // activityToUpdate.Category = request.Activity.Category;
      // activityToUpdate.City = request.Activity.City;
      // activityToUpdate.Venue = request.Activity.Venue;

      _mapper.Map(request.Activity, activityToUpdate);
      
      var result = await _context.SaveChangesAsync() > 0;

      if (!result)
      {
        return Result.Failure("Failed to edit activity");
      }

      return Result.Success(Unit.Value);
    }
  }
}