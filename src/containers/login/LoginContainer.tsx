'use client';
import * as S from './style';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginContainer() {
  return (
    <S.Wrapper>
      <S.Title>
        My<br />
        Waifu<br />
        Teacher
      </S.Title>

      <S.ButtonWrapper>
        <S.LoginButton
          provider="google"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <S.IconWrapper>
            <Image
              src="/icons/logo/google.svg"
              alt="Google"
              width={36}
              height={36}
            />
          </S.IconWrapper>
          구글 계정으로 로그인
        </S.LoginButton>

        <S.LoginButton
          provider="naver"
          onClick={() => signIn('naver', { callbackUrl: '/' })}
        >
          <S.IconWrapper>
            <Image
              src="/icons/logo/naver.svg"
              alt="Naver"
              width={24}
              height={24}
            />
          </S.IconWrapper>
          네이버 계정으로 로그인
        </S.LoginButton>

        <S.LoginButton
          provider="kakao"
          onClick={() => signIn('kakao', { callbackUrl: '/' })}
        >
          <S.IconWrapper>
            <Image
              src="/icons/logo/kakao.svg"
              alt="Kakao"
              width={24}
              height={24}
            />
          </S.IconWrapper>
          카카오톡 계정으로 로그인
        </S.LoginButton>
      </S.ButtonWrapper>
    </S.Wrapper>
  );
}
