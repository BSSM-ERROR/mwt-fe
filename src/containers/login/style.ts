import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px 20px;
  min-height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7));
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const Title = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 64px;
  color: #F35151;
  margin-bottom: 60px;
  margin-top: 80px;
  text-align: left;
  line-height: 1.1;
  letter-spacing: -0.02em;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
//   max-width: 400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 16px;
  padding-bottom: 40px;
`;

export const LoginButton = styled.button<{ provider: 'google' | 'naver' | 'kakao' }>`
  width: 100%;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  ${({ provider }) => {
        switch (provider) {
            case 'google':
                return `
          background: white;
          color: #333;
        `;
            case 'naver':
                return `
          background: #03C75A;
          color: white;
        `;
            case 'kakao':
                return `
          background: #FEE500;
          color: #000;
        `;
        }
    }}
`;

export const IconWrapper = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;