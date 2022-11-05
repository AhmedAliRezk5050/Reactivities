using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class Details
{
  public class Query : IRequest<Result>
  {
    public string UserName { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Query, Result>
  {
    private readonly DataContext _dataContext;

    private readonly IMapper _mapper;

    private readonly IUserNameAccessor _userNameAccessor;

    public Handler(DataContext dataContext, IMapper mapper, IUserNameAccessor userNameAccessor)
    {
      _dataContext = dataContext;
      _mapper = mapper;
      _userNameAccessor = userNameAccessor;
    }

    public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
    {
      var profile = await _dataContext.Users
          .ProjectTo<Profile>(_mapper.ConfigurationProvider,
           new { currentUsername = _userNameAccessor.GetUserName() })
          .FirstOrDefaultAsync(x => x.UserName == request.UserName);

      if (profile == null) return Result.Success(null);

      return Result.Success(profile);
    }
  }
}