
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import PermissionsDisplay from '../PermissionsDisplay';
import { UserFormValues } from '@/hooks/useUserManagement';
import { defaultRoles, Permission } from '@/types/users';

interface UserPermissionsFormProps {
  formData: UserFormValues;
  onChange: (field: keyof UserFormValues, value: any) => void;
}

const UserPermissionsForm: React.FC<UserPermissionsFormProps> = ({ formData, onChange }) => {
  const handleCustomPermissionsChange = (checked: boolean) => {
    onChange('customPermissions', checked);
    if (!checked) {
      const rolePermissions = defaultRoles.find(r => r.name === formData.role)?.permissions || [];
      onChange('permissions', rolePermissions);
    }
  };
  
  const handlePermissionChange = (permission: string, checked: boolean) => {
    let updatedPermissions = [...(formData.permissions || [])];
    
    if (checked) {
      updatedPermissions.push(permission as Permission);
    } else {
      updatedPermissions = updatedPermissions.filter(p => p !== permission);
    }
    
    onChange('permissions', updatedPermissions as Permission[]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="customPermissions">Permissions personnalisées</Label>
          <Switch
            id="customPermissions"
            checked={formData.customPermissions}
            onCheckedChange={handleCustomPermissionsChange}
          />
        </div>
        <p className="text-sm text-gray-500">
          Par défaut, les permissions sont définies selon le rôle sélectionné.
        </p>
      </div>
      
      {formData.customPermissions ? (
        <Card>
          <CardContent className="pt-6">
            <PermissionsDisplay
              permissions={formData.permissions || []}
              onChange={handlePermissionChange}
              disabled={!formData.customPermissions}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-center text-gray-500 mb-4">
              Permissions associées au rôle "{formData.role}"
            </p>
            <PermissionsDisplay
              permissions={defaultRoles.find(r => r.name === formData.role)?.permissions || []}
              onChange={() => {}}
              disabled={true}
              readOnly={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserPermissionsForm;
