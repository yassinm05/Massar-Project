using MasarSkills.API.DTOs;

namespace MasarSkills.API.Services
{
    /// <summary>
    /// Implementation for communicating with the Python Flask AI service.
    /// </summary>
    public class AiQueryService : IAiQueryService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<AiQueryService> _logger;

        public AiQueryService(IHttpClientFactory httpClientFactory, ILogger<AiQueryService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<string?> GetAnswerFromAiAsync(string context, string prompt)
        {
            var httpClient = _httpClientFactory.CreateClient("FlaskAI");
            
            var requestPayload = new FlaskRequestDto
            {
                Context = context,
                Prompt = prompt
            };

            try
            {
                // Send the context and prompt to the /generate endpoint
                var httpResponse = await httpClient.PostAsJsonAsync("generate", requestPayload);

                if (!httpResponse.IsSuccessStatusCode)
                {
                    _logger.LogError("AI service returned an error. Status code: {StatusCode}", httpResponse.StatusCode);
                    return null;
                }

                var flaskResponse = await httpResponse.Content.ReadFromJsonAsync<FlaskResponseDto>();
                return flaskResponse?.Answer;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An exception occurred while communicating with the AI service.");
                return null;
            }
        }
    }
}
