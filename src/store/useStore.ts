import { create } from 'zustand';

type Phase = 'preload' | 'void' | 'choice' | 'spiderman' | 'ironman' | 'finale';
type Quality = 'cinematic' | 'standard' | 'lite';

interface ExperienceState {
  phase: Phase;
  sceneIndex: number;
  hasInteracted: boolean;
  hasChosen: boolean;
  choice: 'spiderman' | 'ironman' | null;
  quality: Quality;
  audioUnlocked: boolean;
  error: string | null;

  setPhase: (phase: Phase) => void;
  setSceneIndex: (index: number) => void;
  setInteracted: (interacted: boolean) => void;
  setChoice: (choice: 'spiderman' | 'ironman') => void;
  setQuality: (quality: Quality) => void;
  setAudioUnlocked: (unlocked: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useStore = create<ExperienceState>((set) => ({
  phase: 'preload',
  sceneIndex: 0,
  hasInteracted: false,
  hasChosen: false,
  choice: null,
  quality: 'cinematic',
  audioUnlocked: false,
  error: null,

  setPhase: (phase) => set({ phase }),
  setSceneIndex: (sceneIndex) => set({ sceneIndex }),
  setInteracted: (hasInteracted) => set({ hasInteracted }),
  setChoice: (choice) => set({ hasChosen: true, choice }),
  setQuality: (quality) => set({ quality }),
  setAudioUnlocked: (audioUnlocked) => set({ audioUnlocked }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
