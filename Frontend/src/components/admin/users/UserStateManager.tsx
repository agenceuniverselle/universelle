import { useState } from 'react';
import { User, Role } from '@/types/users';
import { UserFormValues } from '@/hooks/useUserManagement';

interface UserStateManagerProps {
  users: User[];
  currentUserRole: Role;
  addUser: (userData: UserFormValues) => Promise<User | undefined>;
  availableRoles: Role[]; // ✅ Liste des rôles passée dynamiquement
}

interface UserStateValues {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  isAddUserDialogOpen: boolean;
  setIsAddUserDialogOpen: (value: boolean) => void;
  activityLogUser: { id: string; name: string } | null;
  setActivityLogUser: (value: { id: string; name: string } | null) => void;
  viewProfileUser: User | null;
  setViewProfileUser: (value: User | null) => void;
  editProfileUser: User | null;
  setEditProfileUser: (value: User | null) => void;
  clearFilters: () => void;
  handleViewActivityLog: (userId: string) => void;
  handleViewProfile: (userId: string) => void;
  handleEditUser: (user: User) => void;
  handleUpdateUser: (userId: string, userData: Partial<User>) => void;
  handleAddUser: (userData: UserFormValues) => Promise<void>;
  availableRoles: Role[];
}

export const UserStateManager = ({ 
  users, 
  currentUserRole,
  addUser,
  availableRoles // ✅ Utilisation directe
}: UserStateManagerProps): UserStateValues => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');

  // Dialog state
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [activityLogUser, setActivityLogUser] = useState<{ id: string; name: string } | null>(null);
  const [viewProfileUser, setViewProfileUser] = useState<User | null>(null);
  const [editProfileUser, setEditProfileUser] = useState<User | null>(null);
 //EDIT
 const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [editDialogOpen, setEditDialogOpen] = useState(false);
  // Handler functions
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('Tous');
    setStatusFilter('Tous');
  };

  const handleViewActivityLog = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActivityLogUser({ id: user.id, name: user.name });
    }
  };

  const handleViewProfile = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setViewProfileUser(user);
    }
  };

  const handleEditUser = (user: User) => {
  setSelectedUser(user);
  setEditDialogOpen(true);
};

  const handleUpdateUser = (userId: string, userData: Partial<User>) => {
    const user = users.find(u => u.id === userId);
    if (user && userData.role && userData.role !== user.role) {
      // La logique de mise à jour réelle est gérée par le composant parent
    }
  };

  const handleAddUser = async (userData: UserFormValues): Promise<void> => {
    await addUser(userData);
  };

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    activityLogUser,
    setActivityLogUser,
    viewProfileUser,
    setViewProfileUser,
    editProfileUser,
    setEditProfileUser,
    clearFilters,
    handleViewActivityLog,
    handleViewProfile,
    handleEditUser,
    handleUpdateUser,
    handleAddUser,
    availableRoles // ✅ Liste dynamique
  };
};
