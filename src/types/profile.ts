export interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  learningGoal: string | null;
  level: string | null;
}

export interface ProfileActionResult {
  ok: boolean;
  error?: string;
  profile?: ProfileData;
}
