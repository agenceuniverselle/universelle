import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserFormValues } from '@/hooks/useUserManagement';
import { Role } from '@/types/users';

interface UserGeneralFormProps {
  formData: UserFormValues;
  onChange: <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => void;
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
            placeholder="fatima"
            required
            className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="user@example.com"
            required
            className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "
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
            placeholder="+212 6 12 34 56 78"
            className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Rôle *</Label>

<Select
  value={String(formData.role_id || "")}  // ✅ Utiliser role_id
  onValueChange={(value) => onChange('role_id', Number(value))}  // ✅ Convertir en nombre
>
  <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
    <SelectValue placeholder="Sélectionner un rôle" />
  </SelectTrigger>
   <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">

    {availableRoles.map((role) => (
      <SelectItem key={role.id} value={String(role.id)}>
        {role.name}
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
