export const completePettingMission = async () => {
  const res = await fetch("/api/mission/petting", { method: "POST" });
  if (!res.ok) {
    throw new Error("Failed to complete petting mission");
  }
  return res.json();
};
