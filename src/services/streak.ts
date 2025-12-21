import type { StreakResponse } from "@/types/streak";

export const getStreak = async (): Promise<StreakResponse> => {
  const res = await fetch("/api/streak");
  if (!res.ok) {
    throw new Error("Failed to fetch streak");
  }
  return res.json();
};
