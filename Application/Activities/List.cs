using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class List
{
  public class Query : IRequest<Result>
  {
    public PagingParams PagingParams { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Query, Result>
  {
    private readonly DataContext _context;

    private readonly IMapper _mapper;
    private readonly IUserNameAccessor _userNameAccessor;

    public Handler(DataContext context, IMapper mapper, IUserNameAccessor userNameAccessor)
    {
      _context = context;
      _mapper = mapper;
      _userNameAccessor = userNameAccessor;
    }


    public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
    {
      var query = _context.Activities
        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
        new { currentUsername = _userNameAccessor.GetUserName() });


      return Result.Success(await
        PagedList<ActivityDto>
        .CreateAsync(query,
         request.PagingParams.PageNumber,
         request.PagingParams.PageSize));
    }
  }

}