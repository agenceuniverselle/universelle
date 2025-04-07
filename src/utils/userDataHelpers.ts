
import { User } from '@/types/users';

export const loadInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem('appUsers');
  if (storedUsers && JSON.parse(storedUsers).length > 0) {
    return JSON.parse(storedUsers);
  }
  
  // Utilisateurs par défaut si localStorage est vide
  return [
    {
      id: 'U001',
      name: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      role: 'Acheteur',
      status: 'Active',
      lastLogin: '12/03/2024',
      registeredDate: '15/06/2023',
    },
    {
      id: 'U002',
      name: 'Alexandre Dupont',
      email: 'alex.dupont@example.com',
      role: 'Commercial',
      status: 'Active',
      lastLogin: '14/03/2024',
      registeredDate: '05/03/2022',
    },
    {
      id: 'U003',
      name: 'Marie Leclerc',
      email: 'marie.leclerc@example.com',
      role: 'Acheteur',
      status: 'Inactive',
      lastLogin: '23/02/2024',
      registeredDate: '12/09/2023',
    },
    {
      id: 'U004',
      name: 'Thomas Bernard',
      email: 'thomas.bernard@example.com',
      role: 'Administrateur',
      status: 'Active',
      lastLogin: '15/03/2024',
      registeredDate: '01/01/2022',
    },
    {
      id: 'U005',
      name: 'Laure Petit',
      email: 'laure.petit@example.com',
      role: 'Acheteur',
      status: 'En attente',
      lastLogin: '-',
      registeredDate: '14/03/2024',
    },
    {
      id: 'U006',
      name: 'Jean Durand',
      email: 'jean.durand@example.com',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: '15/03/2024',
      registeredDate: '01/01/2022',
    },
    {
      id: 'U007',
      name: 'Sarah Moreau',
      email: 'sarah.moreau@example.com',
      role: 'Gestionnaire CRM',
      status: 'Active',
      lastLogin: '15/03/2024',
      registeredDate: '05/05/2023',
      twoFactorEnabled: true
    },
    {
      id: 'U008',
      name: 'Paul Lefebvre',
      email: 'paul.lefebvre@example.com',
      role: 'Investisseur',
      status: 'Active',
      lastLogin: '14/03/2024',
      registeredDate: '22/11/2023',
    },
  ];
};
