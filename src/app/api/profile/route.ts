import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchProfile, upsertProfile } from "@/lib/profile";
import { profileFormSchema } from "@/validation/profile";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await fetchProfile(session.user.id);

    if (profile) {
      return NextResponse.json(profile);
    }

    // 사용자 row가 없으면 세션 정보로 기본 row를 생성한 뒤 반환
    const baseName =
      session.user.name ||
      (session.user.email ? session.user.email.split("@")[0] : "사용자");

    const { data: newUser, error: insertUserError } = await supabaseServer
      .from("user")
      .upsert(
        {
          id: session.user.id,
          email: session.user.email,
          name: baseName,
          profile_image: session.user.image || "",
        },
        { onConflict: "id" },
      )
      .select("id, email, name, profile_image")
      .single();

    if (insertUserError || !newUser) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    await supabaseServer.from("user_profile").upsert({
      user_id: session.user.id,
      bio: null,
      learning_goal: null,
      level: null,
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatarUrl: newUser.profile_image,
      bio: null,
      learningGoal: null,
      level: null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = profileFormSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." },
      { status: 400 },
    );
  }

  try {
    const profile = await upsertProfile(session.user.id, parsed.data);
    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Profile update failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "프로필을 업데이트하지 못했어요.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
