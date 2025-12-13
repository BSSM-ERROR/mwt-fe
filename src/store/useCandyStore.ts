import { create } from "zustand";

interface CandyState {
  count: number;
  increase: (amount: number) => void;
  decrease: (amount: number) => void;
}

export const useCandyStore = create<CandyState>((set) => ({
  count: 0,
  increase: (amount) =>
    set((state) => ({
      count: state.count + amount,
    })),
  decrease: (amount) =>
    set((state) => ({
      count: state.count - amount,
    })),
}));
