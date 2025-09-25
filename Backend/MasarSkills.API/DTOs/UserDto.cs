using System.Text.Json.Serialization;

namespace MasarSkills.API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }    
        public string LastName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object Profile { get; set; }
    }

    public class StudentProfileDto
    {
        public string PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Address { get; set; }
        public string EducationLevel { get; set; }
        public string CareerGoals { get; set; }
        public string Skills { get; set; }
    }

    public class InstructorProfileDto
    {
        public string PhoneNumber { get; set; }
        public string Specialization { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int?  YearsOfExperience { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Bio { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Qualifications { get; set; }
    }

    public class AdminProfileDto
    {
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public DateTime HireDate { get; set; }
        public string Responsibilities { get; set; }
    }
}
