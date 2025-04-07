
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, FileText, Building2, WalletCards, UserPlus, Edit, Trash2 } from 'lucide-react';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'login' | 'permission';
  timestamp: string;
  details?: string;
}

interface ActivityLogDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

// Mock activity logs - in a real app, this would come from an API
const generateMockLogs = (userId: string, userName: string): ActivityLog[] => {
  return [
    {
      id: '1',
      userId,
      userName,
      action: 'Connexion réussie',
      actionType: 'login',
      timestamp: '2024-05-15 09:32:15',
    },
    {
      id: '2',
      userId,
      userName,
      action: 'A modifié un bien immobilier',
      actionType: 'update',
      timestamp: '2024-05-14 15:42:08',
      details: 'Mise à jour: Villa de luxe à Marrakech (ID: P123)'
    },
    {
      id: '3',
      userId,
      userName,
      action: 'A créé un nouveau lead',
      actionType: 'create',
      timestamp: '2024-05-14 11:05:22',
      details: 'Nouveau lead: Jean Martin (jean.martin@example.com)'
    },
    {
      id: '4',
      userId,
      userName,
      action: 'Permissions modifiées',
      actionType: 'permission',
      timestamp: '2024-05-13 16:30:45',
      details: 'Rôle changé de Commercial à Administrateur'
    },
    {
      id: '5',
      userId,
      userName,
      action: 'A supprimé un document',
      actionType: 'delete',
      timestamp: '2024-05-12 10:15:33',
      details: 'Document supprimé: Contrat de vente.pdf'
    },
    {
      id: '6',
      userId,
      userName,
      action: 'A enregistré une transaction',
      actionType: 'create',
      timestamp: '2024-05-10 14:22:18',
      details: 'Nouvelle transaction: Vente appartement Casablanca (450 000 MAD)'
    },
    {
      id: '7',
      userId,
      userName,
      action: 'Connexion réussie',
      actionType: 'login',
      timestamp: '2024-05-10 08:45:12',
    }
  ];
};

export const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({
  open,
  onClose,
  userId,
  userName
}) => {
  // In a real app, you would fetch logs from an API
  const activityLogs = generateMockLogs(userId, userName);
  
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <UserPlus className="h-4 w-4" />;
      case 'update':
        return <Edit className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'login':
        return <User className="h-4 w-4" />;
      case 'permission':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      case 'permission':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historique d'activité</DialogTitle>
          <DialogDescription>
            Journal des activités de {userName}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 border-b pb-4">
                <div className={`${getActionColor(log.actionType)} p-2 rounded-full`}>
                  {getActionIcon(log.actionType)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.timestamp}</p>
                  </div>
                  {log.details && (
                    <p className="text-sm text-gray-600">{log.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
