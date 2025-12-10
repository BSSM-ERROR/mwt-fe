"use client";
import Image from "next/image";
import * as S from "./style";

type CandyProps = {
  count?: number;
};

const Candy = ({ count = 0 }: CandyProps) => {
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
