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
  public class Command : IRequest<Result<Unit>?>
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

  public class Handler : IRequestHandler<Command, Result<Unit>?>
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

    public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
    {
      var activityToUpdate = await _context.Activities
        .FindAsync(request.Id);

      if (activityToUpdate is null) return null;


      ValidationResult? validationResult = await _validator.ValidateAsync(request.Activity);

      if (!validationResult.IsValid)
      {
        return Result<Unit>.Failure(new { validationErrors = validationResult.ToDictionary() });
      }

      _mapper.Map(request.Activity, activityToUpdate);

      var result = await _context.SaveChangesAsync() > 0;

      if (!result) return Result<Unit>.Failure("Failed to edit activity");

      return Result<Unit>.Success(Unit.Value);
    }
  }
}