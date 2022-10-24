using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class List
{
  public class Query : IRequest<Result> { }

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
      var activityDtos = await _context.Activities
        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
        .ToListAsync();
      
      return Result.Success(activityDtos);
    }
  }

}