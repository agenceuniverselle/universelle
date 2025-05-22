
import React from 'react';
import { User, Permission } from '@/types/users';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Mail, 
  Phone, 
  Shield, 
  Lock, 
  UserCheck, 
  FileText, 
  CheckCircle2,
  History,
  Clock
} from 'lucide-react';
import PermissionsDisplay from './PermissionsDisplay';

interface UserProfileDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onEdit: (userId: string) => void;
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  user,
  open,
  onClose,
  onEdit
}) => {
  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Agent Immobilier':
        return 'bg-indigo-100 text-indigo-800';
      case 'Investisseur':
        return 'bg-teal-100 text-teal-800';
      case 'Client Acheteur':
        return 'bg-green-100 text-green-800';
      case 'Comptable':
        return 'bg-amber-100 text-amber-800';
      case 'Support Client':
        return 'bg-cyan-100 text-cyan-800';
      case 'Commercial':
        return 'bg-blue-100 text-blue-800';
      case 'Gestionnaire CRM':
        return 'bg-indigo-100 text-indigo-800';
      case 'Acheteur':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profil de l'utilisateur</DialogTitle>
          <DialogDescription>
            Informations détaillées sur {user.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="flex flex-col items-center space-y-4 py-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-luxe-blue text-white text-xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <div className="flex justify-center gap-2 mt-2">
               {user.role && (
  <Badge variant="outline" className={getRoleColor(user.role.name)}>
    {user.role.name}
  </Badge>
)}


                  <Badge variant="outline" className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Inscrit le</p>
                  <p>{user.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Dernière connexion</p>
                  <p>{user.lastLogin}</p>
                </div>
              </div>

              {user.lastActivity && (
                <div className="flex items-center gap-3">
                  <History className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Dernière activité</p>
                    <p>{user.lastActivity}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
<PermissionsDisplay
  permissions={(user.permissions || []).map((name, index) => ({
    id: index,
    name,
  }))}
/>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="py-2 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-luxe-blue" />
                <h3 className="text-lg font-medium">Sécurité du compte</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Authentification à deux facteurs</p>
                  <p>{user.twoFactorEnabled ? 'Activée' : 'Désactivée'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Niveau de sécurité</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={
                      user.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }>
                      {user.twoFactorEnabled ? 'Élevé' : 'Moyen'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Dernière modification du mot de passe</p>
                  <p>{user.lastPasswordChange || 'Jamais'}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recommandations de sécurité</h4>
                <ul className="text-sm space-y-2">
                  {!user.twoFactorEnabled && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>Activez l'authentification à deux facteurs pour une sécurité renforcée</span>
                    </li>
                  )}
                  {!user.lastPasswordChange && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>Incitez l'utilisateur à changer son mot de passe initial</span>
                    </li>
                  )}
                  {user.twoFactorEnabled && user.lastPasswordChange && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Le compte utilise de bonnes pratiques de sécurité</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="gap-2">
            <FileText className="h-4 w-4" />
            Fermer
          </Button>
          <Button onClick={() => onEdit(user.id)} className="gap-2">
            <History className="h-4 w-4" />
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
