
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Contact from './Contact';
const images = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  "https://www.decoactuelle.ma/wp-content/uploads/2022/06/vue-large-RS.jpg",
  "https://www.mapbusiness.ma/wp-content/uploads/2021/08/Visuel-2-Rabat-Square.jpg"
  
];
const HeroSection = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [showVipForm, setShowVipForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollPosition = window.scrollY;
        // Moving the background slightly slower than the scroll speed creates parallax effect
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section id="hero" className="relative h-screen flex items-center overflow-hidden mt-0">
      {/* Background image with parallax effect */}
      <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      modules={[Autoplay]} // <-- Ajoute cette ligne !
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="absolute inset-0 w-full h-full"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div
            className="bg-cover bg-center absolute inset-0"
            style={{
              backgroundImage: `url(${image})`,
              height: '130%',
              top: '-15%',
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
    
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxe-blue/60 to-luxe-black/50 z-10"></div>
      
      {/* Content */}
      <div className="container relative z-20 px-6 lg:px-10 pt-24 sm:pt-28 md:pt-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Investissez dans l'immobilier de prestige au <span className="gold-gradient">Maroc</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-white/90 font-light mb-10 max-w-3xl">
            Accédez à des opportunités exclusives avec un accompagnement 100% clé en main et une rentabilité garantie.
          </h2>
          
          {/* CTA Section */}
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
           <>
    <a
  href="#"
  className="gold-button inline-flex items-center justify-center"
  onClick={(e) => {
    e.preventDefault(); // empêcher le scroll vers #
    setShowVipForm(true); // afficher le formulaire
  }}
>
  Recevoir une Consultation VIP
  <ArrowRight className="ml-2 h-5 w-5" />
</a>
  {showVipForm && (
<div
  className="fixed left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl p-3 bg-white rounded-lg shadow-2xl border"
  style={{ top: '80px' }}
>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-luxe-blue">Contact VIP</h2>
           <button
      className="text-gray-500 hover:text-red-500"
      onClick={() => setShowVipForm(false)}
    >
      <X size={18} />
    </button>
          </div>
  <Contact onSuccess={() => setShowVipForm(false)} />
          </div>
      )}
    </>
            <a href="#opportunities" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-md bg-transparent hover:bg-white/10 transition-colors">
              Découvrir nos Opportunités
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="mt-4 flex items-center space-x-6">
           <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
    </svg>
    <span className="ml-2 text-white text-sm">Accompagnement Premium</span>
  </div>
</div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
