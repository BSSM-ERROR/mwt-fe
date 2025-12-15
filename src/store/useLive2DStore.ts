import { create } from 'zustand';

export interface LipSyncFrame {
    phoneme: string;    // Live2D viseme (A,E,I,O,U,M,F,S,T,R,W,K)
    startTime: number;  // 초 단위
    endTime: number;    // 초 단위
    duration: number;   // 초 단위
}

interface Live2DState {
    isVisible: boolean;
    speaking: boolean;
    lipSyncData: LipSyncFrame[] | null;
    startTime: number | null;
    setIsVisible: (visible: boolean) => void;
    setSpeaking: (speaking: boolean) => void;
    setLipSyncData: (data: LipSyncFrame[] | null) => void;
    setStartTime: (time: number | null) => void;
    stopSpeaking: () => void;
}

export const useLive2DStore = create<Live2DState>((set) => ({
    isVisible: true,
    speaking: false,
    lipSyncData: null,
    startTime: null,
    setIsVisible: (visible) => set({ isVisible: visible }),
    setSpeaking: (speaking) => set({ speaking }),
    setLipSyncData: (data) => set({ lipSyncData: data }),
    setStartTime: (time) => set({ startTime: time }),
    stopSpeaking: () => set({ speaking: false, lipSyncData: null, startTime: null }),
}));