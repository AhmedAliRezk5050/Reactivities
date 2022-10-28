using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

public class Update
{
  public class Command : IRequest<Result>
  {
    public UpdateProfileDto UpdateProfileDto { get; set; } = null!;
  }

  public class Handler : IRequestHandler<Command, Result>
  {
    private readonly DataContext _context;

    private readonly IUserNameAccessor _userNameAccessor;

    private readonly IMapper _mapper;

    public Handler(DataContext context, IUserNameAccessor userNameAccessor, IMapper mapper)
    {
      _context = context;
      _userNameAccessor = userNameAccessor;
      _mapper = mapper;
    }

    public async Task<Result> Handle(Command request, CancellationToken cancellationToken)
    {
      var user = await _context.Users
      .FirstOrDefaultAsync(u => u.UserName
              == _userNameAccessor.GetUserName());

      if (user == null) return Result.Success(null);

      user.DisplayName = request.UpdateProfileDto.DisplayName;

      user.Bio = request.UpdateProfileDto.Bio;

      var isSuccess = await _context.SaveChangesAsync() > 0;

      if (!isSuccess) return Result.Failure("Failed to update user");

      return Result.Success("");
    }
  }

}