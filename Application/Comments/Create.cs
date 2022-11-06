using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;
public class Create
{
  public class Command : IRequest<Result<CommentDto>?>
  {
    public Guid ActivityId { get; set; }
    public string Body { get; set; } = null!;
  }

  public class CommandValidator : AbstractValidator<Command>
  {
    public CommandValidator()
    {
      RuleFor(c => c.Body).NotEmpty();
    }
  }

  public class Handler : IRequestHandler<Command, Result<CommentDto>?>
  {
    private readonly IUserNameAccessor _userNameAccessor;
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;

    public Handler(DataContext dataContext, IMapper mapper, IUserNameAccessor userNameAccessor)
    {
      _dataContext = dataContext;
      _userNameAccessor = userNameAccessor;
      _mapper = mapper;
    }

    public async Task<Result<CommentDto>?> Handle(Command request, CancellationToken cancellationToken)
    {
      var activity = await _dataContext.Activities.FindAsync(request.ActivityId);

      if (activity == null) return null;

      var user = await _dataContext.Users
      .Include(u => u.Photos)
      .FirstOrDefaultAsync(u => u.UserName == _userNameAccessor.GetUserName());

      if (user == null) return null;

      var comment = new Comment()
      {
        Activity = activity,
        Author = user,
        Body = request.Body,
      };

      activity.Comments.Add(comment);

      var isSuccess = await _dataContext.SaveChangesAsync() > 0;

      if (!isSuccess) return Result<CommentDto>.Failure("Adding new comment failed");

      return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
    }
  }
}