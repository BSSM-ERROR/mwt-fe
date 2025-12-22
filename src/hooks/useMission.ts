import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completePettingMission, getMissions } from "@/services/mission";

export const missionQueryKey = ["missions"];

export const usePettingMission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completePettingMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionQueryKey });
    },
  });
};

export const useMissions = () =>
  useQuery({
    queryKey: missionQueryKey,
    queryFn: getMissions,
  });
