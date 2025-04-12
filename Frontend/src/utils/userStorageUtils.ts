
import { User } from '@/types/users';

/**
 * Loads users from localStorage or returns an empty array
 */
export const loadUsersFromStorage = (): User[] => {
  const storedUsers = localStorage.getItem('appUsers');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

/**
 * Saves users to localStorage
 */
export const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem('appUsers', JSON.stringify(users));
  console.log("Utilisateurs sauvegardés dans localStorage:", users);
};
