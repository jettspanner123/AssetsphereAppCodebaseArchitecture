using System.Text.RegularExpressions;

namespace AssetsphereOrchestratorServiceLayerMSC.Validators;

public sealed partial class EmailSValidator
{
    private static readonly EmailSValidator _current = new EmailSValidator();
    public static EmailSValidator Current => _current;

    private EmailSValidator()
    {
    }

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();

    public bool Validate(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return false;
        }

        return EmailRegex().IsMatch(email);
    }
}
