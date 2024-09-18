import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { useGlitch } from 'react-powerglitch';

const scanlines = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
`;

const rgbShift = keyframes`
  0%, 100% { text-shadow: -1px 0 red, 1px 0 blue; }
  25%, 75% { text-shadow: -1.5px 0 red, 1.5px 0 blue; }
  50% { text-shadow: -2px 0 red, 2px 0 blue; }
`;

const renderLine = keyframes`
  0% { top: 0%; }
  100% { top: 100%; }
`;

const flicker = keyframes`
  0% { opacity: 0.99; }
  25% { opacity: 0.987; }
  50% { opacity: 0.985; }
  50% { opacity: 0.987; }
  100% { opacity: 0.99; }
`;

const CRTEffectStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
`;

const CRTOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
              linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  opacity: 0.15;
  mix-blend-mode: overlay;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      rgba(255, 255, 255, 0.1) 50%,
      rgba(0, 0, 255, 0.1) 50%
    );
    background-size: 100% 3px;
    opacity: 0.08;
    animation: ${scanlines} 0.05s steps(1) infinite;
  }
`;

const RenderLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: ${renderLine} 8s linear infinite;
  z-index: 3;
`;

const GlitchContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  ${props => props.isGlitching && css`
    animation: ${rgbShift} 0.1s linear infinite;
  `}
`;

const CRTCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  mix-blend-mode: overlay;
`;

const GlobalStyle = createGlobalStyle`
  body {
    animation: ${flicker} 0.15s infinite;
  }
  * {
    text-shadow: 0 0 1px #00ff00, 0 0 1px #00ff00;
  }
`;

const CRTEffect = ({ children, isModern }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const canvasRef = useRef(null);

  const glitch = useGlitch({
    playMode: 'manual',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 600,
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
    const triggerGlitch = () => {
      setIsGlitching(true);
      glitch.startGlitch();
      setTimeout(() => {
        glitch.stopGlitch();
        setIsGlitching(false);
      }, 600);
    };

    const scheduleNextGlitch = () => {
      const nextGlitchDelay = Math.random() * 10000 + 30000; // Random delay between 30-40 seconds
      setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, nextGlitchDelay);
    };

    scheduleNextGlitch();

    const animate = () => {
      requestAnimationFrame(animate);
    };

    animate();

    return () => {};
  }, [glitch]);

  if (isModern) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <GlobalStyle />
      {children}
      <CRTEffectStyled>
        <CRTCanvas ref={canvasRef} />
        <CRTOverlay />
        <RenderLine />
        <GlitchContainer ref={glitch.ref} isGlitching={isGlitching} />
      </CRTEffectStyled>
    </div>
  );
};

export default CRTEffect;