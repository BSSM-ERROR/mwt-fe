export interface StaminaResponse {
  energy: number;
  maxEnergy: number;
  lastUpdatedAt: string;
}

export const getStamina = async (): Promise<StaminaResponse> => {
  const res = await fetch("/api/stamina");
  if (!res.ok) {
    throw new Error("Failed to fetch stamina");
  }
  return res.json();
};
