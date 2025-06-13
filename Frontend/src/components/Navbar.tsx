import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Phone, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Contact from "@/components/Contact";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVipForm, setShowVipForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleWhyUsClick = () => {
    navigate('/PourquoiNous');
    setIsMobileMenuOpen(false);
  };

  const openVipForm = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      setTimeout(() => setShowVipForm(true), 300); // attendre la fermeture du menu mobile
    } else {
      setShowVipForm(true);
    }
  };

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

  const getMobileLinkClasses = (path: string) => {
    const isActivePath = isActive(path);
    return cn(
      "py-4 text-xl w-full text-center font-semibold font-montserrat border-b",
      isActivePath ? "text-gold-light border-gold-light/30" : "text-white border-white/10"
    );
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 px-6 lg:px-10 isolate",
        isScrolled || !isHomePage
          ? "bg-white/90 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={
                isScrolled || !isHomePage
                  ? "/lovable-uploads/b0e4a27b-2509-4821-89c9-8d609c342f4d.png"
                  : "/lovable-uploads/37ca5075-6512-4b7c-a62a-fe0e20d523d6.png"
              }
              alt="Logo"
              className="h-14 md:h-18"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={getLinkClasses('/')}>Accueil</Link>
            <Link to="/investir" className={getLinkClasses('/investir')}>Investir</Link>
            <Link to="/nos-biens" className={getLinkClasses('/nos-biens')}>Nos Biens</Link>
            <Link to="/nos-services" className={getLinkClasses('/nos-services')}>Nos Services</Link>
            <Link to="/PourquoiNous" onClick={handleWhyUsClick} className={getLinkClasses('/PourquoiNous')}>Pourquoi Nous</Link>
            <Link to="/blog" className={getLinkClasses('/blog')}>Articles</Link>
            <button
              onClick={openVipForm}
              className="flex items-center space-x-2 text-white rounded-md px-5 py-3 transition-all bg-gold hover:bg-gold-dark font-montserrat text-base shadow-md hover:shadow-lg"
            >
              <Phone size={18} />
              <span>Contact VIP</span>
            </button>
          </div>

          {/* Mobile nav */}
          {isMobile && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex flex-col space-y-1.5 p-2 rounded bg-gold/10">
                  <Menu className={isScrolled || !isHomePage ? "text-luxe-blue" : "text-white"} size={24} />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="bg-luxe-blue/95 border-none p-0 w-full sm:w-[350px] h-screen flex flex-col z-[40]">
                <SheetHeader className="px-8 py-6 flex justify-between items-center border-b border-white/10">
                  <SheetTitle className="sr-only">Menu de Navigation</SheetTitle>
                  <SheetDescription className="sr-only">Navigation principale</SheetDescription>
                  <img src="/lovable-uploads/37ca5075-6512-4b7c-a62a-fe0e20d523d6.png" alt="Logo" className="h-16" />
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4">
                  <div className="container px-8 flex flex-col space-y-2 items-center">
                    <Link to="/" className={getMobileLinkClasses('/')} onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link>
                    <Link to="/investir" className={getMobileLinkClasses('/investir')} onClick={() => setIsMobileMenuOpen(false)}>Investir</Link>
                    <Link to="/nos-biens" className={getMobileLinkClasses('/nos-biens')} onClick={() => setIsMobileMenuOpen(false)}>Nos Biens</Link>
                    <Link to="/nos-services" className={getMobileLinkClasses('/nos-services')} onClick={() => setIsMobileMenuOpen(false)}>Nos Services</Link>
                    <Link to="/PourquoiNous" className={getMobileLinkClasses('/PourquoiNous')} onClick={handleWhyUsClick}>Pourquoi Nous</Link>
                    <Link to="/blog" className={getMobileLinkClasses('/blog')} onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10">
                  <button
                    onClick={openVipForm}
                    className="flex items-center justify-center w-full space-x-2 text-white rounded-md px-5 py-4 transition-all bg-gold hover:bg-gold-dark font-montserrat shadow-lg"
                  >
                    <Phone size={20} />
                    <span className="font-semibold">Contact VIP</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>

      {/* Modal Contact VIP */}
      {showVipForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[999998]" onClick={() => setShowVipForm(false)} />
          <div className="fixed left-1/2 -translate-x-1/2 top-[80px] z-[999999] w-full max-w-xl p-6 bg-white rounded-lg shadow-2xl border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-luxe-blue">Contact VIP</h2>
              <button className="text-gray-500 hover:text-red-500" onClick={() => setShowVipForm(false)}>
                <X size={18} />
              </button>
            </div>
            <Contact onSuccess={() => setShowVipForm(false)} />
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
