import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseServer } from "@/lib/supabase-server";

const MISSION_CONFIG = {
  title: "쓰담쓰담",
  description: "세리나의 머리를 쓰다듬어 주세요",
  reward: 70,
  total_count: 7,
};

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: missions, error: fetchError } = await supabaseServer
    .from("mission")
    .select("*")
    .eq("user_id", userId)
    .eq("title", MISSION_CONFIG.title)
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const existingMission = missions?.[0] ?? null;

  if (!existingMission) {
    const { data: newMission, error: insertError } = await supabaseServer
      .from("mission")
      .insert({
        user_id: userId,
        title: MISSION_CONFIG.title,
        description: MISSION_CONFIG.description,
        reward: MISSION_CONFIG.reward,
        did_count: 1,
        total_count: MISSION_CONFIG.total_count,
        status: false,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ mission: newMission });
  }

  if (existingMission.status) {
    return NextResponse.json({ mission: existingMission });
  }

  const newDidCount = existingMission.did_count + 1;
  const isCompleted = newDidCount >= MISSION_CONFIG.total_count;

  const { data: updatedMission, error: updateError } = await supabaseServer
    .from("mission")
    .update({
      did_count: newDidCount,
      status: isCompleted,
    })
    .eq("id", existingMission.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ mission: updatedMission });
}
