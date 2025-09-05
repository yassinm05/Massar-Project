using MasarSkills.API.Helpers;
using MasarSkills.API.Models;

namespace MasarSkills.API.Data
{
    public class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any()) return;

            // Create admin user
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
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            context.Users.Add(adminUser);

            // Create instructor
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
                Bio = "Experienced nursing instructor",
                Qualifications = "MSc in Nursing"
            };
            context.InstructorProfiles.Add(instructorProfile);

            // Create student
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
                CareerGoals = "Become a nursing assistant"
            };
            context.StudentProfiles.Add(studentProfile);

            // Create course
            var course = new Course
            {
                Title = "مقدمة في مساعدة التمريض",
                InstructorId = instructorProfile.Id,
                Description = "دورة تمهيدية شاملة",
                Price = 500.00m,
                DurationHours = 40,
                ThumbnailUrl = "/images/nursing-course.jpg",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Courses.Add(course);
            context.SaveChanges();

            // Create modules
            var module1 = new CourseModule
            {
                CourseId = course.Id,
                Title = "مقدمة في مهنة مساعد التمريض",
                Description = "نظرة عامة",
                Order = 1
            };

            var module2 = new CourseModule
            {
                CourseId = course.Id,
                Title = "المهارات الأساسية",
                Description = "تعلم المهارات",
                Order = 2
            };
            context.CourseModules.AddRange(module1, module2);
            context.SaveChanges();

            // Create learning materials
            var material1 = new LearningMaterial
            {
                ModuleId = module1.Id,
                Title = "فيديو مقدمة",
                Type = MaterialType.Video,
                ContentUrl = "/videos/intro.mp4",
                DurationMinutes = 15,
                Order = 1,
                IsPreview = true
            };

            var material2 = new LearningMaterial
            {
                ModuleId = module1.Id,
                Title = "دليل مساعد التمريض",
                Type = MaterialType.PDF,
                ContentUrl = "/documents/guide.pdf",
                DurationMinutes = 30,
                Order = 2
            };
            context.LearningMaterials.AddRange(material1, material2);

            // Create quiz
            var quiz = new Quiz
            {
                ModuleId = module1.Id,
                Title = "اختبار مقدمة في التمريض",
                Description = "اختبر معرفتك",
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

            context.SaveChanges();
            Console.WriteLine("Database seeded successfully!");
        }
    }
}

