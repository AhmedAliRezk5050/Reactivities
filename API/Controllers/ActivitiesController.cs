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
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return await _mediator.Send(new Details.Query { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult> CreateActivity(Activity activity)
    {
        var createdActivity = await _mediator.Send(new Create.Command { Activity = activity });
        return Created($"/api/activities/{createdActivity.Id}", createdActivity);
    }
}