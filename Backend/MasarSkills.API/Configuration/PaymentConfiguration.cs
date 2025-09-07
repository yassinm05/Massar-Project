using MasarSkills.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace MasarSkills.API.Configuration
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasIndex(p => p.TransactionId).IsUnique().HasFilter("[TransactionId] IS NOT NULL");

            builder.HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Course)
                .WithMany()
                .HasForeignKey(p => p.CourseId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Property(e => e.Amount)
            .HasPrecision(10, 2);

            builder.Property(e => e.AmountPaid)
                .HasPrecision(10, 2);

            builder.Property(e => e.RemainingAmount)
                .HasPrecision(10, 2);
        }
    }
}
