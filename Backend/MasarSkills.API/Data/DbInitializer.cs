using MasarSkills.API.Models;
using MasarSkills.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace MasarSkills.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Check if database already has data
            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            // Create initial admin user
            var adminPassword = "Admin@123";
            PasswordHasher.CreatePasswordHash(adminPassword, out byte[] adminPasswordHash, out byte[] adminPasswordSalt);

            var adminUser = new User
            {
                FirstName = "System",
                LastName = "Admin",
                Email = "admin@masarskills.com",
                PasswordHash = adminPasswordHash,
                PasswordSalt = adminPasswordSalt,
                Role = "Admin",
                PaymentId = "ADM001",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            context.Users.Add(adminUser);

            // Create finance admin
            var financeAdminPassword = "Finance@123";
            PasswordHasher.CreatePasswordHash(financeAdminPassword, out byte[] financeAdminPasswordHash, out byte[] financeAdminPasswordSalt);

            var financeAdminUser = new User
            {
                FirstName = "Finance",
                LastName = "Manager",
                Email = "finance@masarskills.com",
                PasswordHash = financeAdminPasswordHash,
                PasswordSalt = financeAdminPasswordSalt,
                Role = "Admin",
                PaymentId = "ADM002",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            context.Users.Add(financeAdminUser);
            context.SaveChanges();

            // Create admin profiles
            var adminProfile = new AdminProfile
            {
                UserId = adminUser.Id,
                PhoneNumber = "+201001001001",
                Department = "System Administration",
                HireDate = DateTime.UtcNow,
                Responsibilities = "System management, user management, content moderation"
            };

            var financeAdminProfile = new AdminProfile
            {
                UserId = financeAdminUser.Id,
                PhoneNumber = "+201002002002",
                Department = "Finance",
                HireDate = DateTime.UtcNow,
                Responsibilities = "Payment processing, financial reports, refund management"
            };

            context.AdminProfiles.AddRange(adminProfile, financeAdminProfile);

            // Create sample instructor
            var instructorPassword = "Instructor@123";
            PasswordHasher.CreatePasswordHash(instructorPassword, out byte[] instructorPasswordHash, out byte[] instructorPasswordSalt);

            var instructorUser = new User
            {
                FirstName = "Ahmed",
                LastName = "Mohamed",
                Email = "ahmed.mohamed@masarskills.com",
                PasswordHash = instructorPasswordHash,
                PasswordSalt = instructorPasswordSalt,
                Role = "Instructor",
                PaymentId = "INST001",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            context.Users.Add(instructorUser);
            context.SaveChanges();

            var instructorProfile = new InstructorProfile
            {
                UserId = instructorUser.Id,
                PhoneNumber = "+201234567890",
                Specialization = "Nursing Fundamentals, Patient Care",
                YearsOfExperience = 10,
                Bio = "Experienced nursing instructor with 10 years of teaching experience",
                Qualifications = "MSc in Nursing, BSc in Nursing"
            };

            context.InstructorProfiles.Add(instructorProfile);

            // Create sample student
            var studentPassword = "Student@123";
            PasswordHasher.CreatePasswordHash(studentPassword, out byte[] studentPasswordHash, out byte[] studentPasswordSalt);

            var studentUser = new User
            {
                FirstName = "Mohamed",
                LastName = "Ali",
                Email = "mohamed.ali@example.com",
                PasswordHash = studentPasswordHash,
                PasswordSalt = studentPasswordSalt,
                Role = "Student",
                PaymentId = "STU001",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            context.Users.Add(studentUser);
            context.SaveChanges();

            var studentProfile = new StudentProfile
            {
                UserId = studentUser.Id,
                PhoneNumber = "+201112223344",
                DateOfBirth = new DateTime(1995, 5, 15),
                Address = "Cairo, Egypt",
                EducationLevel = "High School",
                CareerGoals = "Become a professional nursing assistant",
                Skills = "Basic first aid, Patient care"
            };

            context.StudentProfiles.Add(studentProfile);

            // Create sample course
            var course = new Course
            {
                Title = "مقدمة في مساعدة التمريض",
                Description = "هذه دورة تمهيدية شاملة تغطي الأساسيات والمبادئ الأساسية لمساعد التمريض.",
                Price = 500.00m,
                DurationHours = 40,
                ThumbnailUrl = "/images/nursing-course.jpg",
                IsActive = true,
                InstructorId = instructorProfile.Id,
                CreatedAt = DateTime.UtcNow
            };

            context.Courses.Add(course);
            context.SaveChanges();

            // Create course modules
            var module1 = new CourseModule
            {
                CourseId = course.Id,
                Title = "مقدمة في مهنة مساعد التمريض",
                Description = "نظرة عامة على دور ومسؤوليات مساعد التمريض",
                Order = 1
            };

            var module2 = new CourseModule
            {
                CourseId = course.Id,
                Title = "المهارات الأساسية للعناية بالمريض",
                Description = "تعلم المهارات الأساسية اللازمة للعناية بالمريض",
                Order = 2
            };

            context.CourseModules.AddRange(module1, module2);
            context.SaveChanges();

            // Create learning materials
            var material1 = new LearningMaterial
            {
                ModuleId = module1.Id,
                Title = "فيديو مقدمة عن مهنة التمريض",
                Description = "شاهد هذا الفيديو للتعرف على مهنة مساعد التمريض",
                Type = MaterialType.Video,
                ContentUrl = "/videos/intro-to-nursing.mp4",
                DurationMinutes = 15,
                Order = 1,
                IsPreview = true
            };

            var material2 = new LearningMaterial
            {
                ModuleId = module1.Id,
                Title = "دليل مساعد التمريض",
                Description = "اقرأ هذا الدليل للتعرف على المهارات المطلوبة",
                Type = MaterialType.PDF,
                ContentUrl = "/documents/nursing-assistant-guide.pdf",
                DurationMinutes = 30,
                Order = 2,
                IsPreview = false
            };

            context.LearningMaterials.AddRange(material1, material2);

            // Create quiz
            var quiz = new Quiz
            {
                ModuleId = module1.Id,
                Title = "اختبار مقدمة في التمريض",
                Description = "اختبر معرفتك بأساسيات مهنة التمريض",
                TimeLimitMinutes = 30,
                PassingScore = 70,
                MaxAttempts = 3
            };

            context.Quizzes.Add(quiz);
            context.SaveChanges();

            // Create questions
            var question1 = new QuizQuestion
            {
                QuizId = quiz.Id,
                QuestionText = "ما هو الدور الرئيسي لمساعد التمريض؟",
                QuestionType = "MultipleChoice",
                Points = 5,
                Order = 1
            };

            context.QuizQuestions.Add(question1);
            context.SaveChanges();

            // Create options
            var option1 = new QuestionOption
            {
                QuestionId = question1.Id,
                OptionText = "تقديم الرعاية الأساسية للمرضى",
                IsCorrect = true,
                Order = 1
            };

            var option2 = new QuestionOption
            {
                QuestionId = question1.Id,
                OptionText = "إجراء العمليات الجراحية",
                IsCorrect = false,
                Order = 2
            };

            context.QuestionOptions.AddRange(option1, option2);

            // Create course enrollment
            var enrollment = new CourseEnrollment
            {
                StudentId = studentUser.Id,
                CourseId = course.Id,
                EnrollmentDate = DateTime.UtcNow,
                ProgressPercentage = 0,
                Status = "Enrolled"
            };

            context.CourseEnrollments.Add(enrollment);

            // Create sample payments
            var payment1 = new Payment
            {
                UserId = studentUser.Id,
                CourseId = course.Id,
                Amount = 500.00m,
                AmountPaid = 250.00m,
                RemainingAmount = 250.00m,
                Currency = "EGP",
                PaymentMethod = "BankTransfer",
                TransactionId = "TXN202409050001",
                PaymentStatus = "Completed",
                InstallmentsCount = 2,
                CurrentInstallment = 1,
                PaymentDate = DateTime.UtcNow,
                NextPaymentDate = DateTime.UtcNow.AddDays(30)
            };

            var payment2 = new Payment
            {
                UserId = instructorUser.Id,
                Amount = 2000.00m,
                AmountPaid = 2000.00m,
                RemainingAmount = 0.00m,
                Currency = "EGP",
                PaymentMethod = "BankTransfer",
                TransactionId = "TXN202409050002",
                PaymentStatus = "Completed",
                InstallmentsCount = 1,
                CurrentInstallment = 1,
                PaymentDate = DateTime.UtcNow.AddDays(-15)
            };

            var payment3 = new Payment
            {
                UserId = adminUser.Id,
                Amount = 5000.00m,
                AmountPaid = 3000.00m,
                RemainingAmount = 2000.00m,
                Currency = "EGP",
                PaymentMethod = "CreditCard",
                TransactionId = "TXN202409050003",
                PaymentStatus = "Pending",
                InstallmentsCount = 3,
                CurrentInstallment = 2,
                PaymentDate = DateTime.UtcNow.AddDays(-30),
                NextPaymentDate = DateTime.UtcNow.AddDays(15)
            };

            context.Payments.AddRange(payment1, payment2, payment3);
            context.SaveChanges();

            Console.WriteLine("Database seeded successfully with all data including admins and payments!");
        }
    }
}