
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, Plus, Trash2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { RoleDefinition, Permission, defaultRoles, permissionDescriptions } from '@/types/users';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RolePermissionManagerProps {
  onSave: (roles: RoleDefinition[]) => void;
  initialRoles?: RoleDefinition[];
}

const PERMISSION_GROUPS = {
  'Utilisateurs': ['user.create', 'user.read', 'user.update', 'user.delete', 'user.manage_roles'],
  'Biens immobiliers': ['property.create', 'property.read', 'property.update', 'property.delete'],
  'Leads & CRM': ['lead.create', 'lead.read', 'lead.update', 'lead.delete', 'lead.assign'],
  'Investissements': ['investment.create', 'investment.read', 'investment.update', 'investment.delete'],
  'Transactions & Finance': ['transaction.create', 'transaction.read', 'transaction.update', 'transaction.delete', 'finance.manage'],
  'Équipes & Clients': ['team.manage', 'client.read_own', 'client.read_all'],
  'Support Client': ['ticket.create', 'ticket.read', 'ticket.update', 'ticket.assign'],
  'Système & Administration': ['content.manage', 'settings.manage', 'stats.view', 'logs.view', 'export.data'],
};

export const RolePermissionManager: React.FC<RolePermissionManagerProps> = ({ 
  onSave,
  initialRoles
}) => {
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles || defaultRoles);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    if (!editingRole) return;
    
    setEditingRole(prevRole => {
      if (!prevRole) return null;
      
      const updatedPermissions = checked 
        ? [...prevRole.permissions, permission]
        : prevRole.permissions.filter(p => p !== permission);
      
      return {
        ...prevRole,
        permissions: updatedPermissions
      };
    });
  };

  const handlePermissionGroupChange = (group: string, checked: boolean) => {
    if (!editingRole) return;
    
    setEditingRole(prevRole => {
      if (!prevRole) return null;
      
      const groupPermissions = PERMISSION_GROUPS[group as keyof typeof PERMISSION_GROUPS] as Permission[];
      let updatedPermissions = [...prevRole.permissions];
      
      if (checked) {
        // Add all permissions from the group that aren't already in the role
        groupPermissions.forEach(permission => {
          if (!updatedPermissions.includes(permission)) {
            updatedPermissions.push(permission);
          }
        });
      } else {
        // Remove all permissions from the group
        updatedPermissions = updatedPermissions.filter(
          permission => !groupPermissions.includes(permission)
        );
      }
      
      return {
        ...prevRole,
        permissions: updatedPermissions
      };
    });
  };
  
  const isGroupChecked = (group: string): boolean => {
    if (!editingRole) return false;
    
    const groupPermissions = PERMISSION_GROUPS[group as keyof typeof PERMISSION_GROUPS] as Permission[];
    return groupPermissions.every(permission => 
      editingRole.permissions.includes(permission)
    );
  };
  
  const isGroupIndeterminate = (group: string): boolean => {
    if (!editingRole) return false;
    
    const groupPermissions = PERMISSION_GROUPS[group as keyof typeof PERMISSION_GROUPS] as Permission[];
    const hasAny = groupPermissions.some(permission => 
      editingRole.permissions.includes(permission)
    );
    const hasAll = groupPermissions.every(permission => 
      editingRole.permissions.includes(permission)
    );
    
    return hasAny && !hasAll;
  };

  const startEditingRole = (role: RoleDefinition) => {
    setEditingRole({...role});
  };

  const cancelEditing = () => {
    setEditingRole(null);
    setIsAddingRole(false);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const saveRoleChanges = () => {
    if (!editingRole) return;
    
    const updatedRoles = roles.map(role => 
      role.name === editingRole.name ? editingRole : role
    );
    
    setRoles(updatedRoles);
    onSave(updatedRoles);
    setEditingRole(null);
    
    toast({
      title: "Modifications enregistrées",
      description: `Les permissions pour le rôle "${editingRole.name}" ont été mises à jour.`,
    });
  };

  const addNewRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom au rôle.",
        variant: "destructive"
      });
      return;
    }

    const roleExists = roles.some(role => role.name === newRoleName);
    if (roleExists) {
      toast({
        title: "Erreur",
        description: "Un rôle avec ce nom existe déjà.",
        variant: "destructive"
      });
      return;
    }

    const newRole: RoleDefinition = {
      name: newRoleName as any, // Using 'as any' for simplicity, ideally would validate this is a proper Role type
      description: newRoleDescription,
      permissions: [],
      isDefault: false
    };

    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    onSave(updatedRoles);
    setIsAddingRole(false);
    setNewRoleName('');
    setNewRoleDescription('');
    
    toast({
      title: "Rôle ajouté",
      description: `Le rôle "${newRoleName}" a été créé avec succès.`,
    });
  };

  const confirmDeleteRole = (roleName: string) => {
    setRoleToDelete(roleName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteRole = () => {
    if (!roleToDelete) return;
    
    const updatedRoles = roles.filter(role => role.name !== roleToDelete);
    setRoles(updatedRoles);
    onSave(updatedRoles);
    
    toast({
      title: "Rôle supprimé",
      description: `Le rôle "${roleToDelete}" a été supprimé avec succès.`,
    });
    
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const permissionCount = (role: RoleDefinition) => {
    return `${role.permissions.length} permissions`;
  };

  const renderPermissionCheckboxes = () => {
    if (!editingRole) return null;
    
    return Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => (
      <div key={groupName} className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox 
            id={`group-${groupName}`}
            checked={isGroupChecked(groupName)}
            onCheckedChange={(checked) => handlePermissionGroupChange(groupName, checked as boolean)}
            data-state={isGroupIndeterminate(groupName) ? 'indeterminate' : undefined}
          />
          <Label htmlFor={`group-${groupName}`} className="text-md font-semibold">
            {groupName}
          </Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
          {(permissions as Permission[]).map(permission => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox 
                id={permission}
                checked={editingRole.permissions.includes(permission)}
                onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
              />
              <div className="flex items-center">
                <Label htmlFor={permission} className="text-sm">
                  {permissionDescriptions[permission]}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 ml-1 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{permission}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'Super Admin':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Super Admin</Badge>;
      case 'Administrateur':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Administrateur</Badge>;
      case 'Manager':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Manager</Badge>;
      case 'Agent Immobilier':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Agent Immobilier</Badge>;
      case 'Investisseur':
        return <Badge variant="outline" className="bg-teal-100 text-teal-800">Investisseur</Badge>;
      case 'Client Acheteur':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Client Acheteur</Badge>;
      case 'Comptable':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Comptable</Badge>;
      case 'Support Client':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Support Client</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{roleName}</Badge>;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des rôles et permissions</CardTitle>
            <CardDescription>Définissez les rôles et leurs permissions associées</CardDescription>
          </div>
          {!isAddingRole && !editingRole && (
            <Button onClick={() => setIsAddingRole(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau rôle
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAddingRole ? (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="text-lg font-semibold">Nouveau rôle</h3>
            <div className="space-y-2">
              <Label htmlFor="roleName">Nom du rôle</Label>
              <Input 
                id="roleName" 
                value={newRoleName} 
                onChange={e => setNewRoleName(e.target.value)} 
                placeholder="Ex: Manager Marketing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea 
                id="roleDescription" 
                value={newRoleDescription} 
                onChange={e => setNewRoleDescription(e.target.value)} 
                placeholder="Ex: Gestion du marketing et de la communication"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEditing}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={addNewRole}>
                <Save className="h-4 w-4 mr-2" />
                Créer le rôle
              </Button>
            </div>
          </div>
        ) : editingRole ? (
          <div className="space-y-4 border p-4 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold mr-2">Modifier: {editingRole.name}</h3>
                {getRoleBadge(editingRole.name)}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={cancelEditing}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={saveRoleChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {editingRole.description}
            </div>
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-amber-700">
                La modification des permissions peut affecter l'accès des utilisateurs. Assurez-vous que les changements sont appropriés.
              </div>
            </div>
            <ScrollArea className="h-[400px] p-2">
              {renderPermissionCheckboxes()}
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.name}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className={
                          role.name === 'Super Admin' ? 'text-red-500' : 
                          role.name === 'Administrateur' ? 'text-purple-500' : 
                          'text-gray-500'
                        } size={16} />
                        <span className="font-medium">{role.name}</span>
                        {role.isDefault && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs">Par défaut</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{role.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {permissionCount(role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => startEditingRole(role)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {!role.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700" 
                            onClick={() => confirmDeleteRole(role.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce rôle ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer le rôle <strong>{roleToDelete}</strong>. 
              Cette action est irréversible et pourrait affecter les utilisateurs ayant ce rôle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRole}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
