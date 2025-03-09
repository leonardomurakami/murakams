import React, { useState } from 'react';
import PopupWindow from './PopupWindow';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  color: #333;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: white;
  height: 100%;
  line-height: 1.6;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  text-align: center
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;
  letter-spacing: -0.02em;
`;

const Subheader = styled.h2`
  font-size: 1.8rem;
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const IntroList = styled.ul`
  list-style: none;
  margin: 0 auto 2rem;
  max-width: 1000px;
  li {
    margin: 0.75rem 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #4a5568;
  }
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 180px auto;
  gap: 1rem;
  margin-bottom: 0.75rem;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
`;

const SkillBar = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  gap: 4px;
`;

const SkillDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.filled ? '#3182ce' : '#e2e8f0'};
`;

const ContactList = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  
  a {
    color: #3182ce;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover {
      color: #2c5282;
      text-decoration: underline;
    }
  }

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #4a5568;
  }
`;

const Code = styled.code`
  background: #f7fafc;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #4a5568;
  font-size: 0.9em;
  border: 1px solid #e2e8f0;
`;

const Footer = styled.div`
 text-align: center;
 color: #718096;
 margin-top: 2rem;
 padding-top: 1rem;
 border-top: 1px solid #e2e8f0;
 display: flex;
 align-items: center;
 justify-content: center;
 gap: 0.75rem;
 font-size: 0.875rem;

 a {
   color: inherit;
   display: flex;
   align-items: center;
   &:hover {
     color: #4a5568;
   }
 }
 
 svg {
   transition: transform 0.2s ease;
   &:hover {
     transform: scale(1.1);
   }
 }
`;

const InfoPopup = () => {
  const [visible, setVisible] = useState(true);
  const [zIndex, setZIndex] = useState(1000);

  const initialPosition = {
    x: window.innerWidth/2,
    y: 50
  };

  const initialSize = {
    width: window.innerWidth/2,
    height: window.innerHeight - 100
  };

  const renderSkillLevel = (rating) => {
    const dots = [];
    for (let i = 0; i < 5; i++) {
      dots.push(
        <SkillDot 
          key={i} 
          filled={rating.charAt(i) === '*'} 
        />
      );
    }
    return <SkillBar>{dots}</SkillBar>;
  };

  return visible ? (
    <PopupWindow
      title="Leonardo Murakami - SRE"
      initialPosition={initialPosition}
      initialSize={initialSize}
      onClose={() => setVisible(false)}
      zIndex={zIndex}
      onFocus={() => setZIndex(prev => prev + 1)}
    >
      <Container>
        <Header>Leonardo Murakami</Header>
        <Subheader>Site Reliability Engineer</Subheader>
        
        <IntroList>
          <li>🌐 Technology Enthusiast</li>
          <li>📊 Likes to dabble into general programming, technologies, etc. studies</li>
          <li>🐐 Studying goat farming (<Code>cat default/why-goat-farming.txt</Code>)</li>
        </IntroList>

        <Section>
          <SectionTitle>Skills</SectionTitle>
          {[
            ['Go', '****-'],
            ['Python', '*****'],
            ['SQL', '****-'],
            ['Kubernetes, Docker', '*****'],
            ['AWS, GCP', '*****'],
            ['Terraform', '*****'],
            ['JavaScript (React, Node.js)', '***--']
          ].map(([skill, rating]) => (
            <Grid key={skill}>
              <div>{skill}</div>
              {renderSkillLevel(rating)}
            </Grid>
          ))}
        </Section>

        <Section>
          <SectionTitle>Contact</SectionTitle>
          <ContactList>
            <p>📧 Email: <a href="contato@murakams.com">contato@murakams.com</a></p>
            <p>🔗 LinkedIn: <a href="https://linkedin.com/in/leonardo-murakami" target="_blank" rel="noopener noreferrer">linkedin.com/in/leonardo-murakami</a></p>
            <p>🐙 GitHub: <a href="https://github.com/leonardomurakami" target="_blank" rel="noopener noreferrer">github.com/leonardomurakami</a></p>
          </ContactList>
        </Section>

        <p>Feel free to explore my (non-existent) projects using the <Code>ls</Code>, <Code>cat</Code> and other unix commands!</p>
        <Footer>
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" fill="currentColor">
            <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/>
          </svg>
          <span>Put together with love (and glue) by Leonardo Murakami</span>
          <a href="https://github.com/leonardomurakami/murakams" target="_blank" rel="noopener noreferrer">
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          </a>
        </Footer>
      </Container>
      
    </PopupWindow>
  ) : null;
};

export default InfoPopup;