using Application.Core;
using Domain;
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

    public Handler(DataContext context)
    {
      _context = context;
    }


    public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
    {
      return Result.Success(await _context.Activities.ToListAsync());
    }
  }

}