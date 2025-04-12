
import React from 'react';
import Navbar from '@/components/Navbar';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TableOfContentsItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  tableOfContents?: TableOfContentsItem[];
}

const LegalLayout = ({ children, title, subtitle, tableOfContents }: LegalLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const legalPages = [
    { path: '/mentions-legales', name: 'Mentions Légales' },
    { path: '/conditions-generales-de-vente', name: 'CGV' },
    { path: '/politique-de-confidentialite', name: 'Politique de Confidentialité' },
    { path: '/politique-des-cookies', name: 'Cookies' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16 bg-luxe-blue">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">{title}</h1>
          {subtitle && <p className="text-lg text-white/80 max-w-3xl font-montserrat">{subtitle}</p>}
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-playfair text-xl font-bold text-luxe-blue mb-6">Pages Légales</h3>
              <nav className="space-y-2 mb-8">
                {legalPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className={cn(
                      "block py-2 px-3 rounded-md transition-colors font-montserrat",
                      currentPath === page.path 
                        ? "bg-gold/10 text-gold font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {page.name}
                  </Link>
                ))}
              </nav>
              
              {tableOfContents && tableOfContents.length > 0 && (
                <>
                  <h3 className="font-playfair text-lg font-bold text-luxe-blue mb-4">Sommaire</h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block py-1.5 px-3 text-sm text-gray-600 hover:text-gold transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
