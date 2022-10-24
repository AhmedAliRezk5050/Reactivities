using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, Activity>();
        CreateMap<Activity, ActivityDto>()
            .ForMember(activityDto => activityDto.HostUserName,
                configurationExpression =>
                    configurationExpression.MapFrom(activity =>
                        activity.Attendees.FirstOrDefault(attendee => attendee.IsHost)!.AppUser.UserName));
        CreateMap<ActivityAttendee, Profiles.Profile>()
            .ForMember(profile => profile.DisplayName,
                configurationExpression =>
                    configurationExpression.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName))
            .ForMember(profile => profile.Bio,
                configurationExpression =>
                    configurationExpression.MapFrom(activityAttendee => activityAttendee.AppUser.Bio))
            .ForMember(profile => profile.UserName,
                configurationExpression =>
                    configurationExpression.MapFrom(activityAttendee => activityAttendee.AppUser.UserName));
    }
}