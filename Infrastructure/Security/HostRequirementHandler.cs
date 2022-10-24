using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class HostRequirementHandler : AuthorizationHandler<HostRequirement>
{
    private readonly DataContext _dbContext;

    private readonly IHttpContextAccessor _contextAccessor;

    public HostRequirementHandler(
        DataContext dbContext,
        IHttpContextAccessor contextAccessor)
    {
        _dbContext = dbContext;
        _contextAccessor = contextAccessor;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        HostRequirement requirement)
    {
        var userId = context
                        .User
                        .FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return;

        string? activityIdText = _contextAccessor.HttpContext?.Request.RouteValues
            .SingleOrDefault(x => x.Key == "id").Value?.ToString();

        if(activityIdText == null) return;
        
        var activityId = Guid.Parse(activityIdText);
        
        var activityAttendee = await _dbContext.ActivityAttendees
            .AsNoTracking()
            .FirstOrDefaultAsync(a => 
                a.AppUser.Id == userId && a.Activity.Id == activityId);

        if (activityAttendee == null || !activityAttendee.IsHost)
        {
            return;
        }
        
        
        context.Succeed(requirement);
        
        
    }
}