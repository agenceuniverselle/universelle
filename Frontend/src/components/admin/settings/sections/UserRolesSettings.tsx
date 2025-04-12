
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import { RolePermissionManager } from '@/components/admin/users/RolePermissionManager';
import { RoleDefinition, defaultRoles } from '@/types/users';

export const UserRolesSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<RoleDefinition[]>(defaultRoles);

  const handleSaveRoles = (updatedRoles: RoleDefinition[]) => {
    setRoles(updatedRoles);
    console.log('Roles updated:', updatedRoles);
    
    toast({
      title: "Rôles mis à jour",
      description: "Les rôles et permissions ont été mis à jour avec succès.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('User roles settings saved:', roles);
      
      setIsLoading(false);
      toast({
        title: "Paramètres des utilisateurs enregistrés",
        description: "La configuration des rôles et permissions a été mise à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Gestion des Utilisateurs & Rôles</CardTitle>
        <CardDescription>
          Gérez les rôles d'utilisateurs et leurs permissions associées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RolePermissionManager
            onSave={handleSaveRoles}
            initialRoles={roles}
          />
          
          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              className="bg-luxe-blue hover:bg-luxe-blue/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer tous les paramètres utilisateurs
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
};
