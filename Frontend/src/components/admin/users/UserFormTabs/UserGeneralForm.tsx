
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserFormValues } from '@/hooks/useUserManagement';
import { Role } from '@/types/users';

interface UserGeneralFormProps {
  formData: UserFormValues;
  onChange: (field: keyof UserFormValues, value: any) => void;
  availableRoles: Role[];
}

const UserGeneralForm: React.FC<UserGeneralFormProps> = ({ formData, onChange, availableRoles }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Jean Dupont"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="jean.dupont@example.com"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Rôle *</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => onChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="sendInvitation">Envoyer un email d'invitation</Label>
          <Switch
            id="sendInvitation"
            checked={formData.sendInvitation}
            onCheckedChange={(checked) => onChange('sendInvitation', checked)}
          />
        </div>
        <p className="text-sm text-gray-500">
          Un email sera envoyé à l'utilisateur avec ses identifiants de connexion.
        </p>
      </div>
    </div>
  );
};

export default UserGeneralForm;
