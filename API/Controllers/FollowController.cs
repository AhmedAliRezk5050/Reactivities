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
  public async Task<ActionResult> Post(string username)
  {
    return HandleResult(await _mediator
    .Send(new FollowToggle.Command()
    { FollowingUsername = username }));
  }
}