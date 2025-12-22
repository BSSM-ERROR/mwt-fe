import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseServer } from "@/lib/supabase-server";
import { Mission } from "@/types/mission";

const PRESET_MISSIONS = [
  {
    title: "쓰담쓰담",
    description: "세리나의 머리를 쓰다듬어 주세요",
    reward: 70,
    total_count: 7,
  },
  {
    title: "오늘 완료 미션",
    description: "오늘의 미션을 완료하세요",
    reward: 100,
    total_count: 1,
  },
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const titles = PRESET_MISSIONS.map((m) => m.title);

  const { data: existing, error: fetchError } = await supabaseServer
    .from("mission")
    .select("*")
    .eq("user_id", userId)
    .in("title", titles);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const missionMap = new Map<string, Mission>();
  (existing || []).forEach((mission) => {
    missionMap.set(mission.title, mission as Mission);
  });

  for (const preset of PRESET_MISSIONS) {
    if (missionMap.has(preset.title)) continue;

    const { data: inserted, error: insertError } = await supabaseServer
      .from("mission")
      .insert({
        user_id: userId,
        title: preset.title,
        description: preset.description,
        reward: preset.reward,
        did_count: 0,
        total_count: preset.total_count,
        status: false,
      })
      .select()
      .single();

    if (insertError || !inserted) {
      return NextResponse.json(
        { error: insertError?.message ?? "Failed to create mission" },
        { status: 500 },
      );
    }

    missionMap.set(preset.title, inserted as Mission);
  }

  const missions = PRESET_MISSIONS.map((preset) => missionMap.get(preset.title)!);

  return NextResponse.json({ missions });
}
