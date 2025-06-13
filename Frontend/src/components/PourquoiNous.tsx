import React, { useEffect, useState, useRef } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Check, Award, Users, TrendingUp, Clock, Building, MapPin, Star, X, BadgeCheck, ShieldCheck, ChevronRight, ChevronLeft,Phone } from 'lucide-react';
import ContactFormFields from './contact/ContactFormFields';
import axios from 'axios';

const PourquoiNous = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [errorTestimonials, setErrorTestimonials] = useState(null);
  const problems = [
    {
      title: "Retards et malfaçons",
      description: "45% des projets immobiliers non accompagnés subissent des retards de plus de 6 mois"
    },
    {
      title: "Litiges juridiques",
      description: "1 investisseur sur 3 fait face à des problèmes juridiques coûteux"
    },
    {
      title: "Rentabilité décevante",
      description: "Sans expertise, le rendement moyen chute de 8% à 3%"
    }
  ];

  const solutions = [
    {
      feature: "Accompagnement complet 360°",
      advantage: "De l'étude à la livraison",
      benefit: "Vous gagnez 18 mois en moyenne"
    },
    {
      feature: "Réseau de partenaires certifiés",
      advantage: "Architectes, ingénieurs, juristes experts",
      benefit: "Zéro risque de malfaçon ou de litige"
    },
    {
      feature: "Maîtrise du marché marocain",
      advantage: "15 ans d'expérience à Tanger & Marrakech",
      benefit: "Rentabilité garantie supérieure à 8%"
    }
  ];

  const stats = [
    { value: "500+", label: "Investisseurs accompagnés" },
    { value: "98%", label: "Projets livrés à temps" },
    { value: "8.2%", label: "Rendement moyen garanti" },
    { value: "15", label: "Années d'expertise" }
  ];

  const handleFormSuccess = () => {
    setShowContactForm(false);
  };

const projectScrollRef = useRef(null);
const testimonialScrollRef = useRef(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [showLeftArrow, setShowLeftArrow] = useState(false);
const [isScrollable, setIsScrollable] = useState(false);


const updateScrollButtons = () => {
  const container = projectScrollRef.current;
  if (!container) return;

  const { scrollLeft, scrollWidth, clientWidth } = container;

  // Vérifie si on peut scroller
  const isOverflowing = scrollWidth > clientWidth;

  // ✅ Si le contenu déborde ET qu'on a scrollé manuellement
  setShowLeftArrow(isOverflowing && scrollLeft > 10);
};





useEffect(() => {
  const container = projectScrollRef.current;
  if (!container) return;

  updateScrollButtons(); // initial

  container.addEventListener('scroll', updateScrollButtons);
  window.addEventListener('resize', updateScrollButtons); // responsive

  return () => {
    container.removeEventListener('scroll', updateScrollButtons);
    window.removeEventListener('resize', updateScrollButtons);
  };
}, [projects]);

const scrollProjectsLeft = () => {
  const container = projectScrollRef.current;
  if (container) {
    if (container.scrollLeft <= 0) {
      // Si on est tout au début → scroll vers la fin
      container.scrollTo({
        left: container.scrollWidth,
        behavior: 'smooth',
      });
    } else {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }
};

const scrollProjectsRight = () => {
  const container = projectScrollRef.current;
  if (!container) return;

  // on marque qu'on a cliqué pour scroll à droite
  setHasScrolledRight(true);

  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  if (container.scrollLeft >= maxScrollLeft - 10) {
    container.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }
};



const scrollTestimonialsLeft = () => {
  if (testimonialScrollRef.current) {
    testimonialScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollTestimonialsRight = () => {
  if (testimonialScrollRef.current) {
    testimonialScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  }
};

useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('https://back-qhore.ondigitalocean.app/api/testimonials');
setTestimonials(Array.isArray(response.data) ? response.data : response.data?.data || []);
      } catch (err) {
        setErrorTestimonials(err.message);
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);
 useEffect(() => {
  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://back-qhore.ondigitalocean.app/api/projects');

      const raw = response.data;

      const projectList = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setProjects(projectList);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, []);


  return (
    <MainLayout>
      <div className="min-h-screen w-full pt-20">
        {/* Hero Section */}
  <section className="bg-gradient-to-br from-luxe-blue to-luxe-blue/90 text-white py-20">
  <div className="w-full px-4 md:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* Texte à gauche */}
      <div className="text-left">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
          Et si vous pouviez investir dans l'immobilier{' '}
          <span className="gold-gradient">en toute confiance</span>?
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Avec un partenaire qui pense comme un investisseur et agit comme un expert
        </p>

        {/* Statistiques */}
        <div className="flex flex-wrap justify-start gap-6 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="text-left">
              <div className="text-2xl font-bold text-gold">{stat.value}</div>
              <div className="opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Boutons */}
       <div className="flex flex-col sm:flex-row gap-4 mt-10">
  <button
    onClick={() => setShowContactForm(true)}
    className="flex items-center justify-center space-x-2 text-white rounded-md px-5 py-3 transition-all bg-gold hover:bg-gold-dark font-montserrat text-base shadow-md hover:shadow-lg w-full sm:w-[220px]"
  >
    <Phone size={18} />
    <span>Contactez-nous</span>
  </button>

  <a
    href="/investir"
    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-md bg-transparent hover:bg-white/10 transition-colors w-full sm:w-[220px]"
  >
    Investir
  </a>
</div>

      </div>

      {/* Vidéo à droite */}
      <div className="w-full">
        <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-black/20 backdrop-blur-sm border border-white/10">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/LRq7qI4wJU8"
            title="Vidéo de présentation"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

    </div>
  </div>
</section>
 {/* ✅ manquait cette fermeture */}

        {/* Problem Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-6 lg:px-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4">
                Investir dans l'immobilier au Maroc sans <span className="gold-gradient">accompagnement </span>?
              </h2>
              <p className="text-xl text-center text-gray-600 mb-12">
                C'est risquer des <strong>retards coûteux</strong>, des <strong>litiges</strong>, ou une <strong>rentabilité décevante</strong>
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {problems.map((problem, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <h3 className="font-bold text-lg mb-3 text-red-600">{problem.title}</h3>
                    <p className="text-gray-600">{problem.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-lg text-gray-700 italic">
                  "Trop d'investisseurs perdent du temps et de l'argent faute de bons partenaires."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20">
          <div className="container px-6 lg:px-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4">
                Chez <span className="gold-gradient">Universelle</span>, nous transformons
              </h2>
              <p className="text-xl text-center text-gray-600 mb-16">
                chaque projet immobilier en <strong>succès mesurable</strong>
              </p>

              <div className="space-y-12">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/3">
                      <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{solution.feature}</h3>
                      <p className="text-gray-600 mb-4">{solution.advantage}</p>
                    </div>
                    <div className="md:w-2/3 bg-gradient-to-r from-gold/10 to-gold/5 p-6 rounded-lg">
                      <h4 className="font-bold text-lg text-luxe-blue mb-2">Résultat pour vous :</h4>
                      <p className="text-lg">{solution.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-luxe-blue text-white">
          <div className="container px-6 lg:px-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-12">
                Nos Valeurs Fondamentales
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Award className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p>Nous visons l'excellence dans chaque détail, de la conception à la livraison</p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Transparence</h3>
                  <p>Communication claire et honnête à chaque étape de votre projet</p>
                </div>
                <div className="text-center">
                  <ShieldCheck className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Intégrité</h3>
                  <p>Vos intérêts sont nos priorités, toujours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20">
          <div className="container px-6 lg:px-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4">
                Ils nous ont fait confiance
              </h2>
              <p className="text-xl text-center text-gray-600 mb-16">
                Découvrez nos réalisations qui parlent d'elles-mêmes
              </p>

              <div className="relative">
                {/* Left Arrow - Only show if there are projects */}
            {projects.length > 0 && showLeftArrow && (
  <button
    onClick={scrollProjectsLeft}
    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 
             bg-white p-2 rounded-full shadow-md hover:bg-gray-100
             z-10 transition-all"
  >
    <ChevronLeft className="w-6 h-6 text-gray-600" />
  </button>
)}

                
                {/* Projects Container */}
                <div 
                  ref={projectScrollRef}
                  className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4"
                  style={{ scrollbarWidth: 'none' }} // Hide scrollbar for Firefox
                >
                  {loading ? (
                    <div className="flex w-full justify-center py-10">
                      <p>Chargement des projets...</p>
                    </div>
                  ) : error ? (
                    <div className="flex w-full justify-center py-10 text-red-500">
                      <p>Erreur: {error}</p>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="flex w-full justify-center py-10">
                      <p>Aucun projet disponible pour le moment</p>
                    </div>
                  ) : (
                    projects.map((project, index) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 w-80 mx-4 bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all snap-start"
                      >
                        <div className="relative h-48 overflow-hidden">
                          {project.images?.length > 0 && (
                            <img 
                              src={project.images[0]} 
                              alt={project.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              project.status === 'Livré' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{project.location}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{project.type}</p>
                          <p className="font-medium text-luxe-blue mb-2">{project.details}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Building className="w-4 h-4 mr-1" />
                            <span>{project.surface}m²</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Right Arrow - Only show if there are projects */}
                {projects.length > 0 && (
                  <button 
                    onClick={scrollProjectsRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-10 transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
         {/* Testimonial Section - Updated with horizontal scrolling */}
<section className="py-20 bg-gray-50">
  <div className="container px-6 lg:px-10">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-4">
        Ce que nos clients disent
      </h2>
      <p className="text-xl text-center text-gray-600 mb-16">
        Découvrez les expériences de ceux qui nous ont fait confiance
      </p>

      <div className="relative">
        {/* Left Arrow - Only show if there are testimonials */}
        {testimonials.length > 0 && (
          <button 
            onClick={scrollTestimonialsLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-10 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}
        
        {/* Testimonials Container */}
        <div 
          ref={testimonialScrollRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {loadingTestimonials ? (
            <div className="flex w-full justify-center py-10">
              <p>Chargement des témoignages...</p>
            </div>
          ) : errorTestimonials ? (
            <div className="flex w-full justify-center py-10 text-red-500">
              <p>Erreur: {errorTestimonials}</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex w-full justify-center py-10">
              <p>Aucun témoignage disponible pour le moment</p>
            </div>
          ) : (
            testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-96 mx-4 bg-white rounded-lg shadow-lg overflow-hidden p-8 snap-start"
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <cite className="text-lg font-medium text-luxe-blue">
                      {testimonial.name}
                    </cite>
                    {testimonial.fonction && (
                      <p className="text-sm text-gray-500">{testimonial.fonction}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Right Arrow - Only show if there are testimonials */}
        {testimonials.length > 0 && (
          <button 
            onClick={scrollTestimonialsRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-10 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  </div>
</section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gold to-gold-dark text-white">
          <div className="container px-6 lg:px-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
                Prêt à transformer votre vision en succès ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Prenez rendez-vous dès maintenant avec notre équipe d'experts 
                pour découvrir comment nous pouvons donner vie à votre projet
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="bg-white text-gold px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Consultation gratuite
                </button>
                <a 
                  href="/investir" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gold transition-colors"
                >
                  Voir Nos Opportunités
                </a>
              </div>
              <p className="text-sm mt-4 opacity-75">
                ✓ Consultation gratuite • ✓ Étude personnalisée • ✓ Sans engagement
              </p>
            </div>
          </div>
        </section>

        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowContactForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Fermer le formulaire"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-luxe-blue mb-6">Demande de consultation gratuite</h2>
                <ContactFormFields onSuccess={handleFormSuccess} />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PourquoiNous;
