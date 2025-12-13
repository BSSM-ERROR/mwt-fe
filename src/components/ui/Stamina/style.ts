import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const StaminaIconWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 8px;
  background-color: rgba(250, 250, 250, 0.7);
  border-radius: 20px;
`;

export const IconWrapper = styled.div`
  width: 22px;
  height: 29px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

export const Timer = styled.p`
  font-family: "The Jamsil", sans-serif;
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  color: #545052;
  text-align: right;
  width: 100%;
  margin: 0;
`;
