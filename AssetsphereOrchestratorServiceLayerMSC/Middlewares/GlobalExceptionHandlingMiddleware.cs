using System.Net;
using System.Text.Json;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

namespace AssetsphereOrchestratorServiceLayerMSC.Middlewares;

public sealed class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception caught in pipeline: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        int statusCode = (int)HttpStatusCode.InternalServerError;
        string message = "An internal server error occurred.";
        List<string>? errors = null;

        switch (exception)
        {
            case EnvKeyNotFoundException envEx:
                statusCode = (int)HttpStatusCode.InternalServerError;
                message = envEx.Message;
                errors = new List<string> { envEx.Message };
                break;

            case EntityNotFoundCException notFoundEx:
                statusCode = (int)HttpStatusCode.NotFound;
                message = notFoundEx.Message;
                errors = new List<string> { notFoundEx.Message };
                break;

            case ValidationCException valEx:
                statusCode = (int)HttpStatusCode.BadRequest;
                message = valEx.Message;
                errors = valEx.ValidationErrors;
                break;

            case UnauthorizedAccessException authEx:
                statusCode = (int)HttpStatusCode.Unauthorized;
                message = authEx.Message;
                errors = new List<string> { authEx.Message };
                break;

            default:
                message = exception.Message;
                errors = new List<string> { exception.Message };
                break;
        }

        context.Response.StatusCode = statusCode;

        ApiResponseClass<object> response = ApiResponseClass<object>.Failed(message, errors, statusCode);
        string json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        });

        await context.Response.WriteAsync(json);
    }
}
