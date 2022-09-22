using Microsoft.AspNetCore.Mvc;
using MediatR;
using Domain;
using Application.Activities;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await Mediator.Send(new List.Query());
    }

    [HttpGet("{id:guid}")]
    public ActionResult GetActivity(Guid id)
    {
        return Ok();
    }
}