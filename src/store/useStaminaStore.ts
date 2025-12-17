import { create } from "zustand";

// export const useLive2DStore = create<Live2DState>((set) => ({
//     isVisible: true,
//     setIsVisible: (visible) => set({ isVisible: visible }),
// }));

interface StaminaState {
  currentStamina: number;
  maxStamina: number;
  nextRecoveryTime: Date;
  increase: (amount: number) => void;
  decrease: () => void;
}

export const useStaminaStore = create<StaminaState>((set) => ({
  currentStamina: 3,
  maxStamina: 5,
  nextRecoveryTime: new Date(),
  increase: (amount) =>
    set((state) => ({ currentStamina: state.currentStamina + amount })),
  decrease: () =>
    set((state) => ({ currentStamina: state.currentStamina - 1 })),
}));
