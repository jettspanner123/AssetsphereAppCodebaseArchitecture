using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using DotNetEnv;

namespace AssetsphereOrchestratorServiceLayerMSC.Utilities;

public sealed class ENValidator
{
    private static readonly ENValidator _current = new ENValidator();
    public static ENValidator Current => _current;

    private readonly bool _initialized = false;

    private ENValidator()
    {
        try
        {
            // Traverse upwards if needed to find .env
            string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string? directory = baseDirectory;
            while (!string.IsNullOrEmpty(directory))
            {
                string envFilePath = Path.Combine(directory, ".env");
                if (File.Exists(envFilePath))
                {
                    Env.Load(envFilePath);
                    _initialized = true;
                    break;
                }
                directory = Directory.GetParent(directory)?.FullName;
            }

            if (!_initialized)
            {
                Env.Load();
            }
        }
        catch
        {
            // Fallback to system environment variables
        }
    }

    public string GetValue(string keyName)
    {
        string? value = Environment.GetEnvironmentVariable(keyName);
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new EnvKeyNotFoundException(keyName);
        }
        return value;
    }

    public string GetValueOrDefault(string keyName, string defaultValue)
    {
        string? value = Environment.GetEnvironmentVariable(keyName);
        return string.IsNullOrWhiteSpace(value) ? defaultValue : value;
    }

    public int GetIntValue(string keyName, int defaultValue = 0)
    {
        string? value = Environment.GetEnvironmentVariable(keyName);
        if (string.IsNullOrWhiteSpace(value)) return defaultValue;
        return int.TryParse(value, out int result) ? result : defaultValue;
    }

    public bool GetBoolValue(string keyName, bool defaultValue = false)
    {
        string? value = Environment.GetEnvironmentVariable(keyName);
        if (string.IsNullOrWhiteSpace(value)) return defaultValue;
        return bool.TryParse(value, out bool result) ? result : defaultValue;
    }
}
