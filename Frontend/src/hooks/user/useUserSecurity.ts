
import { User } from '@/types/users';
import { useToast } from '@/hooks/use-toast';
import { sendEmailNotification } from '@/utils/notificationUtils';
import { saveUsersToStorage } from '@/utils/userStorageUtils';

/**
 * Hook for user security operations
 */
export const useUserSecurity = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const resetPassword = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const tempPassword = Math.random().toString(36).slice(-8);
      
      sendEmailNotification({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        content: {
          title: 'Votre mot de passe a été réinitialisé',
          message: 'Un mot de passe temporaire a été généré pour votre compte. Veuillez l\'utiliser pour vous connecter et ensuite le changer immédiatement.',
          details: {
            'Mot de passe temporaire': tempPassword
          },
          callToAction: {
            text: 'Se connecter pour changer votre mot de passe',
            url: `${window.location.origin}/login`
          }
        }
      });
      
      toast({
        title: "Mot de passe réinitialisé",
        description: `Un email a été envoyé à ${user.email} avec les instructions de réinitialisation.`,
      });
      
      console.log(`[LOG] Password reset for user ${userId} (${user.name}) at ${new Date().toISOString()}`);
    }
  };

  const resetPasswordManually = (
    userId: string, 
    newPassword: string, 
    options: { forceChange: boolean; sendEmail: boolean }
  ) => {
    const user = users.find(u => u.id === userId);
    
    if (user) {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, password: newPassword } : u
      );
      
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      
      if (options.sendEmail) {
        sendEmailNotification({
          to: user.email,
          subject: 'Nouveau mot de passe pour votre compte',
          content: {
            title: 'Votre mot de passe a été changé',
            message: 'Un administrateur a changé le mot de passe de votre compte.',
            details: {
              'Nouveau mot de passe': newPassword,
              'Changement obligatoire': options.forceChange ? 'Oui, à la prochaine connexion' : 'Non'
            },
            callToAction: {
              text: 'Se connecter',
              url: `${window.location.origin}/admin`
            }
          }
        });
      }
      
      console.log(`[LOG] Password reset manually for user ${userId} by admin at ${new Date().toISOString()}`);
      
      let toastMessage = `Le mot de passe de ${user.name} a été réinitialisé.`;
      
      if (options.sendEmail) {
        toastMessage += ` Un email a été envoyé à ${user.email} avec le nouveau mot de passe.`;
      }
      
      if (options.forceChange) {
        toastMessage += " L'utilisateur devra changer son mot de passe à sa prochaine connexion.";
      }
      
      toast({
        title: "Mot de passe réinitialisé",
        description: toastMessage,
      });
    }
  };

  const toggle2FA = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const newValue = user ? !user.twoFactorEnabled : false;
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, twoFactorEnabled: newValue } : user
    );
    
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    if (user) {
      sendEmailNotification({
        to: user.email,
        subject: newValue ? 'Authentification à deux facteurs activée' : 'Authentification à deux facteurs désactivée',
        content: {
          title: newValue ? '2FA activée' : '2FA désactivée',
          message: newValue 
            ? 'L\'authentification à deux facteurs a été activée sur votre compte pour une sécurité accrue.' 
            : 'L\'authentification à deux facteurs a été désactivée sur votre compte.',
          callToAction: newValue ? {
            text: 'En savoir plus sur la 2FA',
            url: `${window.location.origin}/help/2fa`
          } : undefined
        }
      });
      
      console.log(`[LOG] 2FA ${newValue ? 'enabled' : 'disabled'} for user ${userId} at ${new Date().toISOString()}`);
    }
  };

  return {
    resetPassword,
    resetPasswordManually,
    toggle2FA
  };
};
