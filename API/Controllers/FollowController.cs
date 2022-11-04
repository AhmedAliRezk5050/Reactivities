using Application.Followers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


public class FollowController : BaseApiController
{
  private readonly IMediator _mediator;
  public FollowController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpPost("{username}")]
  public async Task<ActionResult> ToggleFollow(string username)
  {
    return HandleResult(await _mediator
    .Send(new FollowToggle.Command()
    { FollowingUsername = username }));
  }

  [HttpGet("{username}")]
  public async Task<ActionResult> FetchFollow(string username, string predicate)
  {
    return HandleResult(await _mediator
    .Send(new List.Query()
    {
      Username = username,
      Predicate = predicate
    }));
  }
}