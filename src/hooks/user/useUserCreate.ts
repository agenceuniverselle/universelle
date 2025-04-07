
import { useState } from 'react';
import { User, Role, Permission, defaultRoles } from '@/types/users';
import { UserFormValues } from '@/hooks/useUserManagement';
import { useToast } from '@/hooks/use-toast';
import { sendEmailNotification } from '@/utils/notificationUtils';
import { saveUsersToStorage } from '@/utils/userStorageUtils';

/**
 * Hook for user creation functionality
 */
export const useUserCreate = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addUser = async (userData: UserFormValues) => {
    setIsLoading(true);
    
    try {
      let userPermissions: Permission[] = [];
      
      if (userData.customPermissions && userData.permissions) {
        userPermissions = userData.permissions;
      } else {
        const roleDefinition = defaultRoles.find(role => role.name === userData.role);
        if (roleDefinition) {
          userPermissions = roleDefinition.permissions;
        }
      }
      
      // S'assurer que le mot de passe est défini
      const userPassword = userData.password || 'admin123'; // Fallback password si non défini
      
      const newUser: User = {
        id: `U${(users.length + 1).toString().padStart(3, '0')}`,
        name: userData.name,
        email: userData.email,
        role: userData.role as Role,
        status: 'Active', // Toujours actif par défaut
        lastLogin: '-',
        registeredDate: new Date().toLocaleDateString('fr-FR'),
        phone: userData.phone,
        permissions: userPermissions,
        twoFactorEnabled: userData.enable2FA,
        // Sauvegarder explicitement le mot de passe pour l'authentification
        password: userPassword
      };
      
      console.log("Nouvel utilisateur créé:", newUser);
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      
      if (userData.sendInvitation) {
        const baseUrl = window.location.origin;
        await sendEmailNotification({
          to: userData.email,
          subject: 'Bienvenue - Votre compte a été créé',
          content: {
            title: 'Bienvenue sur notre plateforme',
            message: `Bonjour ${userData.name}, un compte a été créé pour vous avec le rôle de ${userData.role}.`,
            details: {
              'Email': userData.email,
              'Mot de passe': userPassword,
              'Changement obligatoire': userData.requirePasswordChange ? 'Oui' : 'Non'
            },
            callToAction: {
              text: 'Se connecter',
              url: `${baseUrl}/admin`
            }
          }
        });
      }
      
      toast({
        title: "Utilisateur créé",
        description: `${userData.name} a été ajouté avec le rôle ${userData.role}.`,
      });
      
      console.log(`[LOG] User created: ${newUser.id} (${newUser.name}) with role ${newUser.role} and password ${newUser.password} at ${new Date().toISOString()}`);
      
      return newUser;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de l'utilisateur.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addUser,
    isLoading
  };
};
