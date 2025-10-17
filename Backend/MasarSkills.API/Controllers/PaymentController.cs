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

        [HttpGet("{courseId}/payment-plans")]
        public async Task<ActionResult<PaymentPlanDto>> GetPaymentPlans(int courseId)
        {
            // Step 1: Find the course in the database
            var course = await _context.Courses
                                .Include(c => c.Instructor)
                                    .ThenInclude(instructorProfile => instructorProfile.User)
                                .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return NotFound(new { message = "Course not found." });
            }

            // Step 2: Create the DTO and map the instructor's name (MAPPING UPDATED)
            var paymentPlan = new PaymentPlanDto
            {
                CourseId = course.Id,
                CourseTitle = course.Title,
                InstructorName = $"{course.Instructor?.User?.FirstName} {course.Instructor?.User?.LastName}".Trim()
            };

            // Handle cases where the instructor or user might be missing
            if (string.IsNullOrWhiteSpace(paymentPlan.InstructorName))
            {
                paymentPlan.InstructorName = "N/A";
            }

            // Step 3: Define the payment options with server-side logic

            // Option A: One-Time Payment (based on the course's actual price)
            paymentPlan.Options.Add(new PaymentOptionDto
            {
                Type = "onetime",
                DisplayText = $"One-time payment",
                TotalAmount = course.Price,
                InstallmentsCount = 1,
                AmountPerInstallment = course.Price
            });

            // Option B: Installment Plan (Business rule example)
            // Let's say you only offer installments for courses over $150
            if (course.Price > 150.00m)
            {
                // These values are defined securely on the backend
                int count = 4;
                decimal installmentPrice = course.Price / 4; // This can be a fixed price or calculated
                decimal totalInstallmentAmount = count * installmentPrice;

                paymentPlan.Options.Add(new PaymentOptionDto
                {
                    Type = "installment",
                    DisplayText = $"{count} payments of ${installmentPrice}",
                    TotalAmount = totalInstallmentAmount,
                    InstallmentsCount = count,
                    AmountPerInstallment = installmentPrice
                });
            }

            // Step 4: Return the complete plan to the frontend
            return Ok(paymentPlan);
        }
        // POST: api/payment/process
        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDto paymentDto)
        {
            // === Step 1: Get User and Course ===
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out var userId)) return Unauthorized();

            var course = await _context.Courses.FindAsync(paymentDto.CourseId);
            if (course == null) return NotFound(new { message = "Course not found." });

            var studentProfile = await _context.StudentProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (studentProfile == null) return BadRequest(new { message = "Student profile not found." });

            var isAlreadyEnrolled = await _context.CourseEnrollments
            .AnyAsync(e => e.StudentId == userId && e.CourseId == course.Id);

            if (isAlreadyEnrolled)
            {
                // If the user is already enrolled, stop the process immediately.
                return BadRequest(new { message = "You are already enrolled in this course." });
            }


            // === Step 2: SECURELY Get Payment Plan Details ===

            // First, calculate the final price after discount. This is the base for all plans.
            decimal finalPriceAfterDiscount = course.Price - 20.00m; // Example: 500 - 20 = 480

            // Define the one-time plan based on the final price
            var oneTimePlan = new { Type = "onetime", TotalAmount = finalPriceAfterDiscount, InstallmentAmount = finalPriceAfterDiscount, Count = 1 };

            // Define the installment plan dynamically based on the final price
            int installmentCount = 4;
            var installmentPlan = new
            {
                Type = "installment",
                TotalAmount = finalPriceAfterDiscount,
                InstallmentAmount = finalPriceAfterDiscount / installmentCount,
                Count = installmentCount
            };


            // === Step 3: Determine which plan the user chose (Same as before) ===
            decimal totalAmount;
            decimal amountToChargeNow;
            int installmentsCount;

            if (paymentDto.PaymentPlanType == "onetime")
            {
                totalAmount = oneTimePlan.TotalAmount;
                amountToChargeNow = oneTimePlan.InstallmentAmount;
                installmentsCount = oneTimePlan.Count;
            }
            else if (paymentDto.PaymentPlanType == "installment") // Simplified the rule for this example
            {
                totalAmount = installmentPlan.TotalAmount;
                amountToChargeNow = installmentPlan.InstallmentAmount;
                installmentsCount = installmentPlan.Count;
            }
            else
            {
                return BadRequest(new { message = "Invalid payment plan selected." });
            }

            // For clarity, here is the corrected Payment record creation again:
            string transactionId = $"SIM_TXN_{Guid.NewGuid()}"; // Simulation

            var payment = new Payment
            {
                UserId = userId,
                CourseId = course.Id,
                Amount = totalAmount,
                AmountPaid = amountToChargeNow,
                RemainingAmount = totalAmount - amountToChargeNow,
                Currency = "USD",
                PaymentMethod = "Card",
                TransactionId = transactionId,
                PaymentStatus = (totalAmount - amountToChargeNow > 0) ? "Pending" : "Completed",
                InstallmentsCount = installmentsCount,
                CurrentInstallment = 1,
                PaymentDate = DateTime.UtcNow,
                NextPaymentDate = (installmentsCount > 1) ? DateTime.UtcNow.AddMonths(1) : (DateTime?)null
            };

            // ... (the enrollment and save changes code) ...
            var enrollment = new CourseEnrollment
            {
                StudentId = userId,
                CourseId = course.Id,
                StudentProfileId = studentProfile.Id,
                EnrollmentDate = DateTime.UtcNow,
                Status = "Enrolled",
                ProgressPercentage = 0
            };

            _context.Payments.Add(payment);
            _context.CourseEnrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Payment successful!",
                enrollmentId = enrollment.Id,
                transactionId = payment.TransactionId
            });
        }

        // POST: api/payment/installment
        [HttpPost("installment")]
        public async Task<IActionResult> PayNextInstallment([FromBody] PayInstallmentDto installmentDto)
        {
            // === Step 1: Find the original payment record ===
            var payment = await _context.Payments
                                        .FirstOrDefaultAsync(p => p.Id == installmentDto.PaymentId);

            // === Step 2: Validate the payment record ===
            if (payment == null)
            {
                return NotFound(new { message = "Original payment record not found." });
            }

            if (payment.PaymentStatus != "Pending" || payment.RemainingAmount <= 0)
            {
                return BadRequest(new { message = "This payment is already completed or not an active installment plan." });
            }

            // === Step 3: Calculate the amount for this installment ===
            // Recalculate server-side to ensure accuracy
            decimal installmentAmount = payment.Amount / payment.InstallmentsCount;


            // === Step 4: Process the charge with the payment gateway (Simulation) ===
            try
            {
                // In a real gateway, this would be a simple "charge", not creating a new subscription.
                string transactionId = $"SIM_INST_{Guid.NewGuid()}";
                // You could also log this new transactionId somewhere if needed.
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Payment processing failed for this installment." });
            }

            // === Step 5: UPDATE the original payment record ===
            payment.AmountPaid += installmentAmount;
            payment.RemainingAmount -= installmentAmount;
            payment.CurrentInstallment++;

            // Check if this is the final payment
            if (payment.RemainingAmount <= 0)
            {
                payment.PaymentStatus = "Completed";
                payment.NextPaymentDate = null; // No more payments are due
                payment.RemainingAmount = 0; // Clean up any tiny remainder from division
            }
            else
            {
                // Set the date for the next installment
                payment.NextPaymentDate = DateTime.UtcNow.AddMonths(1);
            }


            // === Step 6: Save the changes ===
            // Notice we are NOT creating a new Payment or a new Enrollment. We are only saving changes.
            await _context.SaveChangesAsync();


            // === Step 7: Return a success response ===
            return Ok(new
            {
                message = $"Successfully paid installment {payment.CurrentInstallment - 1}.",
                paymentStatus = payment.PaymentStatus,
                remainingAmount = payment.RemainingAmount
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

        // // GET: api/payment/{id}
        // [HttpGet("{id}")]
        // public async Task<IActionResult> GetPaymentDetails(int id)
        // {
        //     var payment = await _context.Payments
        //         .Include(p => p.Course)
        //         .Include(p => p.User)
        //         .FirstOrDefaultAsync(p => p.Id == id);

        //     if (payment == null)
        //     {
        //         return NotFound();
        //     }

        //     var paymentDetails = new PaymentDetailsDto
        //     {
        //         Id = payment.Id,
        //         Amount = payment.Amount,
        //         AmountPaid = payment.AmountPaid,
        //         RemainingAmount = payment.RemainingAmount,
        //         Currency = payment.Currency,
        //         PaymentMethod = payment.PaymentMethod,
        //         TransactionId = payment.TransactionId,
        //         PaymentStatus = payment.PaymentStatus,
        //         InstallmentsCount = payment.InstallmentsCount,
        //         CurrentInstallment = payment.CurrentInstallment,
        //         PaymentDate = payment.PaymentDate,
        //         NextPaymentDate = payment.NextPaymentDate,
        //         UserName = $"{payment.User.FirstName} {payment.User.LastName}",
        //         CourseTitle = payment.Course?.Title
        //     };

        //     return Ok(paymentDetails);
        // }
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
        public string PaymentPlanType { get; set; }
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