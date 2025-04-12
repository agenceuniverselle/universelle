
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "L'investissement immobilier au Maroc a transformé mon portefeuille financier. Grâce à l'accompagnement de l'AUII, j'ai pu acquérir une villa à Marrakech qui me rapporte 8% par an, largement au-dessus de mes placements précédents.",
      name: "Philippe Laurent",
      title: "Entrepreneur, Paris",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "Je cherchais un investissement sécurisé à l'étranger. L'équipe de l'AUII m'a guidé de A à Z dans l'acquisition d'un appartement de luxe à Casablanca. Le processus a été fluide et sans stress malgré la distance.",
      name: "Sophie Moreau",
      title: "Directrice Financière, Bruxelles",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "Trois ans après mon premier investissement avec l'AUII, la valeur de mon bien a augmenté de 23% tout en me rapportant des revenus locatifs constants. Je recommande leur expertise sans hésitation.",
      name: "Marc Dupuis",
      title: "Médecin, Lyon",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Ce que disent <span className="gold-gradient">Nos Clients</span>
          </h2>
          <p className="section-subtitle">
            Découvrez les expériences de nos investisseurs qui ont fait confiance à notre expertise pour leur projet immobilier au Maroc.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-gold opacity-30">
            <Quote size={120} />
          </div>
          
          {/* Testimonial carousel */}
          <div className="relative overflow-hidden pb-12">
            <div 
              className="transition-transform duration-500 ease-in-out flex"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-8">
                  <div className="text-center">
                    <p className="text-xl md:text-2xl text-gray-700 italic font-playfair mb-8">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex flex-col items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <h4 className="font-bold text-luxe-blue text-lg">{testimonial.name}</h4>
                      <p className="text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation controls */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index ? 'bg-gold w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Arrows */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full md:-translate-x-12 bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-gold transition-colors"
            onClick={goToPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full md:translate-x-12 bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-gold transition-colors"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
