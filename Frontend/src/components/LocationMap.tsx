// components/LocationMap.tsx
import React from 'react';

const LocationMap: React.FC = () => {
  return (
    <div className="w-full h-[400px]">
      <iframe
        title="Agence Universelle Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.7545500527544!2d-5.858522890366615!3d35.732254572456455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89f82850a1584391%3A0xb5869d5e02b0f5d9!2sAgence%20universelle!5e0!3m2!1sfr!2sma!4v1746552708093!5m2!1sfr!2sma" 
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default LocationMap;
