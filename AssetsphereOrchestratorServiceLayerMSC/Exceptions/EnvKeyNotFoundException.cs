namespace AssetsphereOrchestratorServiceLayerMSC.Exceptions;

public sealed class EnvKeyNotFoundException : Exception
{
    public string KeyName { get; }

    public EnvKeyNotFoundException(string keyName) 
        : base($"Required environment variable '{keyName}' was not found in the environment configuration.")
    {
        KeyName = keyName;
    }

    public EnvKeyNotFoundException(string keyName, string message) 
        : base(message)
    {
        KeyName = keyName;
    }
}
