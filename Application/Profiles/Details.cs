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
  public class Query : IRequest<Result<Profile>?>
  {
    public string UserName { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Query, Result<Profile>?>
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

    public async Task<Result<Profile>?> Handle(Query request, CancellationToken cancellationToken)
    {
      var profile = await _dataContext.Users
          .ProjectTo<Profile>(_mapper.ConfigurationProvider,
           new { currentUsername = _userNameAccessor.GetUserName() })
          .FirstOrDefaultAsync(x => x.UserName == request.UserName);

      if (profile == null) return null;

      return Result<Profile>.Success(profile);
    }
  }
}