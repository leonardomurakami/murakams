import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PopupWindow from './PopupWindow';
import {
  POPUP_INTERVAL,
  MAX_POPUPS,
  POPUP_PROBABILITY
} from '../constants';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.imagePosition};
  align-items: flex-start;
  font-family: ${props => props.font};
  font-size: calc(14px + 0.4vw); /* Base size + viewport-based increase */
`;

const ContentText = styled.p`
  margin-bottom: 16px;
  flex: 1;
`;

const ContentImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin: ${props => {
    switch(props.imagePosition) {
      case 'column': return '0 0 16px 0';
      case 'column-reverse': return '16px 0 0 0';
      case 'row': return '0 16px 0 0';
      case 'row-reverse': return '0 0 0 16px';
      default: return '0 16px 0 0';
    }
  }};
`;

const ColoredSpan = styled.span`
  color: ${props => props.color};
`;

const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5', '#F5FF33',
    '#FF3333', '#33FF33', '#3333FF', '#FF33FF', '#33FFFF', '#FFFF33',
  ];

const fakeAds = [
  {
    title: "Enlarge Your... Vocabulary!",
    content: "Learn 1000 new words in just 7 days! Our secret method will shock you! " +
        "Imagine impressing your friends with your extensive lexicon. " +
        "Boost your career prospects with enhanced communication skills. " +
        "Become a master wordsmith and never be at a loss for words again. " +
        "Our revolutionary technique uses advanced mnemonic devices and cutting-edge linguistic algorithms. " +
        "Don't wait! Start your journey to verbal mastery today!".repeat(5), // Repeat to ensure scrolling
  },
  {
    title: "You Won't Believe This!",
    content: "Congratulations! You're the 1,000,000th visitor! Click here to claim your prize!"
  },
  {
    title: "Hot Integers in Your Area",
    content: "Meet local Integers, Floats and Doubles tonight! Just enter your credit card details to get started!",
  },
  {
    title: "Lose Weight Fast!",
    content: "Doctors hate this one weird trick! Lose 50 pounds in just 2 weeks!",
  },
  {
    title: "Get Rich Quick!",
    content: "Make $5000 a day working from home! Click here to learn how!",
  },
  {
    title: "Enlarge Your... Vocabulary!",
    content: "Learn 1000 new words in just 7 days! Our secret method will shock you!",
  },
  {
    title: "99.9999% Uptime for Your Love Life!",
    content: "Tired of relationship downtime? Our SRE (Soulmate Reliability Experts) guarantee high availability for your heart! Implement our fault-tolerant dating strategies and experience unparalleled uptime in your love life. Don't let your relationships crash - upgrade to our HA (Highly Affectionate) cluster today!",
  },
  {
    title: "Goat Your Code Covered!",
    content: "Introducing GoatCI: The only Continuous Integration tool that uses real goats to test your code! Watch as our highly trained caprine testers headbutt bugs out of existence. Features include: Cud-powered caching, Horn-based load balancing, and Bleating alerts for failed builds. Don't let your pipeline be the G.O.A.T (Glitchiest Of All Time) - try GoatCI now!",
  },
  {
    title: "Udder-ly Amazing DevOps Tools!",
    content: "Milk your productivity with our suite of farm-fresh development tools! From our Hay-gil project management to our Silo-based containerization, we've got everything you need to cultivate a bumper crop of code. Don't let your projects go to pasture - let us help you corral your codebase today!",
  },
  {
    title: "Billy the Kid's Guide to Kubernetes",
    content: "Wrangle your containers like a true goatherd! Our comprehensive course taught by legendary outlaw Billy the Kid will have you lassoing pods and herding deployments in no time. Learn to scale your goat farm... err, cluster with ease. Remember, in the wild west of microservices, the fastest draw wins!",
  },
  {
    title: "Goatflix: Stream Your Dreams!",
    content: "Bored of Netflix? Try Goatflix! Our AI-powered algorithm suggests the best goat videos based on your browsing history. Watch classics like 'The Silence of the Lambs' (Goat Edition) and 'The Great Goatsby'. Don't be sheepish, sign up now for your free 30-day trial!",
  },
  {
    title: "Error 404: Bug Not Found!",
    content: "Tired of pesky bugs in your code? Our revolutionary 'Schrödinger's Test' simultaneously finds and fixes bugs without ever observing them! Quantum entangle your codebase for instant, paradox-free debugging. Warning: May cause universe-splitting side effects. Use at your own risk!",
  },
  {
    title: "Kubernetes: Now with Real Cubes!",
    content: "Tired of virtual Kubernetes? Try our new Physical Kubernetes! Each pod is a real, tangible cube. Need to scale? Just stack more cubes! Our patented Cube-Master will manually move your cubes between Node-Shelves for true hands-on container orchestration. Warning: May require larger office space and strong arms.",
  },
  {
    title: "Docker: Containerize Your Life!",
    content: "Why stop at containerizing your apps? Containerize your whole life with Life-Docker! Each aspect of your daily routine becomes a lightweight, portable container. Easily version-control your breakfast, scale your sleep, and orchestrate your social life. Comes with pre-built images for 'Productive Day' and 'Netflix Binge'. Side effects may include existential crises and difficulty distinguishing reality from containers.",
  },
  {
    title: "AWS: Adopt Whimsical Squirrels",
    content: "Introducing Amazon's latest service: AWS (Adopt Whimsical Squirrels). These cloud-native rodents will manage your infrastructure with nutty efficiency. Features include: Acorn-based load balancing, Tree-to-tree networking, and Hibernate-on-demand. Each squirrel comes pre-trained in bushy-tail driven development. Warning: May occasionally bury important data for winter.",
  },
  {
    title: "GCP: Gophers Coding Python",
    content: "Google's revolutionary new service: Gophers Coding Python! Our highly trained gophers will write Python code for you, combining the speed of Go with the simplicity of Python. Watch in awe as they tunnel through your codebase, leaving perfectly optimized Python in their wake. Caution: Gophers may occasionally mistake whitespace for edible roots.",
  },
  {
    title: "Go Faster with Our Turbo Gopher Wheel!",
    content: "Boost your Go programs to ludicrous speed with our Turbo Gopher Wheel! Simply attach this wheel to your computer and watch our energetic gophers run at lightning speed. Each rotation compiles your Go code faster than ever before. Includes a 'panic' button to stop the wheel in case of infinite loops. Gopher food sold separately.",
  },
  {
    title: "Python: Now with Real Snakes!",
    content: "Upgrade your Python experience with our new Bio-Integrated Development Environment! Each function is executed by a real python snake. Watch in amazement as our serpentine coders slither through your algorithms. Comes with a comprehensive snake-handling course and a year's supply of mice. Disclaimer: Snakes may occasionally swallow important variables.",
  }
];

const imageUrls = [
    "/images/oldie.png",
    "/images/smiley.gif",
    "/images/trophy.png",
    "/images/smiley2.jpg",
    "/images/smiley3.jpg",
    "/images/smiley4.png",
    "/images/smiley5.jpg",
    "/images/smiley6.avif",
    "/images/smiley7.jpg",
    "/images/smiley8.jpg",
    "/images/smiley9.webp",
    "/images/goat.png",
    "/images/goat.webp",
];

const funFonts = [
    '"Comic Sans MS", cursive',
    '"Papyrus", fantasy',
    '"Curlz MT", cursive',
    '"Chalkduster", fantasy',
    '"Marker Felt", fantasy',
    '"Brush Script MT", cursive',
    '"Luminari", fantasy',
    '"Jazz LET", fantasy',
    '"Trattatello", fantasy',
    '"Party LET", cursive',
];

const RandomPopupGenerator = () => {
    const [popups, setPopups] = useState([]);

    const colorWords = useCallback((content) => {
        return content.split(' ').map(word => 
            Math.random() < 0.1 ? `<color>${word}</color>` : word
        ).join(' ');
    }, []);

    const createRandomPopup = useCallback(() => {
        const adContent = fakeAds[Math.floor(Math.random() * fakeAds.length)];
        const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const randomFont = funFonts[Math.floor(Math.random() * funFonts.length)];
        const imagePositions = ['row', 'row-reverse', 'column', 'column-reverse'];
        const randomImagePosition = imagePositions[Math.floor(Math.random() * imagePositions.length)];
        const coloredContent = colorWords(adContent.content);

        const newPopup = {
            id: Date.now(),
            ...adContent,
            content: coloredContent,
            imageUrl,
            font: randomFont,
            imagePosition: randomImagePosition,
            position: {
                x: Math.random() * (window.innerWidth - 400),
                y: Math.random() * (window.innerHeight - 200),
            },
            size: {
                width: 400 + Math.random() * 100,
                height: 200 + Math.random() * 100,
            },
        };
        setPopups(prevPopups => [...prevPopups, newPopup]);
    }, [colorWords]);

    const closePopup = useCallback((id) => {
        setPopups(prevPopups => prevPopups.filter(popup => popup.id !== id));
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
          if (Math.random() < POPUP_PROBABILITY && popups.length < MAX_POPUPS) {
              createRandomPopup();
          }
      }, POPUP_INTERVAL);

      return () => clearInterval(interval);
  }, [popups.length, createRandomPopup]);

    const renderColoredText = useCallback((text) => {
        return text.split(/<color>|<\/color>/).map((part, index) => 
            index % 2 === 0 ? part : (
                <ColoredSpan key={index} color={colors[Math.floor(Math.random() * colors.length)]}>
                    {part}
                </ColoredSpan>
            )
        );
    }, []);

    return (
      <>
          {popups.map(popup => (
              <PopupWindow
                  key={popup.id}
                  title={popup.title}
                  initialPosition={popup.position}
                  initialSize={popup.size}
                  onClose={() => closePopup(popup.id)}
              >
                  <ContentContainer font={popup.font} imagePosition={popup.imagePosition}>
                      <ContentImage src={popup.imageUrl} alt={popup.title} imagePosition={popup.imagePosition} />
                      <ContentText>{renderColoredText(popup.content)}</ContentText>
                  </ContentContainer>
              </PopupWindow>
          ))}
      </>
  );
};

export default RandomPopupGenerator;