"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import * as S from "./style";
import { menuItems } from "@/constants/menuItems";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChatClick = () => {
    router.push("/chat");
  };

  const getIconPath = (iconName: string, path: string) => {
    const isActive = pathname.startsWith(path);
    const folder = isActive ? "clicked" : "default";
    return `/icons/menu/${folder}/${iconName}`;
  };

  return (
    <>
      <S.Container>
        <S.ChatButton onClick={handleChatClick} />
        <S.MenuWrapper>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <S.MenuItem key={index} onClick={() => router.push(item.path)}>
                <S.IconWrapper>
                  <Image
                    src={getIconPath(item.iconName, item.path)}
                    alt={item.label}
                    width={40}
                    height={40}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </S.IconWrapper>
                <S.Label isActive={isActive}>{item.label}</S.Label>
              </S.MenuItem>
            );
          })}
        </S.MenuWrapper>
      </S.Container>
    </>
  );
};

export default NavBar;
