using Application.Core;
using Application.Interfaces;
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
    private readonly IUserNameAccessor _userNameAccessor;

    private readonly DataContext _context;

    private readonly IMapper _mapper;

    public Handler(DataContext context, IMapper mapper, IUserNameAccessor userNameAccessor)
    {
      _context = context;
      _mapper = mapper;
      _userNameAccessor = userNameAccessor;
    }

    public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
    {
      var activity = await _context.Activities
          .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
           new { currentUsername = _userNameAccessor.GetUserName() })
          .FirstOrDefaultAsync(a => a.Id == request.Id);

      return Result.Success(_mapper.Map<ActivityDto>(activity));
    }
  }
}