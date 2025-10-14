namespace MasarSkills.API.Services
{
    /// <summary>
    /// Defines a contract for a service that communicates with the external AI model.
    /// </summary>
    public interface IAiQueryService
    {
        /// <summary>
        /// Sends a context and a prompt to the AI and returns the generated answer.
        /// </summary>
        /// <param name="context">The knowledge base text for the AI.</param>
        /// <param name="prompt">The user's question.</param>
        /// <returns>The AI's answer, or null if an error occurred.</returns>
        Task<string?> GetAnswerFromAiAsync(string context, string prompt);
    }
}
