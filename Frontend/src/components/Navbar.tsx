
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Phone, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isMobile = useIsMobile();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to determine if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Function to handle "Pourquoi Nous" navigation
  const handleWhyUsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      // If already on home page, just scroll to the section
      const element = document.getElementById('why-choose-us');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home and then scroll to section
      navigate('/', { state: { scrollTo: 'why-choose-us' } });
    }
    setIsMobileMenuOpen(false);
  };

  // Function to get the appropriate classes for a navigation link
  const getLinkClasses = (path: string) => {
    const isActivePath = isActive(path);
    
    return cn(
      "font-semibold text-base font-montserrat tracking-wide transition-all border-b-2",
      isScrolled || !isHomePage
        ? isActivePath
          ? "text-gold border-gold" 
          : "text-luxe-blue hover:text-gold border-transparent hover:border-gold"
        : isActivePath
          ? "text-gold-light border-gold-light"
          : "text-white hover:text-gold-light border-transparent hover:border-gold-light"
    );
  };

  // Mobile menu link classes
  const getMobileLinkClasses = (path: string) => {
    const isActivePath = isActive(path);
    return cn(
      "py-4 text-xl w-full text-center font-semibold font-montserrat border-b",
      isActivePath ? "text-gold-light border-gold-light/30" : "text-white border-white/10"
    );
  };
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 px-6 lg:px-10",
      isScrolled || !isHomePage
        ? "bg-white/90 backdrop-blur-sm shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            {isScrolled || !isHomePage ? (
              <img 
                src="/lovable-uploads/b0e4a27b-2509-4821-89c9-8d609c342f4d.png"
                alt="Agence Universelle d'Investissement Immobilier"
                className="h-14 md:h-18"
              />
            ) : (
              <img 
                src="/lovable-uploads/37ca5075-6512-4b7c-a62a-fe0e20d523d6.png"
                alt="Agence Universelle d'Investissement Immobilier" 
                className="h-14 md:h-18"
              />
            )}
          </a>
        </div>
        
        {/* Desktop menu - unchanged */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className={getLinkClasses('/')}>Accueil</Link>
          <Link to="/investir" className={getLinkClasses('/investir')}>Investir</Link>
          <Link to="/nos-biens" className={getLinkClasses('/nos-biens')}>Nos Biens</Link>
          <Link to="/nos-services" className={getLinkClasses('/nos-services')}>Nos Services</Link>
          <Link to="/admin" className={getLinkClasses('/admin')}>Admin</Link>

          <a 
            href="#why-choose-us" 
            onClick={handleWhyUsClick}
            className={cn(
              "font-semibold text-base font-montserrat tracking-wide transition-all border-b-2",
              isScrolled || !isHomePage
                ? "text-luxe-blue hover:text-gold border-transparent hover:border-gold" 
                : "text-white hover:text-gold-light border-transparent hover:border-gold-light"
            )}
          >
            Pourquoi Nous
          </a>
          <Link to="/blog" className={getLinkClasses('/blog')}>Blog</Link>
          <a 
            href="#contact" 
            className="flex items-center space-x-2 text-white rounded-md px-5 py-3 transition-all bg-gold hover:bg-gold-dark font-montserrat text-base shadow-md hover:shadow-lg"
          >
            <Phone size={18} />
            <span>Contact VIP</span>
          </a>
        </div>
        
        {/* Mobile menu button - now using Sheet from shadcn */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <button 
                className="lg:hidden flex flex-col space-y-1.5 p-2 rounded bg-gold/10"
                aria-label="Toggle menu"
              >
                <Menu className={isScrolled || !isHomePage ? "text-luxe-blue" : "text-white"} size={24} />
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right"
              className="bg-luxe-blue/95 backdrop-blur-md border-none p-0 w-full sm:w-[350px] pt-24"
            >
              <div className="container px-8 py-6 flex flex-col space-y-8 items-center">
                <div className="mb-6">
                  <img 
                    src="/lovable-uploads/37ca5075-6512-4b7c-a62a-fe0e20d523d6.png" 
                    alt="Agence Universelle d'Investissement Immobilier" 
                    className="h-16 mx-auto"
                  />
                </div>
                
                <Link 
                  to="/" 
                  className={getMobileLinkClasses('/')}
                >
                  Accueil
                </Link>
                <Link 
                  to="/investir" 
                  className={getMobileLinkClasses('/investir')}
                >
                  Investir
                </Link>
                <Link 
                  to="/nos-biens" 
                  className={getMobileLinkClasses('/nos-biens')}
                >
                  Nos Biens
                </Link>
                <Link 
                  to="/nos-services" 
                  className={getMobileLinkClasses('/nos-services')}
                >
                  Nos Services
                </Link>
                <a 
                  href="#why-choose-us"
                  onClick={handleWhyUsClick}
                  className="text-white py-4 text-xl w-full text-center font-semibold font-montserrat border-b border-white/10"
                >
                  Pourquoi Nous
                </a>
                <Link 
                  to="/blog" 
                  className={getMobileLinkClasses('/blog')}
                >
                  Blog
                </Link>
                <a 
                  href="#contact" 
                  className="flex items-center justify-center w-full space-x-2 text-white rounded-md px-5 py-4 transition-all bg-gold hover:bg-gold-dark font-montserrat shadow-lg mt-6"
                >
                  <Phone size={20} />
                  <span className="font-semibold">Contact VIP</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
