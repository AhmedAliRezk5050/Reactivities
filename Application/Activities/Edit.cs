using Domain;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Edit
{
    public class Command : IRequest<Activity>
    {
        public Activity Activity { get; set; } = null!;
    }

    public class Handler : IRequestHandler<Command, Activity?>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Activity?> Handle(Command request, CancellationToken cancellationToken)
        {
            var activityToUpdate = await _context.Activities.FindAsync(request.Activity.Id);

            if(activityToUpdate is null) return null;
            
            activityToUpdate.Title = request.Activity.Title ?? activityToUpdate.Title;

            await _context.SaveChangesAsync();

            return activityToUpdate;
        }
    }
}