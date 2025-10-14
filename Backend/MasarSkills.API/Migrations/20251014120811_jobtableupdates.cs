using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasarSkills.API.Migrations
{
    /// <inheritdoc />
    public partial class jobtableupdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AddColumn<string>(
            //     name: "Qualifications",
            //     table: "Jobs",
            //     type: "nvarchar(200)",
            //     maxLength: 200,
            //     nullable: false,
            //     defaultValue: "");

            // migrationBuilder.AddColumn<string>(
            //     name: "Responsibilities",
            //     table: "Jobs",
            //     type: "nvarchar(200)",
            //     maxLength: 200,
            //     nullable: false,
            //     defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropColumn(
            //     name: "Qualifications",
            //     table: "Jobs");

            // migrationBuilder.DropColumn(
            //     name: "Responsibilities",
            //     table: "Jobs");
        }
    }
}
