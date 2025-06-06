// context/BiensContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

export type Bien = {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  bedrooms: number; 
  bathrooms: number;
  area: string;
  date: string;
  description?: string;
  images?:PropertyImage[];
  isDraft?: boolean;
  createdAt: string;
  quartier?: string;
};
export type PropertyImage = {
  id: string; // ✅ L'identifiant de chaque image
  url: string; // ✅ L'URL de l'image
};
interface BiensContextType {
  biens: Bien[];
  loading: boolean;
  error: string | null;
  addBien: (bien: Bien) => void;
  removeBien: (id: string) => void;
  updateBien: (id: string, bien: Partial<Bien>) => void;
  getBienById: (id: string) => Bien | undefined;
  publishBien: (id: string) => void;
}

const BiensContext = createContext<BiensContextType | undefined>(undefined);

export const useBiens = () => {
  const context = useContext(BiensContext);
  if (!context) {
    throw new Error('useBiens must be used within a BiensProvider');
  }
  return context;
};

export const BiensProvider = ({ children }: { children: ReactNode }) => {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Charger les biens depuis l'API
  useEffect(() => {
    axios.get('https://universelle-backend-4u6cw.ondigitalocean.app/api/biens')
      .then(response => {
        setBiens(response.data.data || []);
      })
      .catch(() => {
        setError("Erreur lors du chargement des biens");
      })
      .finally(() => setLoading(false));
  }, []);

  const addBien = (bien: Bien) => {
    setBiens(prev => [bien, ...prev]);
  };

  const removeBien = (id: string) => {
    setBiens(prev => prev.filter(bien => bien.id !== id));
  };

  const updateBien = (id: string, updated: Partial<Bien>) => {
    setBiens(prev =>
      prev.map(bien =>
        bien.id === id ? { ...bien, ...updated } : bien
      )
    );
  };

  const getBienById = (id: string) =>
    biens.find(bien => String(bien.id) === String(id));
  
  const publishBien = (id: string) => {
    updateBien(id, { isDraft: false });
  };

  return (
    <BiensContext.Provider value={{ biens, loading, error, addBien, removeBien, updateBien, getBienById, publishBien }}>
      {children}
    </BiensContext.Provider>
  );
};
