using Microsoft.AspNetCore.Mvc;
using MediatR;
using Domain;
using Application.Activities;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
  private readonly IMediator _mediator;

  public ActivitiesController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet]
  public async Task<ActionResult<List<Activity>>> GetActivities()
  {
    return await _mediator.Send(new List.Query());
  }

  [HttpGet("{id:guid}")]
  public  ActionResult GetActivity(Guid id)
  {
    return Ok();
  }
}