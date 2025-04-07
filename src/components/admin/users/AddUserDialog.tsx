
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserFormValues } from '@/hooks/useUserManagement';
import { Role } from '@/types/users';
import UserGeneralForm from './UserFormTabs/UserGeneralForm';
import UserPermissionsForm from './UserFormTabs/UserPermissionsForm';
import UserSecurityForm from './UserFormTabs/UserSecurityForm';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (userData: UserFormValues) => Promise<void>;
  isLoading: boolean;
  availableRoles: Role[];
}

export const AddUserDialog = ({ open, onClose, onAdd, isLoading, availableRoles }: AddUserDialogProps) => {
  const [activeTab, setActiveTab] = useState('general');
  
  const [formData, setFormData] = useState<UserFormValues>({
    name: '',
    email: '',
    phone: '',
    role: availableRoles[0] || 'Acheteur',
    customPermissions: false,
    permissions: [],
    sendInvitation: true,
    generatePassword: false,
    password: '',
    requirePasswordChange: true,
    enable2FA: false,
  });
  
  const handleChange = (field: keyof UserFormValues, value: any) => {
    setFormData({...formData, [field]: value});
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: availableRoles[0] || 'Acheteur',
      customPermissions: false,
      permissions: [],
      sendInvitation: true,
      generatePassword: false,
      password: '',
      requirePasswordChange: true,
      enable2FA: false,
    });
    setActiveTab('general');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      return; // Validation de base
    }
    
    try {
      await onAdd(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <UserGeneralForm 
                formData={formData}
                onChange={handleChange}
                availableRoles={availableRoles}
              />
            </TabsContent>
            
            <TabsContent value="permissions">
              <UserPermissionsForm 
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>
            
            <TabsContent value="security">
              <UserSecurityForm 
                formData={formData}
                onChange={handleChange}
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email || !formData.role}
            >
              {isLoading ? "Création en cours..." : "Ajouter l'utilisateur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
