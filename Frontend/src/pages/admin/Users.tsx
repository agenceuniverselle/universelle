
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { UserTabsContainer } from '@/components/admin/users/UserTabsContainer';
import { AddUserDialog } from '@/components/admin/users/AddUserDialog';
import { ActivityLogDialog } from '@/components/admin/users/ActivityLogDialog';
import { UserProfileDialog } from '@/components/admin/users/UserProfileDialog';
import { UserEditDialog } from '@/components/admin/users/UserEditDialog';
import { useUserManagement } from '@/hooks/useUserManagement';
import { User, Role } from '@/types/users';
import { loadInitialUsers } from '@/utils/userDataHelpers';
import { UserStateManager } from '@/components/admin/users/UserStateManager';

const AdminUsers = () => {
  const currentUserRole: Role = 'Super Admin';
  const initialUsers: User[] = loadInitialUsers();

  const {
    users,
    isLoading,
    addUser,
    updateUserRole,
    updateUserStatus,
    resetPassword,
    resetPasswordManually,
    toggle2FA,
    deleteUser,
    filterUsers
  } = useUserManagement(initialUsers);

  // State management using custom component
  const {
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
    availableRoles
  } = UserStateManager({ users, currentUserRole, addUser });

  // Filtered users based on search and filters
  const filteredUsers = filterUsers(searchTerm, roleFilter, statusFilter);

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
        isLoading={isLoading}
        availableRoles={availableRoles}
      />
      
      {activityLogUser && (
        <ActivityLogDialog 
          open={!!activityLogUser}
          onClose={() => setActivityLogUser(null)}
          userId={activityLogUser.id}
          userName={activityLogUser.name}
        />
      )}

      <UserProfileDialog
        user={viewProfileUser}
        open={!!viewProfileUser}
        onClose={() => setViewProfileUser(null)}
        onEdit={(userId) => {
          const user = users.find(u => u.id === userId);
          setViewProfileUser(null);
          if (user) setEditProfileUser(user);
        }}
      />

      <UserEditDialog
        user={editProfileUser}
        open={!!editProfileUser}
        onClose={() => setEditProfileUser(null)}
        currentUserRole={currentUserRole}
        availableRoles={availableRoles}
        onSave={handleUpdateUser}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
