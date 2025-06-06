import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RolePermissionManager } from '@/components/admin/users/RolePermissionManager';
import { UserFilters } from '@/components/admin/users/UserFilters';
import { UserTable } from '@/components/admin/users/UserTable';
import { AddUserDialog } from '@/components/admin/users/AddUserDialog';
import { User, Role } from '@/types/users';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // ✅ Importer AuthContext
import { UserFormValues } from '@/hooks/useUserManagement';


interface UserTabsContainerProps {
  users: User[];
  currentUserRole: Role;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onViewProfile: (userId: string) => void;
  onEditUser: (user: User) => void;
  onUpdateUserRole: (userId: string, newRole: Role) => void;
  onUpdateUserStatus: (userId: string, newStatus: 'Active' | 'Inactive') => void;
  onResetPassword: (userId: string) => void;
  onResetPasswordManually: (userId: string, password: string, options: { forceChange: boolean; sendEmail: boolean }) => void;
  onToggle2FA: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onViewActivityLog: (userId: string) => void;
  onAddUserClick: () => void;


}


export const UserTabsContainer: React.FC<UserTabsContainerProps> = ({
  users,
  currentUserRole,
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  onViewProfile,
  onEditUser,
  onUpdateUserRole,
  onUpdateUserStatus,
  onResetPassword,
  onResetPasswordManually,
  onToggle2FA,
  onDeleteUser,
  onViewActivityLog,
}) => {
  const [activeTab, setActiveTab] = useState('users');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const { toast } = useToast();
  const { permissions } = useAuth(); // ✅ Récupérer les permissions de l'utilisateur connecté

  useEffect(() => {
    fetchRoles();
  }, []);

  // ✅ Vérifier si l'utilisateur a la permission de créer des utilisateurs
  const canCreateUsers = permissions.includes('create_users');

  // ✅ Récupérer les rôles
  const fetchRoles = async () => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour accéder aux rôles.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.get("https://back-qhore.ondigitalocean.app/api/admin/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data.roles);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les rôles.",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async (userData: UserFormValues) => {
  const token = localStorage.getItem("access_token");
  
  if (!token) {
    toast({
      title: "Erreur",
      description: "Vous devez être connecté pour ajouter un utilisateur.",
      variant: "destructive",
    });
    return;
  }

  // Si password est obligatoire côté backend, vérifie avant en front :
  if (!userData.password) {
    toast({
      title: "Erreur",
      description: "Le mot de passe est obligatoire.",
      variant: "destructive",
    });
    return;
  }

  try {
    await axios.post('https://back-qhore.ondigitalocean.app/api/admin/users', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast({
      title: "Utilisateur ajouté",
      description: "L'utilisateur a été créé avec succès.",
    });
    setIsAddUserDialogOpen(false);
  } catch (error) {
    toast({
      title: "Erreur",
      description: "Impossible de créer l'utilisateur.",
      variant: "destructive",
    });
  }
};
  
 return (
  <>
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <TabsList className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-md p-1 transition-all duration-200">
          <TabsTrigger
            value="users"
            className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-600 data-[state=active]:text-black data-[state=active]:dark:text-white"
          >
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-600 data-[state=active]:text-black data-[state=active]:dark:text-white"
          >
            Rôles & Permissions
          </TabsTrigger>
        </TabsList>

        {activeTab === "users" && canCreateUsers && (
          // Afficher uniquement si l'utilisateur a la permission
          <Button
            className="bg-luxe-blue hover:bg-luxe-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => setIsAddUserDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        )}
      </div>

      <TabsContent value="users" className="space-y-4">
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={onRoleFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          onClearFilters={onClearFilters}
        />

        <UserTable
          users={users}
          currentUserRole={currentUserRole}
          onViewProfile={onViewProfile}
          onEditUser={onEditUser}
          onChangeRole={onUpdateUserRole}
          onToggleStatus={onUpdateUserStatus}
          onResetPassword={onResetPassword}
          onResetPasswordManually={onResetPasswordManually}
          onToggle2FA={onToggle2FA}
          onDelete={onDeleteUser}
          onViewActivityLog={onViewActivityLog}
        />
      </TabsContent>

      <TabsContent value="roles">
        <RolePermissionManager />
      </TabsContent>
    </Tabs>

    {/* Add User Dialog */}
    <AddUserDialog
      open={isAddUserDialogOpen}
      onClose={() => setIsAddUserDialogOpen(false)}
      onAdd={handleAddUser}
      isLoading={false}
  availableRoles={roles ?? []} // Toujours un tableau
    />
  </>
);
}
