
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
                <a href="https://www.facebook.com/share/1QrqWhazuq/?mibextid=qi2Omg" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/agenceuniverselle/" className="text-gray-500 hover:text-pink-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://www.linkedin.com/company/agence-universelle/" className="text-gray-500 hover:text-blue-500 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="https://x.com/agenceuniver" className="w-6 h-6 hover:opacity-80 transition" aria-label="X (ancien Twitter)">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <polygon fill="#616161" points="41,6 9.929,42 6.215,42 37.287,6" />
      <polygon fill="#fff" fillRule="evenodd" points="31.143,41 7.82,7 16.777,7 40.1,41" clipRule="evenodd" />
      <path fill="#616161" d="M15.724,9l20.578,30h-4.106L11.618,9H15.724 M17.304,6H5.922l24.694,36h11.382L17.304,6L17.304,6z" />
    </svg>
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
                <p> IMM17 N°9 Touzine, Complexe Bayt Laatik, Tanger 90000</p>
                <p>Tanger, Maroc</p>
                <p>Email:contact@universelle.ma</p>
                <p>Tel: +212 808604195</p>
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
