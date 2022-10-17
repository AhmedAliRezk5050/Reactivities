using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Details
{
    public class Query : IRequest<Result>
    {
        public Guid Id { get; set; }
    }
    
    public class Handler : IRequestHandler<Query, Result>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.Id);

            return Result.Success(activity);
        }
    }
}