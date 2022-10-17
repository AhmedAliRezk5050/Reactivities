using Application.Core;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    protected ActionResult HandleResult(Result result)
    {
        
        if (result.IsSuccess)
            return result.Value != null ? Ok(result.Value) : NotFound();
        
        return BadRequest(result.Error);
    }
}