"use client";
import { useRouter } from "next/navigation";
import * as S from "./style";

const NavBar = () => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push("/chat");
  };

  return (
    <>
      <S.Container>
        <S.ChatButton onClick={handleChatClick} />
      </S.Container>
    </>
  );
};

export default NavBar;
