using Application.Core;
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
        private readonly DataContext _context;

        private readonly IValidator<Activity> _validator;

        public Handler(DataContext context, IValidator<Activity> validator)
        {
            _context = context;
            _validator = validator;
        }

        public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
        {
            ValidationResult? validationResult = await _validator.ValidateAsync(request.Activity);

            if (!validationResult.IsValid)
            {
                return Result.Failure(validationResult.ToDictionary());
            }

            _context.Activities.Add(request.Activity);

            int persistResult = await _context.SaveChangesAsync();
            
            if (persistResult == 0)
            {
                return Result.Failure("Failed to create activity");
            }
            
            return Result.Success(request.Activity);
        }
    }
}