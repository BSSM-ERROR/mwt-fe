import { ProfileData } from "@/types/profile";
import { ProfileFormValues } from "@/validation/profile";

export const getProfile = async (): Promise<ProfileData> => {
  const res = await fetch("/api/profile", { method: "GET" });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error || "프로필을 불러오지 못했어요.";
    throw new Error(message);
  }

  return res.json();
};

export const updateProfileViaApi = async (
  payload: ProfileFormValues,
): Promise<ProfileData> => {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error || "프로필 업데이트에 실패했습니다.";
    throw new Error(message);
  }

  return res.json();
};
