import { useQuery } from "@tanstack/react-query";
import { getStreak } from "@/services/streak";

export const useStreak = () => {
  return useQuery({
    queryKey: ["streak"],
    queryFn: getStreak,
  });
};
