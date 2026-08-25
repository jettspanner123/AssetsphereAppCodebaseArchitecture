import notificationSoundAudioSrc from '../assets/Sounds/NotificationSound.mp3';

export default class ApplicationSoundService {
  public static current: ApplicationSoundService = new ApplicationSoundService();

  private notificationAudio: HTMLAudioElement | null = null;
  private volume: number = 0.75;
  private muted: boolean = false;

  constructor() {
    this.initializeAudio();
  }

  /**
   * Lazily / pre-buffers the notification sound element in the browser
   */
  private initializeAudio(): void {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      try {
        this.notificationAudio = new Audio(notificationSoundAudioSrc);
        this.notificationAudio.volume = this.volume;
        this.notificationAudio.preload = 'auto';
      } catch (error) {
        console.warn('[ApplicationSoundService] Failed to initialize notification audio element:', error);
      }
    }
  }

  /**
   * Play the incoming notification sound effect
   */
  public async playNotificationSound(): Promise<void> {
    if (this.muted) return;

    if (!this.notificationAudio && typeof window !== 'undefined') {
      this.initializeAudio();
    }

    if (!this.notificationAudio) return;

    try {
      this.notificationAudio.volume = this.volume;
      this.notificationAudio.currentTime = 0;
      await this.notificationAudio.play();
    } catch (error: any) {
      // Browser Autoplay Policy warning or user hasn't interacted yet
      if (error?.name !== 'NotAllowedError') {
        console.warn('[ApplicationSoundService] Audio playback warning:', error);
      }
    }
  }

  /**
   * Set playback volume level (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.notificationAudio) {
      this.notificationAudio.volume = this.volume;
    }
  }

  /**
   * Get current volume level
   */
  public getVolume(): number {
    return this.volume;
  }

  /**
   * Set audio mute status
   */
  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  /**
   * Check if sound is currently muted
   */
  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }
}