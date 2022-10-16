using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Edit
{
    public class Command : IRequest<Activity>
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

    public class Handler : IRequestHandler<Command, Activity?>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Activity?> Handle(Command request, CancellationToken cancellationToken)
        {
            var activityToUpdate = await _context.Activities.FindAsync(request.Activity.Id);

            if (activityToUpdate is null) return null;

            _mapper.Map(request.Activity, activityToUpdate);

            await _context.SaveChangesAsync();

            return activityToUpdate;
        }
    }
}