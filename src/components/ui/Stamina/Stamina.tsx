"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as S from "./style";
import { useStaminaStore } from "@/store/useStaminaStore";
import { useStamina } from "@/hooks/useStamina";

const Stamina = () => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const { currentStamina, maxStamina, nextRecoveryTime } = useStaminaStore();
  useStamina();

  useEffect(() => {
    if (!nextRecoveryTime || currentStamina >= maxStamina) {
      setTimeRemaining("");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = nextRecoveryTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextRecoveryTime, currentStamina, maxStamina]);

  return (
    <S.Container>
      <S.StaminaIconWrapper>
        {Array.from({ length: maxStamina }, (_, index) => (
          <S.IconWrapper key={index}>
            <Image
              src={
                index < currentStamina
                  ? "/icons/stamina/active.svg"
                  : "/icons/stamina/inactive.svg"
              }
              alt={`stamina-${index + 1}`}
              width={15}
              height={22}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </S.IconWrapper>
        ))}
        <Image
          src={"/icons/stamina/plus.svg"}
          alt={"plus"}
          width={20}
          height={20}
        />
      </S.StaminaIconWrapper>
      {currentStamina < maxStamina && timeRemaining && (
        <S.Timer>{timeRemaining}</S.Timer>
      )}
    </S.Container>
  );
};

export default Stamina;
