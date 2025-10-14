using System.Text;
using MasarSkills.API.DTOs;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace MasarSkills.API.Services
{
    /// <summary>
    /// The implementation for extracting text from learning materials.
    /// </summary>
    public class LearningMaterialQAService : ILearningMaterialQAService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILogger<LearningMaterialQAService> _logger;

        // We inject the HttpClientFactory to safely create HttpClients,
        // the WebHostEnvironment to find our content files, and a Logger for diagnostics.
        public LearningMaterialQAService(IHttpClientFactory httpClientFactory, IWebHostEnvironment hostingEnvironment, ILogger<LearningMaterialQAService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }

        public async Task<string?> GetContextFromMaterialAsync(int materialId)
        {
            // Step 1: Call the existing API to get material metadata
            var httpClient = _httpClientFactory.CreateClient("MasarSkillsAPI");
            LearningMaterialResponseDto? material;

            try
            {
                material = await httpClient.GetFromJsonAsync<LearningMaterialResponseDto>($"api/LearningMaterials/{materialId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch material metadata for ID {MaterialId}", materialId);
                return null;
            }

            if (material == null || string.IsNullOrWhiteSpace(material.ContentUrl))
            {
                _logger.LogWarning("Learning material with ID {MaterialId} not found or has no content URL.", materialId);
                return null; // Material not found or has no URL
            }

            // Step 2: Determine the full file path
            // The ContentRootPath gives us the base directory of the application.
            // We combine it with the relative URL of the content.
            var relativeUrl = material.ContentUrl.TrimStart('/');
            var systemRelativePath = relativeUrl.Replace('/', Path.DirectorySeparatorChar);
            var contentFilePath = Path.Combine(_hostingEnvironment.WebRootPath, systemRelativePath);
            if (!File.Exists(contentFilePath))
            {
                _logger.LogError("File not found at path: {FilePath}", contentFilePath);
                return null; // File does not exist on the server
            }

            // Step 3: Extract text based on the file type
            _logger.LogInformation("Extracting text for material {MaterialId} of type {Type} from {FilePath}", materialId, material.Type, contentFilePath);
            
            return material.Type.ToUpper() switch
            {
                "PDF" => ExtractTextFromPdf(contentFilePath),
                // "VIDEO" => await ExtractTextFromVideoAsync(contentFilePath), // Future implementation
                _ => null // Unsupported type
            };
        }

        private string? ExtractTextFromPdf(string filePath)
        {
            try
            {
                using (var pdf = PdfDocument.Open(filePath))
                {
                    var textBuilder = new StringBuilder();
                    foreach (Page page in pdf.GetPages())
                    {
                        textBuilder.Append(page.Text);
                        textBuilder.Append("\n\n"); // Add space between pages for clarity
                    }
                    return textBuilder.ToString();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to extract text from PDF file at {FilePath}", filePath);
                return null;
            }
        }
    }
}
