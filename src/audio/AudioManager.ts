import { Howl } from 'howler';
import { useEffect, useRef } from 'react';

class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private music: Howl | null = null;
  private audioContext: AudioContext | null = null;
  private generatedSounds: Map<string, AudioBuffer> = new Map();

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

  // Initialize Web Audio API for generating sounds programmatically
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Generate a sound programmatically using Web Audio API
  private async generateSound(name: string): Promise<void> {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    const ctx = this.audioContext!;
    const sampleRate = ctx.sampleRate;
    const duration = 0.3; // 300ms sounds
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    switch (name) {
      case 'commit':
        // Impact/commit sound - low frequency thump with decay
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 15); // Quick decay
          data[i] = Math.sin(2 * Math.PI * 80 * t) * envelope * 0.5 +
                    Math.sin(2 * Math.PI * 160 * t) * envelope * 0.3;
        }
        break;
      case 'click':
        // Short click/pop sound
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 30);
          data[i] = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.3;
        }
        break;
      case 'success':
        // Rising tone for success
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.min(1, t * 20) * Math.exp(-t * 8);
          data[i] = Math.sin(2 * Math.PI * (400 + t * 600) * t) * envelope * 0.4;
        }
        break;
      default:
        // Generic beep
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 20);
          data[i] = Math.sin(2 * Math.PI * 500 * t) * envelope * 0.3;
        }
    }

    this.generatedSounds.set(name, buffer);
  }

  playSfx(key: string, options: any = {}) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.play(options);
      return;
    }

    // Fall back to generated sound
    const buffer = this.generatedSounds.get(key);
    if (buffer && this.audioContext) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = options.volume || 0.5;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0, options.delay || 0);
    } else {
      // Generate and play if not already generated
      this.generateSound(key).then(() => {
        const newBuffer = this.generatedSounds.get(key);
        if (newBuffer && this.audioContext) {
          const source = this.audioContext.createBufferSource();
          source.buffer = newBuffer;
          const gainNode = this.audioContext.createGain();
          gainNode.gain.value = options.volume || 0.5;
          source.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          source.start(0, options.delay || 0);
        }
      });
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

// Hook to initialize audio on user interaction (browser autoplay policy)
export const useAudioInit = () => {
  const initRef = useRef(false);
  
  useEffect(() => {
    const handleInteraction = () => {
      if (!initRef.current) {
        initRef.current = true;
        audioManager.initAudioContext();
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);
};
