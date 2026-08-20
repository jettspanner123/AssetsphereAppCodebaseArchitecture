namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class ApiResponseClass<T>
{
    public T? Data { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<string>? Errors { get; set; }
    public int StatusCode { get; set; }

    public static ApiResponseClass<T> Succeeded(T data, string message = "Operation completed successfully.", int statusCode = 200)
    {
        return new ApiResponseClass<T>
        {
            Data = data,
            Success = true,
            Message = message,
            Errors = null,
            StatusCode = statusCode
        };
    }

    public static ApiResponseClass<T> Failed(string message, List<string>? errors = null, int statusCode = 400)
    {
        return new ApiResponseClass<T>
        {
            Data = default,
            Success = false,
            Message = message,
            Errors = errors ?? new List<string> { message },
            StatusCode = statusCode
        };
    }
}
