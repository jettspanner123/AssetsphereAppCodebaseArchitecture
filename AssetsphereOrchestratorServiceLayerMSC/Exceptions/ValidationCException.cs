namespace AssetsphereOrchestratorServiceLayerMSC.Exceptions;

public sealed class ValidationCException : Exception
{
    public List<string> ValidationErrors { get; }

    public ValidationCException(string message) : base(message)
    {
        ValidationErrors = new List<string> { message };
    }

    public ValidationCException(List<string> validationErrors) 
        : base("One or more validation failures occurred.")
    {
        ValidationErrors = validationErrors;
    }
}
