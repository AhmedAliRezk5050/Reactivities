using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
  private readonly IMediator _mediator;

  public ProfilesController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet("{username}")]
  public async Task<ActionResult> Get(string username)
  {
    return HandleResult(
        await _mediator.Send(
            new Details.Query { UserName = username }));
  }

  [HttpPut]
  public async Task<ActionResult> Update(UpdateProfileDto updateProfileDto)
  {
    return HandleResult(
        await _mediator.Send(
            new Update.Command { UpdateProfileDto = updateProfileDto }));
  }

  [HttpGet("{username}/activities")]
  public async Task<ActionResult> GetProfileActivities(string username, [FromQuery] string? predicate)
  {
    return HandleResult(
        await _mediator.Send(
            new ListActivities.Query
            {
              Predicate = predicate,
              Username = username,
            }));
  }
}