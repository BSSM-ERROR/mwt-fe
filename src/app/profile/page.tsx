import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProfileContainer from "@/containers/profile/ProfileContainer";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchProfile } from "@/lib/profile";
import { updateProfileAction } from "./actions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await fetchProfile(session.user.id);

  return (
    <ProfileContainer
      initialProfile={profile}
      onUpdate={updateProfileAction}
      fallbackName={session?.user?.name ?? ""}
    />
  );
}
