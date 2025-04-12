
import { User } from '@/types/users';

/**
 * Hook for user filtering operations
 */
export const useUserFilter = (users: User[]) => {
  const filterUsers = (
    searchTerm: string,
    roleFilter: string,
    statusFilter: string
  ) => {
    return users.filter(user => {
      const matchesSearch = 
        searchTerm === '' ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'Tous' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'Tous' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  return { filterUsers };
};
