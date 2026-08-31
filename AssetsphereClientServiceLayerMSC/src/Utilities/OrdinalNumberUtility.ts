/**
 * OrdinalNumberUtility
 *
 * Converts integers into spelled-out English ordinal words (e.g. 1 -> "First", 2 -> "Second", 21 -> "Twenty-First")
 * and generates system-generated DisplayName properties for enterprise assets.
 */
export class OrdinalNumberUtility {
  public static current: OrdinalNumberUtility = new OrdinalNumberUtility();

  private static readonly UnitsOrdinal = [
    '',
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
    'Tenth',
    'Eleventh',
    'Twelfth',
    'Thirteenth',
    'Fourteenth',
    'Fifteenth',
    'Sixteenth',
    'Seventeenth',
    'Eighteenth',
    'Nineteenth',
  ];

  private static readonly UnitsCardinal = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  private static readonly TensOrdinal = [
    '',
    '',
    'Twentieth',
    'Thirtieth',
    'Fortieth',
    'Fiftieth',
    'Sixtieth',
    'Seventieth',
    'Eightieth',
    'Ninetieth',
  ];

  private static readonly TensCardinal = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  /**
   * Converts a positive integer into spelled-out ordinal words.
   * e.g., 1 -> "First", 2 -> "Second", 21 -> "Twenty-First", 100 -> "One Hundredth"
   */
  public toOrdinalWords(number: number): string {
    if (number <= 0) return 'First';
    if (number < 20) return OrdinalNumberUtility.UnitsOrdinal[number];
    if (number < 100) {
      const tens = Math.floor(number / 10);
      const rem = number % 10;
      if (rem === 0) return OrdinalNumberUtility.TensOrdinal[tens];
      return `${OrdinalNumberUtility.TensCardinal[tens]}-${OrdinalNumberUtility.UnitsOrdinal[rem]}`;
    }
    if (number < 1000) {
      const hundreds = Math.floor(number / 100);
      const rem = number % 100;
      const prefix = `${OrdinalNumberUtility.UnitsCardinal[hundreds]} Hundred`;
      if (rem === 0) return `${prefix}th`;
      return `${prefix} and ${this.toOrdinalWords(rem)}`;
    }
    return `${number}th`;
  }

  /**
   * Generates the DisplayName string based on asset assignment state and sequence numbers.
   * Unassigned: "UA-1", "UA-2", etc.
   * Assigned: "First Assigned Asset", "Second Assigned Asset", etc.
   */
  public generateAssetDisplayName(
    isAssigned: boolean,
    assignedCount: number,
    unassignedCount: number
  ): string {
    if (!isAssigned) {
      return `UA-${Math.max(1, unassignedCount)}`;
    }
    const ordinal = this.toOrdinalWords(Math.max(1, assignedCount));
    return `${ordinal} Assigned Asset`;
  }
}

export default OrdinalNumberUtility;
