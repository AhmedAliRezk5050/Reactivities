using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<DateTime, DateTime>()
            .ConvertUsing((src, dest) => src == DateTime.MinValue ? dest : src);
        CreateMap<Activity, Activity>()
            .ForAllMembers(opts => 
                opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}