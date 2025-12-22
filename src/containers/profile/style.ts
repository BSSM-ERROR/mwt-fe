import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  padding-bottom: 96px;
`;

export const Panel = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 18px;
  padding: 18px 16px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #19191f;
`;

export const StatusBadge = styled.div<{ "data-kind"?: string }>`
  align-self: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ "data-kind": kind }) => {
    if (kind === "success") return "rgba(75, 181, 67, 0.12)";
    if (kind === "error") return "rgba(243, 81, 81, 0.12)";
    return "rgba(255, 159, 122, 0.16)";
  }};
  color: ${({ "data-kind": kind }) => {
    if (kind === "success") return "#2e8b2e";
    if (kind === "error") return "#d14343";
    return "#c15d2d";
  }};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  color: #2d2d34;
  font-weight: 700;
`;

export const Input = styled.input`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #ececf3;
  background: #fdfdfd;
  font-size: 14px;
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: #f35151;
    box-shadow: 0 0 0 4px rgba(243, 81, 81, 0.12);
  }
`;

export const ErrorText = styled.span`
  font-size: 12px;
  color: #d14343;
  font-weight: 700;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #f35151, #ff9f7a);
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  min-width: 180px;
  transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(243, 81, 81, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
