using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
        
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(a => a.Id ==  request.Id);

            return Result.Success(_mapper.Map<ActivityDto>(activity));
        }
    }
}