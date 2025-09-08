using MasarSkills.API.DTOs;
using MasarSkills.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.Register(registerDto);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.Login(loginDto);

            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(result);
        }
        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenDto validateTokenDto)
        {
            var result = await _authService.ValidateToken(validateTokenDto.Token);

            if (!result.Success)
            {
                return Unauthorized(new { message = result.Message });
            }

            return Ok(result);
        }
    }
    public class ValidateTokenDto
    {
        public string Token { get; set; }
    }
}
