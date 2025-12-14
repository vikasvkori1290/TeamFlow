import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const MarqueeContainer = styled(Box)({
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    padding: '40px 0',
    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
});

const MarqueeContent = styled(Box)({
    display: 'flex',
    gap: '30px',
    width: 'max-content',
    animation: `${scroll} 40s linear infinite`,
    '&:hover': {
        animationPlayState: 'paused',
    },
});

const ImageCard = styled('img')({
    width: '200px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        zIndex: 2,
        borderColor: '#00E5FF',
    },
});

const images = [
    'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=400&q=80', // Kanban / Sticky Notes
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80', // Agile Planning
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80', // Data / Analytics
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80', // Team Collaboration
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80', // Office High Five
    'https://images.unsplash.com/photo-1553877616-1528143ee196?auto=format&fit=crop&w=400&q=80', // Code / Laptop
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80', // Modern Office
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80', // Meeting Table
];

const ImageMarquee = () => {
    // Duplicate images to create a seamless loop
    const marqueeImages = [...images, ...images];

    return (
        <MarqueeContainer>
            <MarqueeContent>
                {marqueeImages.map((src, index) => (
                    <ImageCard
                        key={index}
                        src={src}
                        alt={`TeamFlow visual ${index}`}
                        loading="lazy"
                    />
                ))}
            </MarqueeContent>
        </MarqueeContainer>
    );
};

export default ImageMarquee;
