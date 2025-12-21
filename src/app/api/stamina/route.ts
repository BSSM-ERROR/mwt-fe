import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseServer } from "@/lib/supabase-server";

const RECOVERY_INTERVAL_MS = 60 * 60 * 1000;

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: stamina, error: fetchError } = await supabaseServer
    .from("stamina")
    .select("*")
    .eq("user_id", userId)
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!stamina || stamina.length === 0) {
    const { data: newStamina, error: insertError } = await supabaseServer
      .from("stamina")
      .insert({
        user_id: userId,
        energy: 5,
        max_energy: 5,
        last_updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      energy: newStamina.energy,
      maxEnergy: newStamina.max_energy,
      lastUpdatedAt: newStamina.last_updated_at,
    });
  }

  const currentStamina = stamina[0];
  const now = new Date();
  const lastUpdatedStr = currentStamina.last_updated_at.endsWith("Z")
    ? currentStamina.last_updated_at
    : currentStamina.last_updated_at + "Z";
  const lastUpdated = new Date(lastUpdatedStr);
  const timeDiff = now.getTime() - lastUpdated.getTime();

  const recoveryCount = Math.floor(timeDiff / RECOVERY_INTERVAL_MS);
  let newEnergy = currentStamina.energy;
  let newLastUpdated = lastUpdated;

  if (recoveryCount > 0 && currentStamina.energy < currentStamina.max_energy) {
    newEnergy = Math.min(
      currentStamina.energy + recoveryCount,
      currentStamina.max_energy
    );

    const actualRecovery = newEnergy - currentStamina.energy;
    newLastUpdated = new Date(
      lastUpdated.getTime() + actualRecovery * RECOVERY_INTERVAL_MS
    );

    if (newEnergy >= currentStamina.max_energy) {
      newLastUpdated = now;
    }

    const { error: updateError } = await supabaseServer
      .from("stamina")
      .update({
        energy: newEnergy,
        last_updated_at: newLastUpdated.toISOString(),
      })
      .eq("id", currentStamina.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    energy: newEnergy,
    maxEnergy: currentStamina.max_energy,
    lastUpdatedAt: newLastUpdated.toISOString(),
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: stamina, error: fetchError } = await supabaseServer
    .from("stamina")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!stamina) {
    return NextResponse.json(
      { error: "Stamina record not found" },
      { status: 404 }
    );
  }

  // Calculate current actual stamina based on time recovery before consuming
  const currentStamina = stamina;
  const now = new Date();
  const lastUpdatedStr = currentStamina.last_updated_at.endsWith("Z")
    ? currentStamina.last_updated_at
    : currentStamina.last_updated_at + "Z";
  const lastUpdated = new Date(lastUpdatedStr);
  const timeDiff = now.getTime() - lastUpdated.getTime();

  const recoveryCount = Math.floor(timeDiff / RECOVERY_INTERVAL_MS);
  let effectiveEnergy = currentStamina.energy;

  // Apply recovery first
  if (recoveryCount > 0 && currentStamina.energy < currentStamina.max_energy) {
    effectiveEnergy = Math.min(
      currentStamina.energy + recoveryCount,
      currentStamina.max_energy
    );
  }

  if (effectiveEnergy <= 0) {
    return NextResponse.json({ error: "Not enough stamina" }, { status: 400 });
  }

  // Decrease energy by 1
  const newEnergy = effectiveEnergy - 1;
  const newLastUpdated = now;

  const { error: updateError } = await supabaseServer
    .from("stamina")
    .update({
      energy: newEnergy,
      last_updated_at: newLastUpdated.toISOString(),
    })
    .eq("id", currentStamina.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    energy: newEnergy,
    maxEnergy: currentStamina.max_energy,
    lastUpdatedAt: newLastUpdated.toISOString(),
  });
}
