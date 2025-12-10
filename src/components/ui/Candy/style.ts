import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: rgba(250, 250, 250, 0.7);
  border-radius: 20px;
  width: fit-content;
`;

export const IconWrapper = styled.div`
  width: 23px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Count = styled.p`
  font-family: "The Jamsil", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #545052;
  text-align: right;
  white-space: nowrap;
  margin: 0;
`;
