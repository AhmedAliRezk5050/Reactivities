using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    private IMediator? _mediator;

    protected IMediator Mediator => (_mediator ??= HttpContext.RequestServices.GetService<IMediator>())
                                    ?? throw new InvalidOperationException();
}