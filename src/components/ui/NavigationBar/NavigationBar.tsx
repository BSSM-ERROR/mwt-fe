"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as S from "./style";

const NavBar = () => {
  const router = useRouter();

  const handleChatClick = () => {
    router.push("/chat");
  };

  const menuItems = [
    { icon: "/icons/menu/default/home.svg", label: "Home", path: "/" },
    { icon: "/icons/menu/default/streak.svg", label: "Streak", path: "/streak" },
    { icon: "/icons/menu/default/trophy.svg", label: "Mission", path: "/mission" },
    { icon: "/icons/menu/default/profile.svg", label: "Profile", path: "/profile" },
  ];

  return (
    <>
      <S.Container>
        <S.ChatButton onClick={handleChatClick} />
        <S.MenuWrapper>
          {menuItems.map((item, index) => (
            <S.MenuItem key={index} onClick={() => router.push(item.path)}>
              <S.IconWrapper>
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={40}
                  height={40}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </S.IconWrapper>
              <S.Label>{item.label}</S.Label>
            </S.MenuItem>
          ))}
        </S.MenuWrapper>
      </S.Container>
    </>
  );
};

export default NavBar;
