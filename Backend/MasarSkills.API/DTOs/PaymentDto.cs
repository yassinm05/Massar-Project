using System.ComponentModel.DataAnnotations;

namespace MasarSkills.API.DTOs
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int? CourseId { get; set; }
        public string CourseTitle { get; set; }
        public decimal Amount { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal RemainingAmount { get; set; }
        public string Currency { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public string PaymentStatus { get; set; }
        public int InstallmentsCount { get; set; }
        public int CurrentInstallment { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime? NextPaymentDate { get; set; }
    }

    public class CreatePaymentDto
    {
        public int UserId { get; set; }
        public int? CourseId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public int InstallmentsCount { get; set; } = 1;
    }

    public class PaymentUpdateDto
    {
        public decimal AmountPaid { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionId { get; set; }
    }

    //Dto for checkout the course and it's payment
    public class CheckoutDto
    {
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }
        public string InstructorName { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalPrice { get; set; }
    }

    public class PayInstallmentDto
    {
        [Required]
        public int PaymentId { get; set; } // The ID of the original payment record we need to update

        [Required]
        public string PaymentMethodToken { get; set; } // The new token for this specific transaction
    }
    // Describes a single payment option (e.g., "One-time" or "Installment")
    public class PaymentOptionDto
    {
        public string Type { get; set; } // "onetime" or "installment"
        public string DisplayText { get; set; }
        public decimal TotalAmount { get; set; }
        public int InstallmentsCount { get; set; }
        public decimal AmountPerInstallment { get; set; }
    }
    // The main object the API returns, containing all options for a course
    public class PaymentPlanDto
    {
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }

        public string InstructorName { get; set; }
        public List<PaymentOptionDto> Options { get; set; } = new List<PaymentOptionDto>();
    }
}