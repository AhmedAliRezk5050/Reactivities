using Microsoft.AspNetCore.Mvc;
using MediatR;
using Domain;
using Application.Activities;
using FluentValidation;

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
        var result = await _validator.ValidateAsync(activity);

        if (!result.IsValid)
        {
            return BadRequest(result.ToDictionary());
        } 

        var createdActivity = await _mediator.Send(new Create.Command { Activity = activity });
        return Created($"/api/activities/{createdActivity.Id}", createdActivity);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> EditActivity(Guid id, Activity activity)
    {
        var result = await _validator.ValidateAsync(activity);
        
        if (!result.IsValid)
        {
            return BadRequest(result.ToDictionary());
        }
        
        activity.Id = id;

        var updatedActivity = await _mediator.Send(new Edit.Command { Activity = activity });

        if (updatedActivity is null) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteActivity(Guid id)
    {
        var deletedActivity = await _mediator.Send(new Delete.Command() { Id = id });

        if (deletedActivity is null) return NotFound();

        return NoContent();
    }
}