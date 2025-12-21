import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: streak, error: streakError } = await supabaseServer
    .from("streak")
    .select("*")
    .eq("user_id", userId)
    .limit(1);

  if (streakError) {
    return NextResponse.json({ error: streakError.message }, { status: 500 });
  }

  const { data: streakDays, error: daysError } = await supabaseServer
    .from("streak_days")
    .select("date")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (daysError) {
    return NextResponse.json({ error: daysError.message }, { status: 500 });
  }

  if (!streak || streak.length === 0) {
    const { data: newStreak, error: insertError } = await supabaseServer
      .from("streak")
      .insert({
        user_id: userId,
        day_count: 0,
        last_active_date: null,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      dayCount: newStreak.day_count,
      lastActiveDate: newStreak.last_active_date,
      completedDates: [],
    });
  }

  const completedDates = streakDays?.map((day) => {
    return day.date.split("T")[0];
  }) || [];

  return NextResponse.json({
    dayCount: streak[0].day_count,
    lastActiveDate: streak[0].last_active_date,
    completedDates,
  });
}
