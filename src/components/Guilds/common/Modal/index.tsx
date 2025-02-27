import styled, { css } from 'styled-components';
import ReactDOM from 'react-dom';
import { isMobile } from 'react-device-detect';

import { Button } from '../Button';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import { Heading } from '../Typography';

export const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 700;
  width: 40%;
  min-width: 400px;
  max-width: ${({ maxWidth }) => maxWidth}px;
  outline: 0;
`;

export const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 6, 41, 0.5);
  z-index: 500;
`;

export const StyledModal = styled.div`
  z-index: 100;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  margin: auto;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.curved2};
  box-sizing: border-box;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);

  @media only screen and (max-width: 768px) {
    padding: 0px 20px;
    height: 100vh;
  }
`;

export const Header = styled.div`
  display: flex;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
  position: relative;
  align-items: center;
`;

export const SecondaryHeader = styled(Header)`
  justify-content: center;
  border-bottom: none;

  @media only screen and (max-width: 768px) {
    position: relative;
    top: 25%;
  }
`;

export const HeaderText = styled(Heading)`
  margin: 0;
`;

const CloseIcon = styled(FiX)`
  position: absolute;
  color: ${({ theme }) => theme.colors.text};
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  height: 1.5rem;
  width: 1.5rem;
  z-index: 800;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const SecondaryCloseIcon = styled(CloseIcon)`
  top: 25px;
`;

export const Content = styled.div`
  color: ${({ theme }) => theme.colors.text};
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: hidden;

  ${props =>
    props.modal === true &&
    css`
      @media only screen and (max-width: 768px) {
        position: relative;
        top: 25%;
      }
    `}
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0 1.5rem 1.5rem 1.5rem;

  ${props =>
    props.modal === true &&
    css`
      @media only screen and (max-width: 768px) {
        position: relative;
        top: 60%;
      }
    `}
`;

export interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  children: JSX.Element;
  header?: JSX.Element | string;
  contentHeader?: JSX.Element | string;
  hideHeader?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  maxWidth?: number;
  showSecondaryHeader?: boolean;
  cross?: boolean;
}

export const ModalButton = styled(Button)`
  margin: 8px;
  flex: 1;
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
  header,
  contentHeader,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  hideHeader,
  children,
  maxWidth,
  showSecondaryHeader,
  cross,
}) => {
  const modal = (
    <div>
      <Backdrop onClick={onDismiss} />
      <Wrapper maxWidth={maxWidth}>
        <StyledModal>
          {isMobile && (
            <Header onClick={onDismiss}>
              {cross ? <CloseIcon /> : <FiArrowLeft />}
              <HeaderText>{header}</HeaderText>
            </Header>
          )}{' '}
          {!hideHeader && !isMobile && (
            <Header>
              <HeaderText>{header}</HeaderText>
              <CloseIcon onClick={onDismiss} />
            </Header>
          )}
          {showSecondaryHeader && (
            <SecondaryHeader>
              <HeaderText>{contentHeader}</HeaderText>
              {!isMobile && <SecondaryCloseIcon onClick={onDismiss} />}
            </SecondaryHeader>
          )}
          <Content modal={cross ? true : false}>{children}</Content>
          {(onCancel || onConfirm) && (
            <Footer modal={cross ? true : false}>
              {cancelText && (
                <ModalButton
                  variant={cross ? 'secondary' : 'primary'}
                  onClick={() => {
                    onCancel();
                    onDismiss();
                  }}
                >
                  {cancelText}
                </ModalButton>
              )}
              {onConfirm && (
                <ModalButton onClick={onConfirm}>{confirmText}</ModalButton>
              )}
            </Footer>
          )}
        </StyledModal>
      </Wrapper>
    </div>
  );

  return isOpen ? ReactDOM.createPortal(modal, document.body) : null;
};
