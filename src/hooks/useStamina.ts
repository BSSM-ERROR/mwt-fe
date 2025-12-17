import { useQuery } from "@tanstack/react-query";
import { getStamina } from "@/services/stamina";
import { useStaminaStore } from "@/store/useStaminaStore";
import { useEffect } from "react";

const RECOVERY_INTERVAL_MS = 60 * 60 * 1000;

export const useStamina = () => {
  const { setStamina, increaseEnergy } = useStaminaStore();

  const query = useQuery({
    queryKey: ["stamina"],
    queryFn: getStamina,
  });

  useEffect(() => {
    if (query.data) {
      const nextRecovery =
        query.data.energy >= query.data.maxEnergy
          ? null
          : new Date(
            new Date(query.data.lastUpdatedAt).getTime() + RECOVERY_INTERVAL_MS
          );

      setStamina({
        currentStamina: query.data.energy,
        maxStamina: query.data.maxEnergy,
        nextRecoveryTime: nextRecovery,
      });
    }
  }, [query.data, setStamina]);

  useEffect(() => {
    if (!query.data) return;

    const { energy, maxEnergy, lastUpdatedAt } = query.data;
    if (energy >= maxEnergy) return;

    const lastUpdated = new Date(lastUpdatedAt);
    const nextRecoveryTime = new Date(
      lastUpdated.getTime() + RECOVERY_INTERVAL_MS
    );
    const now = new Date();
    const timeUntilRecovery = nextRecoveryTime.getTime() - now.getTime();

    if (timeUntilRecovery <= 0) {
      query.refetch();
      return;
    }

    const timeout = setTimeout(() => {
      increaseEnergy();
      query.refetch();
    }, timeUntilRecovery);

    return () => clearTimeout(timeout);
  }, [query.data, query, increaseEnergy]);

  return query;
};
