
import React from 'react';
import { Permission } from '@/types/users';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, UserCheck } from 'lucide-react';

interface PermissionsDisplayProps {
  permissions: Permission[];
  onChange?: (permission: string, checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  maxHeight?: string;
}

const PermissionsDisplay: React.FC<PermissionsDisplayProps> = ({ 
  permissions, 
  onChange,
  disabled = false,
  readOnly = false,
  className = "", 
  maxHeight = "280px" 
}) => {
  // Group permissions for better display
  const groupedPermissions = () => {
    if (!permissions || permissions.length === 0) return [];
    
    // Define permission groups
    const groups: Record<string, Permission[]> = {
      'Utilisateurs': [],
      'Biens immobiliers': [],
      'Leads & CRM': [],
      'Investissements': [],
      'Transactions & Finance': [],
      'Équipes & Clients': [],
      'Support Client': [],
      'Système & Administration': [],
    };
    
    // Fill groups with user permissions
   permissions.forEach(perm => {
  if (perm.name.startsWith('user.')) groups['Utilisateurs'].push(perm);
  else if (perm.name.startsWith('property.')) groups['Biens immobiliers'].push(perm);
  else if (perm.name.startsWith('lead.')) groups['Leads & CRM'].push(perm);
  else if (perm.name.startsWith('investment.')) groups['Investissements'].push(perm);
  else if (perm.name.startsWith('transaction.') || perm.name === 'finance.manage') groups['Transactions & Finance'].push(perm);
  else if (perm.name.startsWith('team.') || perm.name.startsWith('client.')) groups['Équipes & Clients'].push(perm);
  else if (perm.name.startsWith('ticket.')) groups['Support Client'].push(perm);
  else groups['Système & Administration'].push(perm);
});

    
    // Return only non-empty groups
    return Object.entries(groups)
      .filter(([_, perms]) => perms.length > 0)
      .map(([name, perms]) => ({
        name,
        permissions: perms
      }));
  };

  return (
    <div className={`py-2 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="h-5 w-5 text-luxe-blue" />
        <h3 className="text-lg font-medium">Permissions de l'utilisateur</h3>
      </div>
      
      {permissions && permissions.length > 0 ? (
        <ScrollArea className={`h-[${maxHeight}] pr-4`}>
          <div className="space-y-6">
            {groupedPermissions().map(group => (
              <div key={group.name} className="space-y-2">
                <h4 className="font-medium text-gray-700">{group.name}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {group.permissions.map(permission => (
  <div key={permission.id} className="flex items-center gap-2 text-sm">
    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
    <span>{permission.description ?? permission.name}</span>
  </div>
))}

                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-gray-500 italic text-center py-8">
          Aucune permission définie pour ce rôle.
        </div>
      )}
    </div>
  );
};

export default PermissionsDisplay;
