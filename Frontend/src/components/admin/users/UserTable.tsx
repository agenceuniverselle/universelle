
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Role } from '@/types/users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ClipboardList, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext'; // ✅ Utiliser AuthContext pour les permissions
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

interface UserTableProps {
    users: User[];  
  currentUserRole: Role;
  onViewProfile: (userId: string) => void;
  onEditUser: (user: User) => void;
  onChangeRole: (userId: string, newRole: Role) => void;
  onToggleStatus: (userId: string, newStatus: 'Active' | 'Inactive') => void;
  onResetPassword: (userId: string) => void;
  onResetPasswordManually: (userId: string, password: string, options: { forceChange: boolean; sendEmail: boolean }) => void;
  onToggle2FA: (userId: string) => void;
  onDelete: (userId: string) => void;
  onViewActivityLog: (userId: string) => void;
}
type UserWithRawDates = User & {
  created_at?: string;
};
export const UserTable: React.FC<UserTableProps> = ({
  
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
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const { permissions } = useAuth(); // ✅ Utiliser AuthContext
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const handleDeleteUser = async () => {
  if (!selectedUserToDelete) return;

  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(`http://localhost:8000/api/admin/users/${selectedUserToDelete.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast({
      title: "Succès",
      description: "Utilisateur supprimé avec succès.",
    });

    setSelectedUserToDelete(null);
    fetchUsers();
  } catch (error) {
    toast({
      title: "Erreur",
      description: "Impossible de supprimer l'utilisateur.",
      variant: "destructive",
    });
  }
};
const [selectedUserToDelete, setSelectedUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les utilisateurs.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'En attente': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-red-100 text-red-800';
      case 'Administrateur': return 'bg-purple-100 text-purple-800';
      case 'Commercial': return 'bg-blue-100 text-blue-800';
      case 'Gestionnaire CRM': return 'bg-indigo-100 text-indigo-800';
      case 'Investisseur': return 'bg-teal-100 text-teal-800';
      case 'Acheteur': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // ✅ Vérification des permissions
  const canEdit = permissions.includes("edit_users");
  const canDelete = permissions.includes("delete_users");

  return (
<Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
<CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="dark:text-white">Liste des utilisateurs</CardTitle>
            <CardDescription >Gérez les utilisateurs et leurs permissions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 dark:text-gray-200">
              <TableRow>
                <TableHead className="w-[80px] dark:text-gray-300">ID</TableHead>
                <TableHead className=" dark:text-gray-300" >Utilisateur</TableHead>
                <TableHead className="dark:text-gray-300">Rôle</TableHead>
                <TableHead className=" dark:text-gray-300">Statut</TableHead>
                <TableHead className=" dark:text-gray-300">2FA</TableHead>
                <TableHead className=" dark:text-gray-300">Dernière connexion</TableHead>
                <TableHead className=" dark:text-gray-300">Date d'inscription</TableHead>
                {(canEdit || canDelete) && <TableHead className="w-[80px] dark:text-gray-300">Actions</TableHead>}
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
                          <div className="text-xs text-gray-500  dark:text-white">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
              <TableCell>
  {user.role && user.role.name ? (
    <Badge variant="outline" className={getRoleColor(user.role.name)}>
      {user.role.name}
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-gray-100 text-gray-800">
      Aucun rôle
    </Badge>
  )}
</TableCell>


                <TableCell>
                      <Badge variant="outline" className={getStatusColor(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.twoFactorEnabled ? "Activé" : "Désactivé"}</TableCell>
                    <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString("fr-FR") : "Jamais connecté"}</TableCell>
<TableCell>
  {(user as UserWithRawDates).created_at
    ? new Date((user as UserWithRawDates).created_at!).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date non disponible"}
</TableCell>


                      {(canEdit || canDelete) && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      
                      {canEdit && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                            onClick={() => onEditUser(user)}

                        >
                          <Pencil className="h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      )}
                      {(canEdit || canDelete) && <DropdownMenuSeparator />}
                    {canDelete && (
  <DropdownMenuItem
    className="flex items-center gap-2 text-red-600 cursor-pointer"
    onSelect={(e) => {
      e.preventDefault(); // empêche le comportement par défaut du Dropdown
      setSelectedUserToDelete(user); // définit l'utilisateur à supprimer
    }}
  >
    <Trash2 className="h-4 w-4" />
    Supprimer
  </DropdownMenuItem>
)}

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
                 
            </TableBody>
          </Table>
        </div>
        <AlertDialog open={!!selectedUserToDelete} onOpenChange={() => setSelectedUserToDelete(null)}>
  <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
      <AlertDialogDescription>
        Êtes-vous sûr(e) de vouloir supprimer l’utilisateur <strong>{selectedUserToDelete?.name}</strong> ?
        Cette action est irréversible.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="transition-all duration-200 hover:scale-105 text-gray-700 dark:text-balck hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1" onClick={() => setSelectedUserToDelete(null)}>
        Annuler
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDeleteUser}
        className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:scale-105 rounded-md px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"

      >
        Supprimer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      </CardContent>
    </Card>
    
  );
};
