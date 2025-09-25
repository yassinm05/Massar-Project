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

            // إنشاء إشعارات تجريبية
            var welcomeNotification = new Notification
            {
                UserId = studentUser.Id,
                Title = "مرحباً بك في منصة مسار سكيلز!",
                Message = "نحن سعداء بانضمامك إلى منصتنا. ابدأ رحلتك التعليمية الآن.",
                Type = "Success",
                CreatedAt = DateTime.UtcNow
            };

            var courseNotification = new Notification
            {
                UserId = studentUser.Id,
                Title = "تم تسجيلك في دورة جديدة",
                Message = "تم تسجيلك في دورة 'مقدمة في مساعدة التمريض' بنجاح.",
                Type = "Course",
                RelatedEntityType = "Course",
                RelatedEntityId = course.Id,
                CreatedAt = DateTime.UtcNow
            };
            context.Notifications.AddRange(welcomeNotification, courseNotification);
        }

        // 🔹 NEW METHOD for extra data
        public static void SeedExtraData(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // ---------- EXTRA COURSES ----------
            if (!context.Courses.Any(c => c.Title == "أساسيات الإسعافات الأولية"))
            {
                var course2 = new Course
                {
                    Title = "أساسيات الإسعافات الأولية",
                    Description = "دورة شاملة حول تقنيات الإسعافات الأولية للتعامل مع الحالات الطارئة.",
                    Price = 600.00m,
                    DurationHours = 30,
                    ThumbnailUrl = "/images/first-aid.jpg",
                    IsActive = true,
                    InstructorId = context.InstructorProfiles.First().Id, // 🔹 use existing instructor
                    CreatedAt = DateTime.UtcNow
                };

                var course3 = new Course
                {
                    Title = "إدارة الرعاية الصحية",
                    Description = "مقدمة في إدارة أنظمة الرعاية الصحية والسياسات الطبية.",
                    Price = 800.00m,
                    DurationHours = 50,
                    ThumbnailUrl = "/images/healthcare-management.jpg",
                    IsActive = true,
                    InstructorId = context.InstructorProfiles.First().Id,
                    CreatedAt = DateTime.UtcNow
                };

                context.Courses.AddRange(course2, course3);
                context.SaveChanges();

                // ---------- MODULES FOR COURSE 2 ----------
                var c2Module1 = new CourseModule
                {
                    CourseId = course2.Id,
                    Title = "مقدمة في الإسعافات الأولية",
                    Description = "تعرف على المبادئ الأساسية للإسعافات الأولية.",
                    Order = 1
                };

                var c2Module2 = new CourseModule
                {
                    CourseId = course2.Id,
                    Title = "التعامل مع الإصابات الشائعة",
                    Description = "طرق التعامل مع الجروح والحروق والكسور.",
                    Order = 2
                };

                context.CourseModules.AddRange(c2Module1, c2Module2);

                // ---------- MODULES FOR COURSE 3 ----------
                var c3Module1 = new CourseModule
                {
                    CourseId = course3.Id,
                    Title = "مقدمة في إدارة الرعاية الصحية",
                    Description = "مفاهيم الإدارة في بيئة الرعاية الصحية.",
                    Order = 1
                };

                var c3Module2 = new CourseModule
                {
                    CourseId = course3.Id,
                    Title = "السياسات والإجراءات",
                    Description = "التعرف على السياسات الطبية وإدارة الجودة.",
                    Order = 2
                };

                context.CourseModules.AddRange(c3Module1, c3Module2);
                context.SaveChanges();
            }

            // ---------- NEW STUDENTS ----------
            if (!context.Users.Any(u => u.Email == "sara.hassan@example.com"))
            {
                var student2Password = "Student2@123";
                PasswordHasher.CreatePasswordHash(student2Password, out byte[] student2Hash, out byte[] student2Salt);

                var student2 = new User
                {
                    FirstName = "Sara",
                    LastName = "Hassan",
                    Email = "sara.hassan@example.com",
                    PasswordHash = student2Hash,
                    PasswordSalt = student2Salt,
                    Role = "Student",
                    PaymentId = "STU002",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                context.Users.Add(student2);
                context.SaveChanges();

                var student2Profile = new StudentProfile
                {
                    UserId = student2.Id,
                    PhoneNumber = "+201223344556",
                    DateOfBirth = new DateTime(1997, 8, 12),
                    Address = "Alexandria, Egypt",
                    EducationLevel = "Bachelor",
                    CareerGoals = "Work as a certified nurse",
                    Skills = "First aid, Basic healthcare management"
                };

                context.StudentProfiles.Add(student2Profile);
                context.SaveChanges();

                // ---------- ENROLLMENT ----------
                var course2 = context.Courses.First(c => c.Title == "أساسيات الإسعافات الأولية");

                var enrollment2 = new CourseEnrollment
                {
                    StudentId = student2.Id,
                    CourseId = course2.Id,
                    EnrollmentDate = DateTime.UtcNow,
                    ProgressPercentage = 0,
                    Status = "Enrolled"
                };

                context.CourseEnrollments.Add(enrollment2);

                // ---------- PAYMENT ----------
                var payment4 = new Payment
                {
                    UserId = student2.Id,
                    CourseId = course2.Id,
                    Amount = 600.00m,
                    AmountPaid = 600.00m,
                    RemainingAmount = 0.00m,
                    Currency = "EGP",
                    PaymentMethod = "CreditCard",
                    TransactionId = "TXN202409050004",
                    PaymentStatus = "Completed",
                    InstallmentsCount = 1,
                    CurrentInstallment = 1,
                    PaymentDate = DateTime.UtcNow
                };

                context.Payments.Add(payment4);
                context.SaveChanges();
            }

            if (!context.Users.Any(u => u.Email == "omar.youssef@example.com"))
            {
                var student3Password = "Student3@123";
                PasswordHasher.CreatePasswordHash(student3Password, out byte[] student3Hash, out byte[] student3Salt);

                var student3 = new User
                {
                    FirstName = "Omar",
                    LastName = "Youssef",
                    Email = "omar.youssef@example.com",
                    PasswordHash = student3Hash,
                    PasswordSalt = student3Salt,
                    Role = "Student",
                    PaymentId = "STU003",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                context.Users.Add(student3);
                context.SaveChanges();

                var student3Profile = new StudentProfile
                {
                    UserId = student3.Id,
                    PhoneNumber = "+201334455667",
                    DateOfBirth = new DateTime(1998, 3, 22),
                    Address = "Giza, Egypt",
                    EducationLevel = "Diploma",
                    CareerGoals = "Healthcare administration career",
                    Skills = "Organizational skills, Communication"
                };

                context.StudentProfiles.Add(student3Profile);
                context.SaveChanges();

                // ---------- ENROLLMENT ----------
                var course3 = context.Courses.First(c => c.Title == "إدارة الرعاية الصحية");

                var enrollment3 = new CourseEnrollment
                {
                    StudentId = student3.Id,
                    CourseId = course3.Id,
                    EnrollmentDate = DateTime.UtcNow,
                    ProgressPercentage = 0,
                    Status = "Enrolled"
                };

                context.CourseEnrollments.Add(enrollment3);

                // ---------- PAYMENT ----------
                var payment5 = new Payment
                {
                    UserId = student3.Id,
                    CourseId = course3.Id,
                    Amount = 800.00m,
                    AmountPaid = 400.00m,
                    RemainingAmount = 400.00m,
                    Currency = "EGP",
                    PaymentMethod = "BankTransfer",
                    TransactionId = "TXN202409050005",
                    PaymentStatus = "Pending",
                    InstallmentsCount = 2,
                    CurrentInstallment = 1,
                    PaymentDate = DateTime.UtcNow,
                    NextPaymentDate = DateTime.UtcNow.AddDays(30)
                };

                context.Payments.Add(payment5);
                context.SaveChanges();
            }

            Console.WriteLine("Extra courses, students, enrollments, and payments seeded (only if missing)!");
        }
        public static void SeedExtraQuizzes(ApplicationDbContext context)
        {
        // Removed EnsureCreated() ✅
        
            if (!context.Quizzes.Any(q => q.Title == "اختبار الإسعافات الأولية"))
            {
                var course2 = context.Courses.First(c => c.Title == "أساسيات الإسعافات الأولية");
                var course3 = context.Courses.First(c => c.Title == "إدارة الرعاية الصحية");
                var saraUser = context.Users.First(u => u.Email == "sara.hassan@example.com");
                var omarUser = context.Users.First(u => u.Email == "omar.youssef@example.com");
                var saraEnrollment = context.CourseEnrollments.First(e => e.StudentId == saraUser.Id && e.CourseId == course2.Id);
                var omarEnrollment = context.CourseEnrollments.First(e => e.StudentId == omarUser.Id && e.CourseId == course3.Id);

                // Quiz 1 for Course 2
                var quiz1 = new Quiz
                {
                    ModuleId = context.CourseModules.First(m => m.CourseId == course2.Id).Id,
                    Title = "اختبار الإسعافات الأولية",
                    Description = "اختبار لتقييم معرفتك بأساسيات الإسعافات الأولية",
                    TimeLimitMinutes = 25,
                    PassingScore = 60,
                    MaxAttempts = 2
                };

                context.Quizzes.Add(quiz1);
                context.SaveChanges();

                // ✅ Add Questions for Quiz 1 only if missing
                if (!context.QuizQuestions.Any(q => q.QuizId == quiz1.Id))
                {
                    var question1_1 = new QuizQuestion
                    {
                        QuizId = quiz1.Id,
                        QuestionText = "ما هي الخطوة الأولى في تقديم الإسعافات الأولية؟",
                        QuestionType = "MultipleChoice",
                        Points = 5,
                        Order = 1,
                        TopicId = 1
                    };

                    var question1_2 = new QuizQuestion
                    {
                        QuizId = quiz1.Id,
                        QuestionText = "كيف تعالج حروق الدرجة الأولى؟",
                        QuestionType = "MultipleChoice",
                        Points = 5,
                        Order = 2,
                        TopicId = 1
                    };

                    context.QuizQuestions.AddRange(question1_1, question1_2);
                    context.SaveChanges();
                }

                // ✅ Quiz Attempt for Sara only if missing
                if (!context.QuizAttempts.Any(qa => qa.StudentId == saraUser.Id && qa.QuizId == quiz1.Id))
                {
                    var quizAttempt1 = new QuizAttempt
                    {
                        EnrollmentId = saraEnrollment.Id,
                        StudentId = 2,
                        QuizId = quiz1.Id,
                        AttemptDate = DateTime.UtcNow,
                        StartTime = DateTime.UtcNow,
                        EndTime = DateTime.UtcNow.AddMinutes(25),
                        Score = 10.00m,
                        AttemptNumber = 1,
                        Status = "Completed"
                    };

                    context.QuizAttempts.Add(quizAttempt1);
                    context.SaveChanges();

                    // ✅ Answers only if missing
                    if (!context.QuizAnswers.Any(a => a.QuizAttemptId == quizAttempt1.Id))
                    {
                        var answer1_1 = new QuizAnswer
                        {
                            QuizAttemptId = quizAttempt1.Id,
                            QuestionId = context.QuizQuestions.First(q => q.QuizId == quiz1.Id && q.Order == 1).Id,
                            SelectedOptionId = 1,
                            IsCorrect = true,
                            PointsEarned = 5,
                            AnsweredAt = DateTime.UtcNow,
                            TextAnswer = "object"
                        };

                        var answer1_2 = new QuizAnswer
                        {
                            QuizAttemptId = quizAttempt1.Id,
                            QuestionId = context.QuizQuestions.First(q => q.QuizId == quiz1.Id && q.Order == 2).Id,
                            SelectedOptionId = 2,
                            IsCorrect = true,
                            PointsEarned = 5,
                            AnsweredAt = DateTime.UtcNow,
                            TextAnswer = "Base"
                        };

                        context.QuizAnswers.AddRange(answer1_1, answer1_2);
                        context.SaveChanges();
                    }
                }

                // Quiz 2 for Course 3
                var quiz2 = new Quiz
                {
                    ModuleId = context.CourseModules.First(m => m.CourseId == course3.Id).Id,
                    Title = "اختبار إدارة الرعاية الصحية",
                    Description = "اختبار لتقييم معرفتك بإدارة الرعاية الصحية",
                    TimeLimitMinutes = 30,
                    PassingScore = 70,
                    MaxAttempts = 3
                };

                context.Quizzes.Add(quiz2);
                context.SaveChanges();

                // ✅ Add Questions for Quiz 2 only if missing
                if (!context.QuizQuestions.Any(q => q.QuizId == quiz2.Id))
                {
                    var question2_1 = new QuizQuestion
                    {
                        QuizId = quiz2.Id,
                        QuestionText = "ما هي أهمية السياسات الصحية؟",
                        QuestionType = "MultipleChoice",
                        Points = 5,
                        Order = 1,
                        TopicId = 2
                    };

                    var question2_2 = new QuizQuestion
                    {
                        QuizId = quiz2.Id,
                        QuestionText = "ما هي خطوات إدارة جودة الرعاية الصحية؟",
                        QuestionType = "MultipleChoice",
                        Points = 5,
                        Order = 2,
                        TopicId = 2
                    };

                    context.QuizQuestions.AddRange(question2_1, question2_2);
                    context.SaveChanges();
                }

                // ✅ Quiz Attempt for Omar only if missing
                if (!context.QuizAttempts.Any(qa => qa.StudentId == omarUser.Id && qa.QuizId == quiz2.Id))
                {
                    var quizAttempt2 = new QuizAttempt
                    {
                        EnrollmentId = omarEnrollment.Id,
                        StudentId = omarUser.Id,
                        QuizId = quiz2.Id,
                        AttemptDate = DateTime.UtcNow,
                        StartTime = DateTime.UtcNow,
                        EndTime = DateTime.UtcNow.AddMinutes(30),
                        Score = 10.00m,
                        AttemptNumber = 1,
                        Status = "Completed"
                    };

                    context.QuizAttempts.Add(quizAttempt2);
                    context.SaveChanges();

                    // ✅ Answers only if missing
                    if (!context.QuizAnswers.Any(a => a.QuizAttemptId == quizAttempt2.Id))
                    {
                        var answer2_1 = new QuizAnswer
                        {
                            QuizAttemptId = quizAttempt2.Id,
                            QuestionId = context.QuizQuestions.First(q => q.QuizId == quiz2.Id && q.Order == 1).Id,
                            SelectedOptionId = 3,
                            IsCorrect = true,
                            PointsEarned = 5,
                            AnsweredAt = DateTime.UtcNow,
                            TextAnswer = "object"
                        };

                        var answer2_2 = new QuizAnswer
                        {
                            QuizAttemptId = quizAttempt2.Id,
                            QuestionId = context.QuizQuestions.First(q => q.QuizId == quiz2.Id && q.Order == 2).Id,
                            SelectedOptionId = 4,
                            IsCorrect = true,
                            PointsEarned = 5,
                            AnsweredAt = DateTime.UtcNow,
                            TextAnswer = "Base"
                        };

                        context.QuizAnswers.AddRange(answer2_1, answer2_2);
                        context.SaveChanges();
                    }
                }
            }

            Console.WriteLine("Extra quizzes, questions, attempts, and answers seeded (only if missing)!");
            }

    }
}
