namespace AssetsphereOrchestratorServiceLayerMSC.Utilities;

public static class OrdinalNumberUtility
{
    private static readonly string[] UnitsOrdinal = {
        "", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth",
        "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth",
        "Seventeenth", "Eighteenth", "Nineteenth"
    };

    private static readonly string[] UnitsCardinal = {
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    };

    private static readonly string[] TensOrdinal = {
        "", "", "Twentieth", "Thirtieth", "Fortieth", "Fiftieth", "Sixtieth", "Seventieth", "Eightieth", "Ninetieth"
    };

    private static readonly string[] TensCardinal = {
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    /// <summary>
    /// Converts a positive integer into its full English spelled-out ordinal string (e.g. 1 -> "First", 21 -> "Twenty-First").
    /// </summary>
    public static string ToOrdinalWords(int number)
    {
        if (number <= 0) return "First";
        if (number < 20) return UnitsOrdinal[number];
        if (number < 100)
        {
            int tens = number / 10;
            int rem = number % 10;
            if (rem == 0) return TensOrdinal[tens];
            return $"{TensCardinal[tens]}-{UnitsOrdinal[rem]}";
        }
        if (number < 1000)
        {
            int hundreds = number / 100;
            int rem = number % 100;
            string prefix = $"{UnitsCardinal[hundreds]} Hundred";
            if (rem == 0) return $"{prefix}th";
            return $"{prefix} and {ToOrdinalWords(rem)}";
        }
        return $"{number}th";
    }

    /// <summary>
    /// Generates the standard system-generated DisplayName for an asset based on assignment state and ordinal counts.
    /// Unassigned: "UA-1", "UA-2", etc.
    /// Assigned: "First Assigned Asset", "Second Assigned Asset", "Twenty-First Assigned Asset", etc.
    /// </summary>
    public static string GenerateAssetDisplayName(bool isAssigned, int assignedCount, int unassignedCount)
    {
        if (!isAssigned)
        {
            return $"UA-{Math.Max(1, unassignedCount)}";
        }
        string ordinal = ToOrdinalWords(Math.Max(1, assignedCount));
        return $"{ordinal} Assigned Asset";
    }
}
