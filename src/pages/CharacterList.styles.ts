import styled, { keyframes } from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background-color: #1e2a38;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 72px;
  color: #e8f0f8;
  font-family: inherit;
`;

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #e8f0f8;
  margin: 0 0 6px;
  letter-spacing: 0.02em;
`;

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #7a9ab5;
  margin: 0 0 28px;
`;

export const ListArea = styled.div`
  width: 100%;
  max-width: 760px;
`;

export const CharacterCard = styled.div`
  padding: 14px 20px;
  background-color: #253344;
  border: 1px solid #3d5068;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;

  &:hover {
    border-color: #6a9dbf;
    background-color: #2a3a4d;
  }
`;

export const IconsGroup = styled.div`
  display: flex;
  gap: 14px;
  flex-shrink: 0;
`;

export const SingleIconWrapper = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

export const RaceClassIcon = styled.img`
  width: 56px;
  height: 56px;
  display: block;
`;

export const RaceClassIconBorder = styled.img`
  position: absolute;
  top: -6px;
  left: -6px;
  width: 68px;
  height: 68px;
  pointer-events: none;
`;

export const CharInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CharName = styled.div<{ $color: string }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 0 6px rgba(0, 0, 0, 1),
    0 2px 6px rgba(0, 0, 0, 0.9);
`;

export const CharMeta = styled.div`
  font-size: 13px;
  color: #7a9ab5;
  margin-top: 2px;
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid #3d5068;
  border-top-color: #6a9dbf;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin: 32px auto;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: #5a7490;
  font-size: 14px;
  margin-top: 32px;
`;

export const AddCharacterCard = styled.div`
  padding: 10px 20px;
  background-color: transparent;
  border: 1px dashed #3d5068;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #5a7490;
  font-size: 14px;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: #6a9dbf;
    color: #a0c0d8;
  }
`;

export const AddIcon = styled.span`
  font-size: 22px;
  line-height: 1;
  font-weight: 300;
`;

export const CreateForm = styled.div`
  padding: 16px 20px;
  background-color: #253344;
  border: 1px solid #3d5068;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

export const FormLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #7a9ab5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const FormInput = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  background-color: #1e2a38;
  border: 1px solid #3d5068;
  border-radius: 4px;
  color: #e8f0f8;
  outline: none;
  font-family: inherit;

  &::placeholder { color: #5a7490; }
  &:focus { border-color: #6a9dbf; }
`;

export const FormSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  background-color: #1e2a38;
  border: 1px solid #3d5068;
  border-radius: 4px;
  color: #e8f0f8;
  outline: none;
  font-family: inherit;
  cursor: pointer;

  &:focus { border-color: #6a9dbf; }
  &:disabled { opacity: 0.5; cursor: default; }

  option { background-color: #1e2a38; }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const SubmitButton = styled.button`
  padding: 7px 20px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #4a7a9b;
  background-color: #1e3a52;
  color: #a0d0f0;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, background-color 0.15s;

  &:hover:not(:disabled) { border-color: #6a9dbf; background-color: #244870; }
  &:disabled { opacity: 0.5; cursor: default; }
`;

export const CancelButton = styled.button`
  padding: 7px 16px;
  font-size: 13px;
  border-radius: 4px;
  border: 1px solid #3d5068;
  background-color: transparent;
  color: #7a9ab5;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, color 0.15s;

  &:hover { border-color: #6a9dbf; color: #a0c0d8; }
`;

export const FormError = styled.div`
  font-size: 13px;
  color: #e07070;
  background-color: rgba(224, 80, 80, 0.1);
  border: 1px solid rgba(224, 80, 80, 0.25);
  border-radius: 4px;
  padding: 7px 12px;
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const AnimatedCardWrapper = styled.div<{ $index: number }>`
  opacity: 0;
  animation: ${fadeSlideUp} 0.25s ease both;
  animation-delay: ${({ $index }) => $index * 50}ms;
`;
