import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getProfile } from "@/services/profile";
import { ProfileData } from "@/types/profile";

export const profileQueryKey = ["profile"];

export const useProfile = (
  initialData?: ProfileData,
): UseQueryResult<ProfileData> => {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfile,
    initialData,
    staleTime: 1000 * 30,
  });
};
