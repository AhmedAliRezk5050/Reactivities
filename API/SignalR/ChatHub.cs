using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;
public class ChatHub : Hub
{
  private readonly IMediator _mediator;

  public ChatHub(IMediator mediator)
  {
    _mediator = mediator;
  }

  public async Task CreateComment(Create.Command commentData)
  {
    // create comment
    var commentDto = (await _mediator.Send(commentData)).Value;

    // notify connected group members
    await Clients.Group(commentData.ActivityId.ToString())
    .SendAsync("ReceiveComment", commentDto);
  }

  public override async Task OnConnectedAsync()
  {
    var activityId = Context.GetHttpContext()?.Request.Query["activityId"]
     ?? string.Empty;

    await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

    var commentDtos = (await _mediator.Send(
      new List.Query() { ActivityId = Guid.Parse(activityId) }
    )).Value;

    await Clients.Caller.SendAsync("ListComments", commentDtos);
  }
}