using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasarSkills.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDifficulityforCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
 
            migrationBuilder.AddColumn<string>(
            name: "Difficulty",
            table: "Courses",
            type: "nvarchar(50)",
            nullable: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
          
        }
    }
}
