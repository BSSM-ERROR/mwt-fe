'use server';

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { upsertProfile } from "@/lib/profile";
import { ProfileActionResult } from "@/types/profile";
import { profileFormSchema, ProfileFormValues } from "@/validation/profile";

export async function updateProfileAction(
  values: ProfileFormValues,
): Promise<ProfileActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const parsed = profileFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
    };
  }

  try {
    const profile = await upsertProfile(session.user.id, parsed.data);
    revalidatePath("/profile");
    return { ok: true, profile };
  } catch (error) {
    return { ok: false, error: "프로필을 업데이트하지 못했어요." };
  }
}
