import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

// Define styles as a standard string to inject
const styles = `
@keyframes float {
  0% { transform: translateY(0) translateX(0); opacity: 0.6; }
  50% { transform: translateY(-20px) translateX(5px); opacity: 0.8; }
  100% { transform: translateY(0) translateX(0); opacity: 0.6; }
}

.particle {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  opacity: 0.6;
  pointer-events: none; /* Ensure particles don't block clicks */
}

.teal-glow {
  box-shadow: 0 0 5px 1px rgba(50, 220, 200, 0.4);
}
`;

const ParticleBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Inject styles
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = ''; // Cleanup

        const particleCount = 100;
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 4 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * width}px`;
            particle.style.top = `${Math.random() * height}px`;

            const delay = Math.random() * 5;
            const duration = 15 + Math.random() * 10;

            // Now 'float' is a valid global keyframe name
            particle.style.animation = `float ${duration}s ease-in-out infinite`;
            particle.style.animationDelay = `${delay}s`;

            if (Math.random() > 0.7) {
                particle.classList.add('teal-glow');
            }

            container.appendChild(particle);
        }

        return () => {
            document.head.removeChild(styleSheet);
            if (container) container.innerHTML = '';
        };
    }, []);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0, // Behind content
                background: 'radial-gradient(circle at 50% 50%, #111625 0%, #0B0F19 100%)',
                overflow: 'hidden',
                pointerEvents: 'none'
            }}
        />
    );
};

export default ParticleBackground;
