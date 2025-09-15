IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [FirstName] nvarchar(100) NOT NULL,
        [LastName] nvarchar(100) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [PasswordHash] varbinary(max) NOT NULL,
        [PasswordSalt] varbinary(max) NOT NULL,
        [Role] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [InstructorProfiles] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [PhoneNumber] nvarchar(20) NOT NULL,
        [Specialization] nvarchar(200) NOT NULL,
        [YearsOfExperience] int NOT NULL,
        [Bio] nvarchar(500) NOT NULL,
        [Qualifications] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_InstructorProfiles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_InstructorProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [StudentProfiles] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [PhoneNumber] nvarchar(20) NOT NULL,
        [DateOfBirth] datetime2 NULL,
        [Address] nvarchar(200) NOT NULL,
        [EducationLevel] nvarchar(100) NOT NULL,
        [CareerGoals] nvarchar(max) NOT NULL,
        [Skills] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_StudentProfiles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StudentProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [Courses] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [DurationHours] int NOT NULL,
        [ThumbnailUrl] nvarchar(500) NOT NULL,
        [IsActive] bit NOT NULL,
        [InstructorId] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Courses] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Courses_InstructorProfiles_InstructorId] FOREIGN KEY ([InstructorId]) REFERENCES [InstructorProfiles] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [CourseEnrollments] (
        [Id] int NOT NULL IDENTITY,
        [StudentId] int NOT NULL,
        [CourseId] int NOT NULL,
        [EnrollmentDate] datetime2 NOT NULL,
        [CompletionDate] datetime2 NULL,
        [ProgressPercentage] decimal(18,2) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [FinalGrade] decimal(18,2) NULL,
        [StudentProfileId] int NULL,
        CONSTRAINT [PK_CourseEnrollments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CourseEnrollments_Courses_CourseId] FOREIGN KEY ([CourseId]) REFERENCES [Courses] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_CourseEnrollments_StudentProfiles_StudentProfileId] FOREIGN KEY ([StudentProfileId]) REFERENCES [StudentProfiles] ([Id]),
        CONSTRAINT [FK_CourseEnrollments_Users_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [CourseModules] (
        [Id] int NOT NULL IDENTITY,
        [CourseId] int NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Order] int NOT NULL,
        CONSTRAINT [PK_CourseModules] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CourseModules_Courses_CourseId] FOREIGN KEY ([CourseId]) REFERENCES [Courses] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [LearningMaterials] (
        [Id] int NOT NULL IDENTITY,
        [ModuleId] int NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Type] int NOT NULL,
        [ContentUrl] nvarchar(500) NOT NULL,
        [DurationMinutes] int NOT NULL,
        [Order] int NOT NULL,
        [IsPreview] bit NOT NULL,
        CONSTRAINT [PK_LearningMaterials] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_LearningMaterials_CourseModules_ModuleId] FOREIGN KEY ([ModuleId]) REFERENCES [CourseModules] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [Quizzes] (
        [Id] int NOT NULL IDENTITY,
        [ModuleId] int NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [TimeLimitMinutes] int NOT NULL,
        [PassingScore] int NOT NULL,
        [MaxAttempts] int NOT NULL,
        CONSTRAINT [PK_Quizzes] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Quizzes_CourseModules_ModuleId] FOREIGN KEY ([ModuleId]) REFERENCES [CourseModules] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [QuizAttempts] (
        [Id] int NOT NULL IDENTITY,
        [EnrollmentId] int NOT NULL,
        [QuizId] int NOT NULL,
        [StartTime] datetime2 NOT NULL,
        [EndTime] datetime2 NULL,
        [Score] decimal(18,2) NOT NULL,
        [AttemptNumber] int NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_QuizAttempts] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QuizAttempts_CourseEnrollments_EnrollmentId] FOREIGN KEY ([EnrollmentId]) REFERENCES [CourseEnrollments] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_QuizAttempts_Quizzes_QuizId] FOREIGN KEY ([QuizId]) REFERENCES [Quizzes] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [QuizQuestions] (
        [Id] int NOT NULL IDENTITY,
        [QuizId] int NOT NULL,
        [QuestionText] nvarchar(max) NOT NULL,
        [QuestionType] nvarchar(max) NOT NULL,
        [Points] int NOT NULL,
        [Order] int NOT NULL,
        CONSTRAINT [PK_QuizQuestions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QuizQuestions_Quizzes_QuizId] FOREIGN KEY ([QuizId]) REFERENCES [Quizzes] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [QuestionOptions] (
        [Id] int NOT NULL IDENTITY,
        [QuestionId] int NOT NULL,
        [OptionText] nvarchar(max) NOT NULL,
        [IsCorrect] bit NOT NULL,
        [Order] int NOT NULL,
        CONSTRAINT [PK_QuestionOptions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QuestionOptions_QuizQuestions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [QuizQuestions] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE TABLE [QuizAnswers] (
        [Id] int NOT NULL IDENTITY,
        [QuizAttemptId] int NOT NULL,
        [QuestionId] int NOT NULL,
        [SelectedOptionId] int NULL,
        [TextAnswer] nvarchar(1000) NOT NULL,
        [IsCorrect] bit NOT NULL,
        [PointsEarned] int NOT NULL,
        [AnsweredAt] datetime2 NOT NULL,
        CONSTRAINT [PK_QuizAnswers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QuizAnswers_QuestionOptions_SelectedOptionId] FOREIGN KEY ([SelectedOptionId]) REFERENCES [QuestionOptions] ([Id]),
        CONSTRAINT [FK_QuizAnswers_QuizAttempts_QuizAttemptId] FOREIGN KEY ([QuizAttemptId]) REFERENCES [QuizAttempts] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_QuizAnswers_QuizQuestions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [QuizQuestions] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_CourseEnrollments_CourseId] ON [CourseEnrollments] ([CourseId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_CourseEnrollments_StudentId] ON [CourseEnrollments] ([StudentId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_CourseEnrollments_StudentProfileId] ON [CourseEnrollments] ([StudentProfileId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_CourseModules_CourseId] ON [CourseModules] ([CourseId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_Courses_InstructorId] ON [Courses] ([InstructorId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_InstructorProfiles_UserId] ON [InstructorProfiles] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_LearningMaterials_ModuleId] ON [LearningMaterials] ([ModuleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_QuestionOptions_QuestionId] ON [QuestionOptions] ([QuestionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_QuizAnswers_QuestionId] ON [QuizAnswers] ([QuestionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_QuizAnswers_QuizAttemptId] ON [QuizAnswers] ([QuizAttemptId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_QuizAnswers_SelectedOptionId] ON [QuizAnswers] ([SelectedOptionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_QuizAttempts_EnrollmentId] ON [QuizAttempts] ([EnrollmentId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_QuizAttempts_QuizId] ON [QuizAttempts] ([QuizId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_QuizQuestions_QuizId] ON [QuizQuestions] ([QuizId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE INDEX [IX_Quizzes_ModuleId] ON [Quizzes] ([ModuleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StudentProfiles_UserId] ON [StudentProfiles] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250905075718_IntialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250905075718_IntialCreate', N'9.0.8');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250906195530_AddAdminAndPaymentData'
)
BEGIN
    ALTER TABLE [Users] ADD [PaymentId] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250906195530_AddAdminAndPaymentData'
)
BEGIN
    CREATE TABLE [AdminProfiles] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [PhoneNumber] nvarchar(20) NOT NULL,
        [Department] nvarchar(200) NOT NULL,
        [HireDate] datetime2 NOT NULL,
        [Responsibilities] nvarchar(500) NOT NULL,
        CONSTRAINT [PK_AdminProfiles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AdminProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250906195530_AddAdminAndPaymentData'
)
BEGIN
    CREATE TABLE [Payments] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [CourseId] int NULL,
        [Amount] decimal(18,2) NOT NULL,
        [AmountPaid] decimal(18,2) NOT NULL,
        [RemainingAmount] decimal(18,2) NOT NULL,
        [Currency] nvarchar(max) NOT NULL,
        [PaymentMethod] nvarchar(50) NOT NULL,
        [TransactionId] nvarchar(100) NOT NULL,
        [PaymentStatus] nvarchar(50) NOT NULL,
        [InstallmentsCount] int NOT NULL,
        [CurrentInstallment] int NOT NULL,
        [PaymentDate] datetime2 NOT NULL,
        [NextPaymentDate] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Payments_Courses_CourseId] FOREIGN KEY ([CourseId]) REFERENCES [Courses] ([Id]),
        CONSTRAINT [FK_Payments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250906195530_AddAdminAndPaymentData'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AdminProfiles_UserId] ON [AdminProfiles] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250906195530_AddAdminAndPaymentData'
)
BEGIN
    CREATE INDEX [IX_Payments_CourseId] ON [Payments] ([CourseId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250906195530_AddAdminAndPaymentData'
)
BEGIN
    CREATE INDEX [IX_Payments_UserId] ON [Payments] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250906195530_AddAdminAndPaymentData'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250906195530_AddAdminAndPaymentData', N'9.0.8');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140048_AddDecimalPrecision'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250907140048_AddDecimalPrecision', N'9.0.8');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140801_FixDecimalPrecision'
)
BEGIN
    DECLARE @var sysname;
    SELECT @var = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[QuizAttempts]') AND [c].[name] = N'Score');
    IF @var IS NOT NULL EXEC(N'ALTER TABLE [QuizAttempts] DROP CONSTRAINT [' + @var + '];');
    ALTER TABLE [QuizAttempts] ALTER COLUMN [Score] decimal(5,2) NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140801_FixDecimalPrecision'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'RemainingAmount');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Payments] ALTER COLUMN [RemainingAmount] decimal(10,2) NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140801_FixDecimalPrecision'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'AmountPaid');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [Payments] ALTER COLUMN [AmountPaid] decimal(10,2) NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140801_FixDecimalPrecision'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'Amount');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [Payments] ALTER COLUMN [Amount] decimal(10,2) NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140801_FixDecimalPrecision'
)
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CourseEnrollments]') AND [c].[name] = N'ProgressPercentage');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [CourseEnrollments] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [CourseEnrollments] ALTER COLUMN [ProgressPercentage] decimal(5,2) NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140801_FixDecimalPrecision'
)
BEGIN
    DECLARE @var5 sysname;
    SELECT @var5 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CourseEnrollments]') AND [c].[name] = N'FinalGrade');
    IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [CourseEnrollments] DROP CONSTRAINT [' + @var5 + '];');
    ALTER TABLE [CourseEnrollments] ALTER COLUMN [FinalGrade] decimal(5,2) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907140801_FixDecimalPrecision'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250907140801_FixDecimalPrecision', N'9.0.8');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907154614_AddMissingAPIs'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250907154614_AddMissingAPIs', N'9.0.8');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907173204_AddNotifications'
)
BEGIN
    CREATE TABLE [Notifications] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Message] nvarchar(500) NOT NULL,
        [Type] nvarchar(20) NOT NULL,
        [IsRead] bit NOT NULL,
        [RelatedEntityType] nvarchar(max) NOT NULL,
        [RelatedEntityId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [ReadAt] datetime2 NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Notifications_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907173204_AddNotifications'
)
BEGIN
    CREATE INDEX [IX_Notifications_UserId] ON [Notifications] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250907173204_AddNotifications'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250907173204_AddNotifications', N'9.0.8');
END;

COMMIT;
GO

