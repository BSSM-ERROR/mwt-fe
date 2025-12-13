"use client";
import Image from "next/image";
import * as S from "./style";
import { useCandyStore } from "@/store/useCandyStore";

const Candy = () => {
  const count = useCandyStore((state) => state.count);
  return (
    <S.Container>
      <S.IconWrapper>
        <Image
          src="/icons/candy.svg"
          alt="candy"
          width={23}
          height={23}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </S.IconWrapper>
      <S.Count>{count}</S.Count>
    </S.Container>
  );
};

export default Candy;
