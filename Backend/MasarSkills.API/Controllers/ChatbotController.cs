using MasarSkills.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class ChatbotController : ControllerBase
{
    [HttpPost("chatbot-response")]
    public IActionResult ReceiveChatbotResponse([FromBody] ChatbotResponseDto responseDto)
    {
        // Log the received message to the console.

        Console.WriteLine($"Received chatbot response: {responseDto.Message}");

        // Return a successful response.
        return Ok(new { message = "Chatbot response received successfully." });
    }
}
// Place in MasarSkills.API/Controllers