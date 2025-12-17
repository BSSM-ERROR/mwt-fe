import { create } from "zustand";

interface StaminaState {
  currentStamina: number;
  maxStamina: number;
  nextRecoveryTime: Date | null;
  setStamina: (data: {
    currentStamina: number;
    maxStamina: number;
    nextRecoveryTime: Date | null;
  }) => void;
  increaseEnergy: () => void;
  decreaseEnergy: () => void;
}

const RECOVERY_INTERVAL_MS = 60 * 60 * 1000;

export const useStaminaStore = create<StaminaState>((set) => ({
  currentStamina: 0,
  maxStamina: 5,
  nextRecoveryTime: null,

  setStamina: (data) =>
    set({
      currentStamina: data.currentStamina,
      maxStamina: data.maxStamina,
      nextRecoveryTime: data.nextRecoveryTime,
    }),

  increaseEnergy: () =>
    set((state) => {
      const newStamina = Math.min(state.currentStamina + 1, state.maxStamina);
      const nextRecovery =
        newStamina >= state.maxStamina
          ? null
          : new Date(Date.now() + RECOVERY_INTERVAL_MS);
      return {
        currentStamina: newStamina,
        nextRecoveryTime: nextRecovery,
      };
    }),

  decreaseEnergy: () =>
    set((state) => {
      const newStamina = Math.max(state.currentStamina - 1, 0);
      const nextRecovery =
        state.currentStamina >= state.maxStamina
          ? new Date(Date.now() + RECOVERY_INTERVAL_MS)
          : state.nextRecoveryTime;
      return {
        currentStamina: newStamina,
        nextRecoveryTime: nextRecovery,
      };
    }),
}));
