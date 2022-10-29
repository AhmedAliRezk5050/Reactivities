using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;
public class List
{
  public class Query : IRequest<Result>
  {
    public Guid ActivityId { get; set; }
  }

  public class Handler : IRequestHandler<Query, Result>
  {
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;

    public Handler(DataContext dataContext, IMapper mapper)
    {
      _dataContext = dataContext;
      _mapper = mapper;
    }
    public async Task<Result> Handle(Query request, CancellationToken cancellationToken)
    {
      var commentDtos = await _dataContext.Comments
      .Where(c => c.Activity.Id == request.ActivityId)
      .OrderBy(c => c.CreatedAt)
      .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
      .ToListAsync();

      if (commentDtos == null) return Result.Success(null);

      return Result.Success(commentDtos);
    }
  }
}