import type { StreakResponse } from "@/types/streak";

export const getStreak = async (): Promise<StreakResponse> => {
  const res = await fetch("/api/streak");
  if (!res.ok) {
    throw new Error("Failed to fetch streak");
  }
  return res.json();
};

export const checkInStreak = async (): Promise<StreakResponse & { success: boolean }> => {
  const res = await fetch("/api/streak", { method: "POST" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to check in");
  }
  return res.json();
};