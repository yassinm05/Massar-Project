using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasarSkills.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNewApplicationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ResumeUrl",
                table: "JobApplications",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "LicenseCertificationNumber",
                table: "JobApplications",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NursingCompetencies",
                table: "JobApplications",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreferredShift",
                table: "JobApplications",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreviousWorkExperience",
                table: "JobApplications",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LicenseCertificationNumber",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "NursingCompetencies",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "PreferredShift",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "PreviousWorkExperience",
                table: "JobApplications");

            migrationBuilder.AlterColumn<string>(
                name: "ResumeUrl",
                table: "JobApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
