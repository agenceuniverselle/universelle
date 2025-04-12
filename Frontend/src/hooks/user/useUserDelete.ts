
import { User } from '@/types/users';
import { useToast } from '@/hooks/use-toast';
import { sendEmailNotification } from '@/utils/notificationUtils';
import { saveUsersToStorage } from '@/utils/userStorageUtils';

/**
 * Hook for user deletion
 */
export const useUserDelete = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    
    if (user) {
      sendEmailNotification({
        to: user.email,
        subject: 'Votre compte a été supprimé',
        content: {
          title: 'Compte supprimé',
          message: 'Votre compte a été supprimé de notre plateforme. Toutes vos données ont été effacées.',
          callToAction: {
            text: 'Nous contacter',
            url: 'mailto:support@example.com'
          }
        }
      });
      
      console.log(`[LOG] User deleted: ${userId} (${user.name}, ${user.email}) at ${new Date().toISOString()}`);
      
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      
      toast({
        title: "Utilisateur supprimé",
        description: `${user.name} a été supprimé avec succès.`,
      });
    }
  };

  return { deleteUser };
};
