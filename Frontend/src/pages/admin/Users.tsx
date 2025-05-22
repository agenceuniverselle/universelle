import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { UserTabsContainer } from '@/components/admin/users/UserTabsContainer';
import { AddUserDialog } from '@/components/admin/users/AddUserDialog';
import { ActivityLogDialog } from '@/components/admin/users/ActivityLogDialog';
import { UserProfileDialog } from '@/components/admin/users/UserProfileDialog';
import { UserEditDialog } from '@/components/admin/users/UserEditDialog';
import { loadInitialUsers } from '@/utils/userDataHelpers';
import { useAuth } from '@/context/AuthContext';
import { UserFormValues } from '@/hooks/useUserManagement';

const AdminUsers = () => {
  const { user, permissions, loading: authLoading } = useAuth();

  const [users, setUsers] = useState(loadInitialUsers());

  // Etats pour filtres et dialogues
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [activityLogUser, setActivityLogUser] = useState(null);
  const [viewProfileUser, setViewProfileUser] = useState(null);
  const [editProfileUser, setEditProfileUser] = useState(null);

  // Filtrer les users selon les critères
  const filterUsers = (search: string, role: string, status: string) => {
    return users.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = role ? u.role.name === role : true;
      const matchesStatus = status ? u.status === status : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const filteredUsers = filterUsers(searchTerm, roleFilter, statusFilter);

  // Fonctions pour gérer les actions

  const addUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setIsAddUserDialogOpen(false);
  };

  const updateUserRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const updateUserStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const resetPassword = (userId) => {
    // Implémenter la logique de reset mot de passe
    alert(`Mot de passe réinitialisé pour l'utilisateur ${userId}`);
  };

  const resetPasswordManually = (userId, newPassword) => {
    // Implémenter la logique de reset manuel
    alert(`Mot de passe manuellement réinitialisé pour l'utilisateur ${userId}`);
  };

  const toggle2FA = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, twoFactorEnabled: !u.twoFactorEnabled } : u
      )
    );
  };

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const handleViewActivityLog = (user) => setActivityLogUser(user);
  const handleViewProfile = (user) => setViewProfileUser(user);
  const handleEditUser = (user) => setEditProfileUser(user);
  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setEditProfileUser(null);
  };
const handleAddUser = async (user: UserFormValues): Promise<void> => {
  addUser(user);
};
  if (authLoading || !user) {
    return <div>Chargement de l’utilisateur...</div>;
  }

  const currentUserRole = {
    id: 0,
    name: user.role,
    permissions,
  };

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="mb-6">
        <UserTabsContainer
          users={filteredUsers}
          currentUserRole={currentUserRole}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={clearFilters}
          onAddUserClick={() => setIsAddUserDialogOpen(true)}
          onViewProfile={handleViewProfile}
          onEditUser={handleEditUser}
          onUpdateUserRole={updateUserRole}
          onUpdateUserStatus={updateUserStatus}
          onResetPassword={resetPassword}
          onResetPasswordManually={resetPasswordManually}
          onToggle2FA={toggle2FA}
          onDeleteUser={deleteUser}
          onViewActivityLog={handleViewActivityLog}
        />
      </div>

      <AddUserDialog
        open={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onAdd={handleAddUser}
        isLoading={false}
        availableRoles={[]} // à définir selon ton contexte
      />

      {activityLogUser && (
        <ActivityLogDialog
          open={!!activityLogUser}
          onClose={() => setActivityLogUser(null)}
          userId={activityLogUser.id.toString()}
          userName={activityLogUser.name}
        />
      )}

      <UserProfileDialog
        user={viewProfileUser}
        open={!!viewProfileUser}
        onClose={() => setViewProfileUser(null)}
        onEdit={(userId) => {
          const user = users.find((u) => u.id.toString() === userId);
          setViewProfileUser(null);
          if (user) setEditProfileUser(user);
        }}
      />

      <UserEditDialog
        user={editProfileUser}
        open={!!editProfileUser}
        onClose={() => setEditProfileUser(null)}
        onSave={handleUpdateUser}
        availableRoles={[]} // à définir aussi
        currentUserRole={undefined}      />
    </AdminLayout>
  );
};

export default AdminUsers;
