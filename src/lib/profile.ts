import { supabaseServer } from "@/lib/supabase-server";
import { ProfileData } from "@/types/profile";
import { ProfileFormValues } from "@/validation/profile";

type SupabaseProfileRow = {
  id: string;
  email: string;
  name: string | null;
  profile_image: string | null;
};

export async function fetchProfile(userId: string): Promise<ProfileData | null> {
  const { data, error } = await supabaseServer
    .from("user")
    .select("id, email, name, profile_image")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  const row = data as SupabaseProfileRow;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.profile_image,
    bio: null,
    learningGoal: null,
    level: null,
  };
}

export async function upsertProfile(
  userId: string,
  payload: ProfileFormValues,
): Promise<ProfileData> {
  const { name, email } = payload;

  const { data: userRows, error: userError } = await supabaseServer
    .from("user")
    .upsert(
      {
        id: userId,
        name,
        email,
      },
      { onConflict: "id" },
    )
    .select("id, email, name, profile_image");

  const updatedUser = Array.isArray(userRows) ? userRows[0] : userRows;

  if (userError || !updatedUser) {
    console.error("Supabase user upsert error", userError);
    throw new Error(userError?.message || "Failed to update user");
  }

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    avatarUrl: updatedUser.profile_image,
    bio: null,
    learningGoal: null,
    level: null,
  };
}
