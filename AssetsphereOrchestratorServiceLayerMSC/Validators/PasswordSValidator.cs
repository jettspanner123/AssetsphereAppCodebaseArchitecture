namespace AssetsphereOrchestratorServiceLayerMSC.Validators;

public sealed class PasswordSValidator
{
    private static readonly PasswordSValidator _current = new PasswordSValidator();
    public static PasswordSValidator Current => _current;

    private PasswordSValidator()
    {
    }

    public bool Validate(string? password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            return false;
        }

        // Minimum 8 characters
        return password.Length >= 8;
    }
}
