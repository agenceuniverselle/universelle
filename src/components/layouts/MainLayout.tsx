
import React from 'react';
import Navbar from '@/components/Navbar';
import CookieConsent from '@/components/CookieConsent';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">À propos</h3>
              <p className="text-sm text-gray-600">
                Agence Universelle d'Investissement Immobilier - Votre partenaire de confiance pour l'investissement immobilier au Maroc.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-sm text-gray-600 hover:text-primary transition-colors">Accueil</a></li>
                <li><a href="/nos-biens" className="text-sm text-gray-600 hover:text-primary transition-colors">Nos Biens</a></li>
                <li><a href="/investir" className="text-sm text-gray-600 hover:text-primary transition-colors">Investir</a></li>
                <li><a href="/nos-services" className="text-sm text-gray-600 hover:text-primary transition-colors">Nos Services</a></li>
                <li><a href="/blog" className="text-sm text-gray-600 hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="/mentions-legales" className="text-sm text-gray-600 hover:text-primary transition-colors">Mentions Légales</a></li>
                <li><a href="/conditions-generales-de-vente" className="text-sm text-gray-600 hover:text-primary transition-colors">CGV</a></li>
                <li><a href="/politique-de-confidentialite" className="text-sm text-gray-600 hover:text-primary transition-colors">Confidentialité</a></li>
                <li><a href="/politique-des-cookies" className="text-sm text-gray-600 hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <address className="not-italic text-sm text-gray-600 space-y-2">
                <p>123 Avenue Mohammed V</p>
                <p>Casablanca, Maroc</p>
                <p>Email: contact@agenceuniverselle.com</p>
                <p>Tel: +212 522 123 456</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Agence Universelle d'Investissement Immobilier. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default MainLayout;
