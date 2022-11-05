using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
  public MappingProfiles()
  {
    string? currentUsername = null;

    CreateMap<Activity, Activity>();

    CreateMap<Activity, ActivityDto>()
        .ForMember(activityDto => activityDto.HostUserName,
            configurationExpression =>
                configurationExpression.MapFrom(activity =>
                    activity.Attendees.FirstOrDefault(attendee => attendee.IsHost)!.AppUser.UserName));

    CreateMap<ActivityAttendee, AttendeeDto>()
        .ForMember(attendeeDto => attendeeDto.DisplayName,
            o =>
                o.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName))
        .ForMember(attendeeDto => attendeeDto.Bio,
            o =>
                o.MapFrom(activityAttendee => activityAttendee.AppUser.Bio))
        .ForMember(attendeeDto => attendeeDto.UserName,
            o =>
                o.MapFrom(activityAttendee => activityAttendee.AppUser.UserName))
        .ForMember(attendeeDto => attendeeDto.Image,
            o =>
                o.MapFrom(activityAttendee =>
                    GetPhoto(activityAttendee.AppUser)))
        .ForMember(attendeeDto => attendeeDto.IsFollowing,
            o => o.MapFrom(activityAttendee =>
                activityAttendee
                .AppUser
                .Followers
                .Any(userFollowing =>
                userFollowing.Follower.UserName == currentUsername)
            ))
            .ForMember(attendeeDto => attendeeDto.FollowersCount,
            o => o.MapFrom(activityAttendee =>
                activityAttendee
                .AppUser
                .Followers.Count
            ))
            .ForMember(attendeeDto => attendeeDto.FollowingCount,
            o => o.MapFrom(activityAttendee =>
                activityAttendee
                .AppUser
                .Following.Count
            ));

    CreateMap<AppUser, Profiles.Profile>()
        .ForMember(profile => profile.Image,
            c
                => c.MapFrom(appUser => GetPhoto(appUser)))
        .ForMember(profile => profile.FollowersCount,
            c
                => c.MapFrom(a => a.Followers.Count)
        )
        .ForMember(profile => profile.FollowingCount,
            c
                => c.MapFrom(a => a.Following.Count)
        )
        .ForMember(profile => profile.IsFollowing,
            c
                => c.MapFrom(s
                    => s.Followers.Any(x => x.Follower.UserName == currentUsername)));

    CreateMap<Comment, CommentDto>()
        .ForMember(cd => cd.DisplayName,
            ce
                => ce.MapFrom(c => c.Author.DisplayName))
        .ForMember(cd => cd.UserName,
            ce
                => ce.MapFrom(c => c.Author.UserName))
        .ForMember(cd => cd.Image,
            ce
                => ce.MapFrom(c => GetPhoto(c.Author)));
  }

  // must be static to avoid memory leak
  public static string? GetPhoto(AppUser appUser)
  {
    var photo = appUser.Photos.FirstOrDefault(p => p.IsMain);
    return photo == null ? null : photo.Url;
  }
}