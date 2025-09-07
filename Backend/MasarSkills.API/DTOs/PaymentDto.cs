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
}