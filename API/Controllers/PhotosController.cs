using Application.Photos;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotosController : BaseApiController
{
    private readonly IMediator _mediator;

    public PhotosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult> Add([FromForm] Add.Command command)
    {
        return HandleResult(await _mediator.Send(command));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        return HandleResult(await _mediator.Send(new Delete.Command { Id = id }));
    }
    
    [HttpPost("{id}/setMain")]
    public async Task<ActionResult> SetMain(string id)
    {
        return HandleResult(await _mediator.Send(new SetMain.Command { Id = id }));
    }
}