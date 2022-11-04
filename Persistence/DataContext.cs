using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
  public class DataContext : IdentityDbContext<AppUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<Activity> Activities { get; set; } = null!;

    public DbSet<ActivityAttendee> ActivityAttendees { get; set; } = null!;

    public DbSet<Photo> Photos { get; set; } = null!;

    public DbSet<Comment> Comments { get; set; } = null!;

    public DbSet<UserFollowing> UserFollowings { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {

      base.OnModelCreating(builder);

      builder.Entity<ActivityAttendee>(a =>
        a.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));

      builder.Entity<ActivityAttendee>()
      .HasOne(aa => aa.AppUser)
      .WithMany(au => au.Activities)
      .HasForeignKey(aa => aa.AppUserId);

      builder.Entity<ActivityAttendee>()
      .HasOne(aa => aa.Activity)
      .WithMany(a => a.Attendees)
      .HasForeignKey(aa => aa.ActivityId);

      builder.Entity<UserFollowing>(x =>
      {
        x.HasKey(uF => new { uF.FollowerId, uF.FollowingId });

        x.HasOne(userFollowing => userFollowing.Follower)
         .WithMany(follower => follower.Followings)
         .HasForeignKey(following => following.FollowerId);

        x.HasOne(userFollowing => userFollowing.Following)
         .WithMany(following => following.Followers)
         .HasForeignKey(following => following.FollowingId);

      });
    }
  }
}
