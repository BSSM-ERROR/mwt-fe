import { create } from 'zustand';

interface Live2DState {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

export const useLive2DStore = create<Live2DState>((set) => ({
    isVisible: true,
    setIsVisible: (visible) => set({ isVisible: visible }),
}));