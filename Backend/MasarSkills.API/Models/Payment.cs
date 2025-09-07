using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? CourseId { get; set; } // يمكن أن يكون الدفع لكورس معين
        [Precision(10, 2)]
        public decimal Amount { get; set; }

        [Precision(10, 2)]
        public decimal AmountPaid { get; set; }

        [Precision(10, 2)]
        public decimal RemainingAmount { get; set; }

        [Required]
        public string Currency { get; set; } = "EGP"; // العملة

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } // طريقة الدفع (بطاقة، تحويل، كاش)

        [MaxLength(100)]
        public string TransactionId { get; set; } // رقم المعاملة

        [MaxLength(50)]
        public string PaymentStatus { get; set; } // الحالة (pending, completed, failed, refunded)

        public int InstallmentsCount { get; set; } = 1; // عدد الأقساط
        public int CurrentInstallment { get; set; } = 1; // القسط الحالي

        public DateTime PaymentDate { get; set; } = DateTime.UtcNow; // تاريخ الدفع
        public DateTime? NextPaymentDate { get; set; } // تاريخ الدفع التالي للتقسيط

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Course Course { get; set; }
    }
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}

public enum PaymentMethod
{
    CreditCard,
    BankTransfer,
    Cash,
    VodafoneCash,
    Instapay
}