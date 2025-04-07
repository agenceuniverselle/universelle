
import React from 'react';
import { User, Role } from '@/types/users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import { UserActionMenu } from '@/components/admin/users/UserActionMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserTableProps {
  users: User[];
  currentUserRole: Role;
  onViewProfile: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onChangeRole: (userId: string, newRole: Role) => void;
  onToggleStatus: (userId: string, newStatus: 'Active' | 'Inactive') => void;
  onResetPassword: (userId: string) => void;
  onResetPasswordManually: (userId: string, password: string, options: { forceChange: boolean; sendEmail: boolean }) => void;
  onToggle2FA: (userId: string) => void;
  onDelete: (userId: string) => void;
  onViewActivityLog: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserRole,
  onViewProfile,
  onEditUser,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
  onResetPasswordManually,
  onToggle2FA,
  onDelete,
  onViewActivityLog,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-red-100 text-red-800';
      case 'Administrateur':
        return 'bg-purple-100 text-purple-800';
      case 'Commercial':
        return 'bg-blue-100 text-blue-800';
      case 'Gestionnaire CRM':
        return 'bg-indigo-100 text-indigo-800';
      case 'Investisseur':
        return 'bg-teal-100 text-teal-800';
      case 'Acheteur':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>Gérez les utilisateurs et leurs permissions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    Aucun utilisateur ne correspond à vos critères de recherche
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="" alt={user.name} />
                          <AvatarFallback className="bg-luxe-blue text-white">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.twoFactorEnabled ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Activé
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-500">
                          Désactivé
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>{user.registeredDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onViewActivityLog(user.id)}
                          title="Historique d'activité"
                          className="hover:bg-gray-100"
                        >
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                        <UserActionMenu 
                          user={user}
                          currentUserRole={currentUserRole}
                          onViewProfile={onViewProfile}
                          onEditUser={onEditUser}
                          onChangeRole={onChangeRole}
                          onToggleStatus={onToggleStatus}
                          onResetPassword={onResetPassword}
                          onResetPasswordManually={onResetPasswordManually}
                          onToggle2FA={onToggle2FA}
                          onDelete={onDelete}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
