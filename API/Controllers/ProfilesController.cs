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
}