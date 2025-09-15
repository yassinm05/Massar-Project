using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasarSkills.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEnrollmentAndScoreToQuizAttempt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizQuestions_Topics_TopicsId",
                table: "QuizQuestions");

            migrationBuilder.DropIndex(
                name: "IX_QuizQuestions_TopicsId",
                table: "QuizQuestions");

            migrationBuilder.DropColumn(
                name: "TopicsId",
                table: "QuizQuestions");

            migrationBuilder.AddColumn<DateTime>(
                name: "AttemptDate",
                table: "QuizAttempts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "StudentId",
                table: "QuizAttempts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_TopicId",
                table: "QuizQuestions",
                column: "TopicId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizQuestions_Topics_TopicId",
                table: "QuizQuestions",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizQuestions_Topics_TopicId",
                table: "QuizQuestions");

            migrationBuilder.DropIndex(
                name: "IX_QuizQuestions_TopicId",
                table: "QuizQuestions");

            migrationBuilder.DropColumn(
                name: "AttemptDate",
                table: "QuizAttempts");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "QuizAttempts");

            migrationBuilder.AddColumn<int>(
                name: "TopicsId",
                table: "QuizQuestions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_TopicsId",
                table: "QuizQuestions",
                column: "TopicsId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizQuestions_Topics_TopicsId",
                table: "QuizQuestions",
                column: "TopicsId",
                principalTable: "Topics",
                principalColumn: "Id");
        }
    }
}
