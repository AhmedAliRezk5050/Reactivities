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

      // to override any conventions 
      // prevent foreign key to be nullable, hence deletion behavior becomes cascade
      // builder.Entity<Comment>()
      // .HasOne(c => c.Author)
      // .WithMany(a => a.Comments)
      // .IsRequired();
    }
  }
}

// notes
// add identity migration command(from root directory):
// dotnet ef migrations add IdentityAdded -p Persistence -s API
