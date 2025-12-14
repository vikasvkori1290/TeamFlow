import React from 'react';
import Header from '../components/LandingPage/Header';
import Hero from '../components/LandingPage/Hero';
import ParticleBackground from '../components/ParticleBackground';

import Footer from '../components/LandingPage/Footer';

const LandingPage = () => {
    return (
        <>
            <ParticleBackground />
            <Header />
            <Hero />

            <Footer />
        </>
    );
};

export default LandingPage;
