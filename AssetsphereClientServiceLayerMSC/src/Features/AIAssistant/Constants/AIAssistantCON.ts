export default class AIAssistantCON {
  public static readonly TITLE: string = 'Enterprise AI Copilot';
  public static readonly SUBTITLE: string =
    'Context-aware intelligence powered by Gemini 3.6 Flash for ITAM decision support';

  public static readonly PRESET_QUERIES: string[] = [
    'Which laptops have battery health under 85%?',
    'Show non-compliant security devices requiring patch remediation.',
    'Recommend hardware replacement candidates based on age & TCO.',
    'List unreturned assets for departing employees.',
  ];
}
