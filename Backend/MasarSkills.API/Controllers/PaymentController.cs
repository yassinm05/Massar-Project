using Microsoft.AspNetCore.Mvc;
using MasarSkills.API.Data;
using MasarSkills.API.Models;
using MasarSkills.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/payment/process
        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDto paymentDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Generate unique transaction ID
            var transactionId = $"TXN{DateTime.UtcNow:yyyyMMddHHmmssfff}";

            var payment = new Payment
            {
                UserId = userId,
                CourseId = paymentDto.CourseId,
                Amount = paymentDto.Amount,
                AmountPaid = paymentDto.Amount,
                RemainingAmount = 0,
                Currency = "EGP",
                PaymentMethod = paymentDto.PaymentMethod,
                TransactionId = transactionId,
                PaymentStatus = "Completed",
                InstallmentsCount = 1,
                CurrentInstallment = 1,
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Payment processed successfully",
                transactionId = payment.TransactionId,
                paymentId = payment.Id
            });
        }

        // GET: api/payment/history
        [HttpGet("history")]
        public async Task<IActionResult> GetPaymentHistory()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var payments = await _context.Payments
                .Include(p => p.Course)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentHistoryDto
                {
                    Id = p.Id,
                    Amount = p.Amount,
                    AmountPaid = p.AmountPaid,
                    RemainingAmount = p.RemainingAmount,
                    Currency = p.Currency,
                    PaymentMethod = p.PaymentMethod,
                    TransactionId = p.TransactionId,
                    PaymentStatus = p.PaymentStatus,
                    PaymentDate = p.PaymentDate,
                    CourseTitle = p.Course != null ? p.Course.Title : "General Payment"
                })
                .ToListAsync();

            return Ok(payments);
        }

        // GET: api/payment/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPaymentDetails(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Course)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null)
            {
                return NotFound();
            }

            var paymentDetails = new PaymentDetailsDto
            {
                Id = payment.Id,
                Amount = payment.Amount,
                AmountPaid = payment.AmountPaid,
                RemainingAmount = payment.RemainingAmount,
                Currency = payment.Currency,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                PaymentStatus = payment.PaymentStatus,
                InstallmentsCount = payment.InstallmentsCount,
                CurrentInstallment = payment.CurrentInstallment,
                PaymentDate = payment.PaymentDate,
                NextPaymentDate = payment.NextPaymentDate,
                UserName = $"{payment.User.FirstName} {payment.User.LastName}",
                CourseTitle = payment.Course?.Title
            };

            return Ok(paymentDetails);
        }
    }

    public class ProcessPaymentDto
    {
        public int? CourseId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
    }

    public class PaymentHistoryDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal RemainingAmount { get; set; }
        public string Currency { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime PaymentDate { get; set; }
        public string CourseTitle { get; set; }
    }

    public class PaymentDetailsDto
    {
        public int Id { get; set; }
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
        public string UserName { get; set; }
        public string CourseTitle { get; set; }
    }
}