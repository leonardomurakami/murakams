import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const WindowContainer = styled.div`
  background-color: #c0c0c0;
  border: 3px solid;
  border-top-color: #dfdfdf;
  border-left-color: #dfdfdf;
  border-right-color: #808080;
  border-bottom-color: #808080;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TitleBar = styled.div`
  background-color: ${props => props.isActive ? '#000080' : '#808080'};
  color: white;
  padding: 2px 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  cursor: move;
`;

const TitleText = styled.span`
  font-weight: bold;
  font-size: 12px;
  flex-grow: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const TitleButton = styled.button`
  width: 16px;
  height: 14px;
  background-color: #c0c0c0;
  border: 1px solid;
  border-top-color: #dfdfdf;
  border-left-color: #dfdfdf;
  border-right-color: #808080;
  border-bottom-color: #808080;
  margin-left: 2px;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  cursor: pointer;

  &:active {
    border-top-color: #808080;
    border-left-color: #808080;
    border-right-color: #dfdfdf;
    border-bottom-color: #dfdfdf;
  }

  &:focus {
    outline: none;
  }
`;

const ContentArea = styled.div`
  padding: 0px;
  overflow-y: auto;
  flex-grow: 1;
  background-color: #008080;
  color: white;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;

  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #dfdfdf;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border: 1px outset #ffffff;
  }

  &::-webkit-scrollbar-button {
    background-color: #c0c0c0;
    border: 1px outset #ffffff;
  }
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const PopupWindow = ({ children, title, initialPosition, initialSize, onClose, zIndex, onFocus }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const contentRef = useRef(null);
  const windowRef = useRef(null);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleMouseDown = useCallback((e) => {
    setIsActive(true);
    onFocus?.();
  }, [onFocus]);

  const handleWheel = useCallback((e) => {
    const contentElement = contentRef.current;
    if (contentElement) {
      e.preventDefault();
      contentElement.scrollTop += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        contentElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (windowRef.current && !windowRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Rnd
      default={{
        x: initialPosition?.x || 50,
        y: initialPosition?.y || 50,
        width: initialSize?.width || 300,
        height: initialSize?.height || 200,
      }}
      minWidth={200}
      minHeight={100}
      bounds="window"
      style={{ zIndex }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      size={isMaximized ? { width: '100%', height: '100%' } : undefined}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      dragHandleClassName="drag-handle"
    >
      <WindowContainer ref={windowRef} onMouseDown={handleMouseDown}>
        <TitleBar className="drag-handle" isActive={isActive}>
          <TitleText>{title}</TitleText>
          <ButtonGroup>
            <TitleButton onClick={onClose}>_</TitleButton>
            <TitleButton onClick={handleMaximize}>{isMaximized ? '🗗' : '🗖'}</TitleButton>
            <TitleButton onClick={onClose}>X</TitleButton>
          </ButtonGroup>
        </TitleBar>
        <ContentArea ref={contentRef}>
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </ContentArea>
      </WindowContainer>
    </Rnd>
  );
};

export default PopupWindow;