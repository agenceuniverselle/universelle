
import { useState, useEffect } from 'react';
import { Role, User } from '@/types/users';
import { loadUsersFromStorage, saveUsersToStorage } from '@/utils/userStorageUtils';
import { useUserSecurity } from '@/hooks/user/useUserSecurity';
import { useUserDelete } from '@/hooks/user/useUserDelete';
import { useUserFilter } from '@/hooks/user/useUserFilter';
import { Permission } from '@/types/users';

export interface UserFormValues {
  role_id: number;
  name: string;
  email: string;
  phone?: string;
  role?: Role;
  customPermissions?: boolean;
  permissions: string[]; // ✅ tableau de noms, pas d’objets
  sendInvitation: boolean;
  generatePassword?: boolean;
  password?: string;
  requirePasswordChange: boolean;
  enable2FA: boolean;
}

export const useUserManagement = (initialUsers: User[]) => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = loadUsersFromStorage();
    return storedUsers.length > 0 ? storedUsers : initialUsers;
  });
  
  // Save users to storage whenever they change
  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);

  // Use our new modular hooks
  const { resetPassword, resetPasswordManually, toggle2FA } = useUserSecurity(users, setUsers);
  const { deleteUser } = useUserDelete(users, setUsers);
  const { filterUsers } = useUserFilter(users);

  // Return all the functionality from our modular hooks
  return {
    users,
    
    
    resetPassword,
    resetPasswordManually,
    toggle2FA,
    deleteUser,
    filterUsers
  };
  
};
