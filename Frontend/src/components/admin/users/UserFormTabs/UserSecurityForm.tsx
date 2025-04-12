
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { UserFormValues } from '@/hooks/useUserManagement';

interface UserSecurityFormProps {
  formData: UserFormValues;
  onChange: (field: keyof UserFormValues, value: any) => void;
}

const UserSecurityForm: React.FC<UserSecurityFormProps> = ({ formData, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onChange('password', password);
  };
  
  const handleGeneratePasswordChange = (checked: boolean) => {
    onChange('generatePassword', checked);
    if (checked) {
      generateRandomPassword();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="generatePassword">Générer un mot de passe aléatoire</Label>
          <Switch
            id="generatePassword"
            checked={formData.generatePassword}
            onCheckedChange={handleGeneratePasswordChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Entrez un mot de passe"
              disabled={formData.generatePassword}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Cacher' : 'Voir'}
            </button>
          </div>
          
          {formData.generatePassword && (
            <Button
              type="button"
              variant="outline"
              onClick={generateRandomPassword}
            >
              Régénérer
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {formData.generatePassword
            ? "Un mot de passe sécurisé a été généré automatiquement."
            : "Minimum 8 caractères, incluant lettres, chiffres et caractères spéciaux."}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="requirePasswordChange"
            checked={formData.requirePasswordChange}
            onCheckedChange={(checked) => 
              onChange('requirePasswordChange', checked === true)
            }
          />
          <Label htmlFor="requirePasswordChange">
            Exiger le changement du mot de passe à la première connexion
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="enable2FA">Activer l'authentification à deux facteurs</Label>
          <Switch
            id="enable2FA"
            checked={formData.enable2FA}
            onCheckedChange={(checked) => onChange('enable2FA', checked)}
          />
        </div>
        <p className="text-sm text-gray-500">
          Renforce la sécurité du compte en exigeant une vérification supplémentaire.
        </p>
      </div>
    </div>
  );
};

export default UserSecurityForm;
