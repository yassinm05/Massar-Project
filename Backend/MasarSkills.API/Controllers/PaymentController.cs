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
        // POST: api/payment/process
[HttpPost("process")]
public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDto paymentDto)
{
    // === Step 1: Get the authenticated user ===
    var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (!int.TryParse(userIdString, out var userId))
    {
        return Unauthorized();
    }

    // === Step 2: Validate the course and get its price ===
    var course = await _context.Courses.FindAsync(paymentDto.CourseId);
    if (course == null)
    {
        return NotFound(new { message = "Course not found." });
    }
    
    // **CRITICAL**: Recalculate the price on the server.
    decimal amountToCharge = course.Price - 20.00m; // Example
    if (amountToCharge < 0) amountToCharge = 0;

    // === Step 3: (CORRECTED) Find the Student Profile ===
    var studentProfile = await _context.StudentProfiles
                                       .FirstOrDefaultAsync(p => p.UserId == userId);

    if (studentProfile == null)
    {
        // This means a user exists but doesn't have a student profile.
        // You need to decide how to handle this error.
        return BadRequest(new { message = "Student profile not found." });
    }

    // === Step 4: Process the charge with a payment gateway (Simulation) ===
    string transactionId = $"SIM_TXN_{Guid.NewGuid()}";
    // In a real app, the code to charge the 'PaymentMethodToken' would go here.
    // If it failed, you would return BadRequest().

    // === Step 5: (CORRECTED) Save the transaction and create the enrollment ===
    var payment = new Payment
    {
        UserId = userId,
        CourseId = course.Id,
        Amount = amountToCharge,
        AmountPaid = amountToCharge,
        Currency = "USD",
        TransactionId = transactionId,
        PaymentStatus = "Completed",
        PaymentDate = DateTime.UtcNow,
        PaymentMethod = paymentDto.PaymentMethod
    };

    // Create the enrollment using the correct field names from your table
    var enrollment = new CourseEnrollment 
    {
        StudentId = userId, // The UserId
        CourseId = course.Id,
        StudentProfileId = studentProfile.Id, // The ID from the StudentProfiles table
        EnrollmentDate = DateTime.UtcNow,
        Status = "Enrolled", // Set a default status
        ProgressPercentage = 0 // Start progress at 0
    };

    _context.Payments.Add(payment);
    _context.CourseEnrollments.Add(enrollment); // Add to the correct DbSet
    await _context.SaveChangesAsync();

    // === Step 6: Return a success response ===
    return Ok(new 
    { 
        message = "Payment successful!",
        enrollmentId = enrollment.Id,
        transactionId = payment.TransactionId
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
        // GET: api/checkout/{courseId}
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<CheckoutDto>> GetCheckoutDetails(int courseId)
        {
            // Step 1: Find the course and its related data.
            // The query now goes one level deeper to get the User from the InstructorProfile.
            var course = await _context.Courses
                                       .Include(c => c.Instructor)
                                           .ThenInclude(instructorProfile => instructorProfile.User)
                                       .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return NotFound(new { message = "Course not found." });
            }

            // Step 2: Calculate pricing securely on the server.
            decimal originalPrice = course.Price;
            decimal discount = 20.00m; // Example discount logic.
            decimal finalPrice = originalPrice - discount;

            if (finalPrice < 0)
            {
                finalPrice = 0;
            }

            // Step 3: Map the data to the DTO.
            var checkoutDetails = new CheckoutDto
            {
                CourseId = course.Id,
                CourseTitle = course.Title,
                // The path to the name is now longer, going through Instructor -> User.
                InstructorName = $"{course.Instructor?.User?.FirstName} {course.Instructor?.User?.LastName}".Trim(),
                OriginalPrice = originalPrice,
                Discount = discount,
                FinalPrice = finalPrice
            };

            // Handle cases where the instructor or user might be missing.
            if (string.IsNullOrWhiteSpace(checkoutDetails.InstructorName))
            {
                checkoutDetails.InstructorName = "N/A";
            }

            // Step 4: Return the DTO to the frontend.
            return Ok(checkoutDetails);
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