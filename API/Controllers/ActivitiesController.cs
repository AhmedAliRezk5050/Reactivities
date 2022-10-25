using Microsoft.AspNetCore.Mvc;
using MediatR;
using Domain;
using Application.Activities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;


public class ActivitiesController : BaseApiController
{
  private readonly IMediator _mediator;
  private readonly IValidator<Activity> _validator;

  public ActivitiesController(IMediator mediator, IValidator<Activity> validator)
  {
    _mediator = mediator;
    _validator = validator;
  }

  [HttpGet]
  public async Task<ActionResult> GetActivities()
  {
    return HandleResult(await _mediator.Send(new List.Query()));
  }

  [HttpGet("{id:guid}")]
  public async Task<ActionResult> GetActivity(Guid id)
  {
    return HandleResult(await _mediator.Send(new Details.Query { Id = id }));
  }

  [HttpPost]
  public async Task<ActionResult> CreateActivity(Activity activity)
  {
    return HandleResult(await _mediator.Send(new Create.Command { Activity = activity }));
  }

  [Authorize(Policy = "IsActivityHost")]
  [HttpPut("{id:guid}")]
  public async Task<ActionResult> EditActivity(Guid id, Activity activity)
  {
    return HandleResult(await _mediator.Send(new Edit.Command { Activity = activity, Id = id }));
  }

  [HttpDelete("{id:guid}")]
  public async Task<ActionResult> DeleteActivity(Guid id)
  {
    return HandleResult(await _mediator.Send(new Delete.Command() { Id = id }));
  }

  [HttpPost("{id:guid}/update-attendance")]
  public async Task<ActionResult> HandleAttendance(Guid id)
  {
    return HandleResult(await _mediator.Send(new UpdateAttendance.Command() { ActivityId = id }));
  }
}