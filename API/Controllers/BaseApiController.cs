using Application.Core;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
            return result.Value != null ? Ok(result.Value) : NotFound();
        
        return BadRequest(result.Error);
    }
}