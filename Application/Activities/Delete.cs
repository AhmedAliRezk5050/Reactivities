using Domain;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Delete
{
    public class Command : IRequest<Activity>
    {
        public Guid Id { get; set; }
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
            var activity = await _context.Activities.FindAsync(request.Id);

            if (activity is null) return null;

            _context.Activities.Remove(activity);

            await _context.SaveChangesAsync();

            return activity;

        }
    }
}