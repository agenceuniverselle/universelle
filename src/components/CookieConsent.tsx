
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    // Check if consent has been given before
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      // If no consent has been given, show the banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
    localStorage.setItem('cookieConsent', 'full');
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    setPreferences({
      necessary: true, // Necessary cookies are always accepted
      analytics: false,
      marketing: false,
      preferences: false
    });
    localStorage.setItem('cookieConsent', 'necessary');
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 font-playfair">Politique de Cookies</h3>
            <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. Certains cookies sont nécessaires au fonctionnement du site, tandis que d'autres nous aident à comprendre comment vous l'utilisez.
            </p>
            <div className="text-sm text-gray-500">
              Pour plus d'informations, veuillez consulter notre <Link to="/politique-des-cookies" className="text-gold hover:underline">Politique de Cookies</Link>.
            </div>
          </div>
          
          {isDetailOpen && (
            <div className="mb-6 border rounded-md divide-y">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cookies nécessaires</h4>
                  <p className="text-sm text-gray-500">Ces cookies sont indispensables au fonctionnement du site.</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={preferences.necessary} 
                    disabled 
                    className="accent-gold h-5 w-5 cursor-not-allowed opacity-60" 
                  />
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cookies analytiques</h4>
                  <p className="text-sm text-gray-500">Nous aident à comprendre comment vous utilisez notre site.</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics} 
                    onChange={() => handleTogglePreference('analytics')} 
                    className="accent-gold h-5 w-5 cursor-pointer" 
                  />
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cookies marketing</h4>
                  <p className="text-sm text-gray-500">Utilisés pour vous présenter des publicités pertinentes.</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing} 
                    onChange={() => handleTogglePreference('marketing')} 
                    className="accent-gold h-5 w-5 cursor-pointer" 
                  />
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cookies de préférences</h4>
                  <p className="text-sm text-gray-500">Permettent au site de se souvenir de vos préférences.</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={preferences.preferences} 
                    onChange={() => handleTogglePreference('preferences')} 
                    className="accent-gold h-5 w-5 cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsDetailOpen(!isDetailOpen)}
              className="border-gray-300 text-gray-700"
            >
              {isDetailOpen ? 'Masquer les détails' : 'Personnaliser'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRejectAll}
              className="border-gray-300 text-gray-700"
            >
              Refuser tout
            </Button>
            
            {isDetailOpen ? (
              <Button onClick={handleSavePreferences} className="bg-gold hover:bg-gold-dark text-white">
                Enregistrer les préférences
              </Button>
            ) : (
              <Button onClick={handleAcceptAll} className="bg-gold hover:bg-gold-dark text-white">
                Accepter tout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
