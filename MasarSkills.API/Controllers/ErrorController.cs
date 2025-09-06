using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace MasarSkills.API.Controllers
{
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ControllerBase
    {
        [Route("/error")]
        public IActionResult HandleError()
        {
            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = exceptionHandlerFeature?.Error;

            var statusCode = exception switch
            {
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                _ => StatusCodes.Status500InternalServerError
            };

            return Problem(
                detail: exception?.Message,
                statusCode: statusCode,
                title: exception?.GetType().Name
            );
        }

        [Route("/error/{statusCode}")]
        public IActionResult HandleError(int statusCode)
        {
            var message = statusCode switch
            {
                404 => "الملف المطلوب غير موجود",
                401 => "غير مصرح بالدخول",
                500 => "خطأ داخلي في السيرفر",
                _ => "حدث خطأ ما"
            };

            return Problem(
                detail: message,
                statusCode: statusCode
            );
        }
    }
}