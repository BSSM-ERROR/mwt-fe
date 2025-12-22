import { Mission } from "@/types/mission";

export const completePettingMission = async () => {
  const res = await fetch("/api/mission/petting", { method: "POST" });
  if (!res.ok) {
    throw new Error("Failed to complete petting mission");
  }
  return res.json();
};

export const getMissions = async (): Promise<Mission[]> => {
  const res = await fetch("/api/mission");

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error || "Failed to load missions";
    throw new Error(message);
  }

  const body = await res.json();
  return body.missions as Mission[];
};
