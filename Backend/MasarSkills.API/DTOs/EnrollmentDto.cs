namespace MasarSkills.API.DTOs
{
    public class EnrollmentDto
    {
        public int CourseId { get; set; }
    }

    public class EnrollmentResponseDto
    {
        public int EnrollmentId { get; set; }
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }
        public string InstructorName { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public decimal ProgressPercentage { get; set; }
        public string Status { get; set; }
        public decimal? FinalGrade { get; set; }
    }

    public class UpdateProgressDto
    {
        public decimal ProgressPercentage { get; set; }
    }
}