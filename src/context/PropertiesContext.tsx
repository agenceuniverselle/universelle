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
};

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  bedrooms: number | string;
  bathrooms: number | string;
  area: string;
  date: string;
  description?: string;
  isFeatured?: boolean;
  return?: string;
  image?: string;
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
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 'P001',
      title: 'Villa de luxe avec piscine',
      location: 'Casablanca',
      price: '5,200,000 MAD',
      type: 'Villa',
      status: 'Disponible',
      bedrooms: 5,
      bathrooms: 4,
      area: '450 m²',
      date: '15/03/2024',
      return: '7.5%',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop'
    },
    {
      id: 'P002',
      title: 'Appartement vue mer',
      location: 'Rabat',
      price: '2,800,000 MAD',
      type: 'Appartement',
      status: 'Réservé',
      bedrooms: 3,
      bathrooms: 2,
      area: '120 m²',
      date: '10/03/2024',
      return: '6.8%',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'P003',
      title: 'Bureau open space centre-ville',
      location: 'Tanger',
      price: '4,500,000 MAD',
      type: 'Bureau',
      status: 'Vendu',
      bedrooms: 0,
      bathrooms: 2,
      area: '250 m²',
      date: '05/03/2024',
      return: '8.2%',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'P004',
      title: 'Riad traditionnel',
      location: 'Marrakech',
      price: '3,950,000 MAD',
      type: 'Riad',
      status: 'Disponible',
      bedrooms: 6,
      bathrooms: 6,
      area: '320 m²',
      date: '01/03/2024',
      return: '6.5%',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'P005',
      title: 'Terrain constructible',
      location: 'Agadir',
      price: '1,200,000 MAD',
      type: 'Terrain',
      status: 'Disponible',
      bedrooms: 0,
      bathrooms: 0,
      area: '1000 m²',
      date: '28/02/2024',
      return: '9.0%',
      image: 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?q=80&w=2069&auto=format&fit=crop'
    },
    {
      id: 'P006',
      title: 'Penthouse de Luxe',
      location: 'Casablanca, Marina',
      price: '11,800,000 MAD',
      type: 'Appartement',
      status: 'Disponible',
      bedrooms: 4,
      bathrooms: 3,
      area: '300 m²',
      date: '20/02/2024',
      return: '7.2%',
      image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2071&auto=format&fit=crop'
    },
    {
      id: 'I001',
      title: 'Complexe Résidentiel Horizon',
      location: 'Casablanca, Anfa',
      price: '2,500,000 MAD',
      type: 'Appartement',
      status: 'Disponible',
      bedrooms: 2,
      bathrooms: 2,
      area: '95 m²',
      date: '15/03/2024',
      return: '8.5%',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2070&auto=format&fit=crop',
      isInvestment: true,
      investmentDetails: {
        type: 'Résidentiel',
        returnRate: '8.5%',
        minEntryPrice: '500,000 MAD',
        recommendedDuration: '5-7 ans',
        financingEligibility: true,
        partners: ['Groupe Immobilier Atlas', 'Banque Populaire'],
        projectStatus: 'En cours',
      }
    },
    {
      id: 'I002',
      title: 'Centre Commercial Al Mazar',
      location: 'Marrakech',
      price: '3,800,000 MAD',
      type: 'Commerce',
      status: 'Disponible',
      bedrooms: 0,
      bathrooms: 2,
      area: '120 m²',
      date: '10/03/2024',
      return: '9.2%',
      image: 'https://images.unsplash.com/photo-1586052188846-6800be5042c0?q=80&w=2148&auto=format&fit=crop',
      isInvestment: true,
      investmentDetails: {
        type: 'Commercial',
        returnRate: '9.2%',
        minEntryPrice: '1,000,000 MAD',
        recommendedDuration: '8-10 ans',
        financingEligibility: true,
        partners: ['Groupe Al Omrane', 'Attijariwafa Bank'],
        projectStatus: 'Pré-commercialisation',
      }
    }
  ]);

  useEffect(() => {
    // On pourrait charger les propriétés depuis le localStorage au démarrage
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
    // Sauvegarder les propriétés dans le localStorage à chaque modification
    localStorage.setItem('immobilierProperties', JSON.stringify(properties));
  }, [properties]);

  const addProperty = (property: Property) => {
    // Générer un ID au format PXX si non fourni ou au format IXX si c'est un investissement
    if (!property.id) {
      const prefix = property.isInvestment ? 'I' : 'P';
      property.id = prefix + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    
    // Ajouter la date d'aujourd'hui au format JJ/MM/AAAA si non fournie
    if (!property.date) {
      const today = new Date();
      property.date = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    }
    
    // Générer un rendement aléatoire si non fourni
    if (!property.return) {
      const randomReturn = (5 + Math.random() * 5).toFixed(1);
      property.return = `${randomReturn}%`;
    }
    
    // Si pas d'image fournie, utiliser une image par défaut selon le type
    if (!property.image) {
      const imageMap: {[key: string]: string} = {
        'Appartement': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
        'Villa': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
        'Maison': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        'Riad': 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?q=80&w=2069&auto=format&fit=crop',
        'Bureau': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
        'Terrain': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2032&auto=format&fit=crop',
        'Commerce': 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop'
      };
      
      property.image = imageMap[property.type as string] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop';
    }
    
    setProperties((prevProperties) => [property, ...prevProperties]);
  };

  const removeProperty = (id: string) => {
    setProperties((prevProperties) => prevProperties.filter((property) => property.id !== id));
  };

  const updateProperty = (id: string, updatedProperty: Partial<Property>) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, ...updatedProperty } : property
      )
    );
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const publishProperty = (id: string) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, isDraft: false, status: 'Disponible' } : property
      )
    );
  };

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        addProperty,
        removeProperty,
        updateProperty,
        getPropertyById,
        publishProperty
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};
