using System.Text.RegularExpressions;

namespace AssetsphereOrchestratorServiceLayerMSC.Validators;

public sealed partial class AssetTagSValidator
{
    private static readonly AssetTagSValidator _current = new AssetTagSValidator();
    public static AssetTagSValidator Current => _current;

    private AssetTagSValidator()
    {
    }

    [GeneratedRegex(@"^[A-Z0-9_\-]+$", RegexOptions.IgnoreCase)]
    private static partial Regex TagRegex();

    public bool Validate(string? assetTag)
    {
        if (string.IsNullOrWhiteSpace(assetTag))
        {
            return false;
        }

        return assetTag.Length >= 3 && assetTag.Length <= 50 && TagRegex().IsMatch(assetTag);
    }
}
