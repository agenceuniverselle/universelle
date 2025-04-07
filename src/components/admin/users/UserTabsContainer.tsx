
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RolePermissionManager } from '@/components/admin/users/RolePermissionManager';
import { UserFilters } from '@/components/admin/users/UserFilters';
import { UserTable } from '@/components/admin/users/UserTable';
import { User, Role, RoleDefinition } from '@/types/users';
import { useToast } from '@/hooks/use-toast';

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
  onAddUserClick: () => void;
  onViewProfile: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: Role) => void;
  onUpdateUserStatus: (userId: string, newStatus: 'Active' | 'Inactive') => void;
  onResetPassword: (userId: string) => void;
  onResetPasswordManually: (userId: string, password: string, options: { forceChange: boolean; sendEmail: boolean }) => void;
  onToggle2FA: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onViewActivityLog: (userId: string) => void;
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
  onAddUserClick,
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
  const [activeTab, setActiveTab] = React.useState('users');
  const { toast } = useToast();
  
  const handleSaveRoles = (roles: RoleDefinition[]) => {
    console.log('Saving roles:', roles);
    toast({
      title: "Rôles et permissions mis à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles & Permissions</TabsTrigger>
        </TabsList>
        
        {activeTab === 'users' && (
          <Button 
            className="bg-luxe-blue hover:bg-luxe-blue/90"
            onClick={onAddUserClick}
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
        <RolePermissionManager onSave={handleSaveRoles} />
      </TabsContent>
    </Tabs>
  );
};
