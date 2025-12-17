import { useMutation } from "@tanstack/react-query";
import { completePettingMission } from "@/services/mission";

export const usePettingMission = () => {
  return useMutation({
    mutationFn: completePettingMission,
  });
};
