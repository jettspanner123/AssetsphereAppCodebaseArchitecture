import ApplicationThemeCON from '../Constants/ApplicationThemeCON';

export default class ApplicationThemeUtility {
  public static current: ApplicationThemeUtility = new ApplicationThemeUtility();

  private themeKey: string = 'assetsphere_theme_preference';

  public getSavedTheme(): string {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.themeKey);
      if (saved === ApplicationThemeCON.DARK || saved === ApplicationThemeCON.LIGHT) {
        return saved;
      }
    }
    return ApplicationThemeCON.DARK; // Default to Dark Mode
  }

  public applyTheme(theme: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.themeKey, theme);
    if (theme === ApplicationThemeCON.DARK) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }

  public toggleTheme(currentTheme: string): string {
    const nextTheme =
      currentTheme === ApplicationThemeCON.LIGHT
        ? ApplicationThemeCON.DARK
        : ApplicationThemeCON.LIGHT;
    this.applyTheme(nextTheme);
    return nextTheme;
  }
}
