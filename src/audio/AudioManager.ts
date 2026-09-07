import { Howl } from 'howler';

class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private music: Howl | null = null;

  async loadSounds(soundMap: Record<string, string>) {
    const promises = Object.entries(soundMap).map(async ([key, url]) => {
      const sound = new Howl({
        src: [url],
        html5: true,
        preload: true,
      });
      this.sounds.set(key, sound);
    });
    await Promise.all(promises);
  }

  playSfx(key: string, options: any = {}) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.play(options);
    } else {
      console.warn(`Sound ${key} not found`);
    }
  }

  playMusic(url: string, fadeDuration = 2) {
    if (this.music) {
      this.music.fade(1, 0, fadeDuration);
      this.music.once('fade', () => this.music?.unload());
    }
    this.music = new Howl({
      src: [url],
      html5: true,
      loop: true,
      volume: 0,
    });
    this.music.play();
    this.music.fade(0, 1, fadeDuration);
  }

  stopMusic(fadeDuration = 2) {
    if (this.music) {
      this.music.fade(1, 0, fadeDuration);
    }
  }

  setGlobalVolume(volume: number) {
    Howler.volume(volume);
  }
}

export const audioManager = new AudioManager();
