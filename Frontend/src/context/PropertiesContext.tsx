import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PropertyImage = {
  url: string;
  id: string;
};

export type InvestmentDetails = {
  type: 'Résidentiel' | 'Commercial' | 'Touristique';
  returnRate: string;
  minEntryPrice: string;
  recommendedDuration: string;
  financingEligibility: boolean;
  partners: string[];
  projectStatus: 'Pré-commercialisation' | 'En cours' | 'Terminé';
  documents?: string[];
  investmentType:string;

};

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  bedrooms: number ;
  bathrooms: number ;
  area: string;
  date: string;
  createdAt: string; // Ajout du champ createdAt
  description?: string;
  isFeatured?: boolean;
  return?: string;
  image?: string;
  documents?: string[];
  

  images?: PropertyImage[];
  isDraft?: boolean;
  isInvestment?: boolean;
  investmentDetails?: InvestmentDetails;
};

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  removeProperty: (id: string) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  getPropertyById: (id: string) => Property | undefined;
  publishProperty: (id: string) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);
// eslint-disable-next-line react-hooks/rules-of-hooks

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};

interface PropertiesProviderProps {
  children: ReactNode;
}

export const PropertiesProvider: React.FC<PropertiesProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const savedProperties = localStorage.getItem('immobilierProperties');
    if (savedProperties) {
      try {
        setProperties(JSON.parse(savedProperties));
      } catch (error) {
        console.error('Erreur lors du chargement des propriétés:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('immobilierProperties', JSON.stringify(properties));
  }, [properties]);

  const addProperty = (property: Property) => {
    if (!property.id) {
      const prefix = property.isInvestment ? 'I' : 'P';
      property.id = prefix + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }

    if (!property.date) {
      const today = new Date();
      property.date = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    }

    if (!property.return) {
      const randomReturn = (5 + Math.random() * 5).toFixed(1);
      property.return = `${randomReturn}%`;
    }

   

    setProperties(prev => [property, ...prev]);
  };

  const removeProperty = (id: string) => {
    setProperties(prev => prev.filter(property => property.id !== id));
  };

  const updateProperty = (id: string, updatedProperty: Partial<Property>) => {
    setProperties(prev =>
      prev.map(property =>
        property.id === id ? { ...property, ...updatedProperty } : property
      )
    );
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const publishProperty = (id: string) => {
    updateProperty(id, { isDraft: false });
  };

  return (
    <PropertiesContext.Provider value={{ properties, addProperty, removeProperty, updateProperty, getPropertyById, publishProperty }}>
      {children}
    </PropertiesContext.Provider>
  );
};
