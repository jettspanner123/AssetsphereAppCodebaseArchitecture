namespace AssetsphereOrchestratorServiceLayerMSC.Helpers;

public sealed class PasswordHashHelper
{
    private static readonly PasswordHashHelper _current = new PasswordHashHelper();
    public static PasswordHashHelper Current => _current;

    private PasswordHashHelper()
    {
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(passwordHash))
        {
            return false;
        }

        try
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
        catch
        {
            return false;
        }
    }
}
