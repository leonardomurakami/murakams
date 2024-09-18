import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { useGlitch } from 'react-powerglitch';

const rgbShift = keyframes`
  0% { text-shadow: 0.9px 0 1px rgb(0,255,0), -0.9px 0 1px rgb(255,0,255), 0 0 3px; }
  50% { text-shadow: -0.9px 0 1px rgb(0,255,0), 0.9px 0 1px rgb(255,0,255), 0 0 3px; }
  100% { text-shadow: 0.9px 0 1px rgb(0,255,0), -0.9px 0 1px rgb(255,0,255), 0 0 3px; }
`;

const scanlines = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
`;

const flicker = keyframes`
  0% { opacity: 0.99; }
  5% { opacity: 0.96; }
  10% { opacity: 0.99; }
  15% { opacity: 0.96; }
  20% { opacity: 0.99; }
  55% { opacity: 0.98; }
  60% { opacity: 0.99; }
  75% { opacity: 0.96; }
  80% { opacity: 0.99; }
  100% { opacity: 0.99; }
`;

const CRTWrapper = styled.div`
  position: relative;
  animation: ${flicker} 0.15s infinite;
  ${props => !props.isModern && css`
    &::before {
      content: " ";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 2;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
  `}
`;

const CRTContent = styled.div`
  position: relative;
  z-index: 1;
  animation: ${rgbShift} 3s infinite linear;
`;

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.2)
  );
  background-size: 100% 4px;
  animation: ${scanlines} 1s linear infinite;
  opacity: 0.3;
  z-index: 2;
  pointer-events: none;
`;

const GlobalStyle = createGlobalStyle`
  * {
    animation: ${rgbShift} 3s infinite linear;
  }
`;

const CRTEffect = ({ children, isModern }) => {
  // eslint-disable-next-line no-unused-vars
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchRef = useRef(null);

  const glitch = useGlitch({
    playMode: 'manual',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 1000,
      iterations: 1,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 15,
      amplitudeX: 0.2,
      amplitudeY: 0.2,
    },
    slice: {
      count: 6,
      velocity: 15,
      minHeight: 0.02,
      maxHeight: 0.15,
      hueRotate: true,
    },
    pulse: true,
  });

  useEffect(() => {
    if (isModern) return;

    const triggerGlitch = () => {
      setIsGlitching(true);
      if (glitchRef.current && glitchRef.current.startGlitch) {
        glitchRef.current.startGlitch();
      }
      setTimeout(() => {
        if (glitchRef.current && glitchRef.current.stopGlitch) {
          glitchRef.current.stopGlitch();
        }
        setIsGlitching(false);
      }, 1000);
    };

    const scheduleNextGlitch = () => {
      const nextGlitchDelay = Math.random() * 10000 + 30000; // Random delay between 30-40 seconds
      setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, nextGlitchDelay);
    };

    scheduleNextGlitch();

    return () => {
      if (glitchRef.current && glitchRef.current.stopGlitch) {
        glitchRef.current.stopGlitch();
      }
    };
  }, [isModern]);

  useEffect(() => {
    glitchRef.current = glitch;
  }, [glitch]);

  if (isModern) {
    return <>{children}</>;
  }

  return (
    <CRTWrapper isModern={isModern}>
      <GlobalStyle />
      <CRTContent ref={glitch.ref}>
        {children}
      </CRTContent>
      <Scanline />
    </CRTWrapper>
  );
};

export default CRTEffect;