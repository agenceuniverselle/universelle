import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UserFormValues } from "@/hooks/useUserManagement";
import { Eye, EyeOff, ShieldCheck, Clipboard } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // ✅ Utiliser le toast

interface UserSecurityFormProps {
  formData: UserFormValues;
  onChange: <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => void;
}


const UserSecurityForm: React.FC<UserSecurityFormProps> = ({ formData, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
    const password = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map((value) => chars[value % chars.length])
      .join("");
    onChange("password", password);
  };
  const handleSwitchChange = (checked: boolean) => {
    setTimeout(() => {
      onChange('enable2FA', checked);
    }, 0); // ✅ Utilise un microtask pour éviter flushSync
  };
  const handleGeneratePasswordChange = (checked: boolean) => {
    if (checked) {
      generateRandomPassword();
    } else {
      onChange("password", ""); // Réinitialiser le mot de passe si désactivé
    }
    onChange("generatePassword", checked);
  };

  const copyToClipboard = async () => {
    if (formData.password) {
      try {
        await navigator.clipboard.writeText(formData.password);
        toast({
          title: "Succès",
          description: "Mot de passe copié !",
          variant: "default",
          style: {
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #e0e0e0",
          },
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de copier le mot de passe.",
          variant: "destructive",
          style: {
            backgroundColor: "#ffffff",
            color: "#d32f2f",
            border: "1px solid #e0e0e0",
          },
        });
      }
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) return "weak";
    const lengthCriteria = password.length >= 8;
    const lowercaseCriteria = /[a-z]/.test(password);
    const uppercaseCriteria = /[A-Z]/.test(password);
    const digitCriteria = /\d/.test(password);
    const specialCharCriteria = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/.test(password);

    const score = [lengthCriteria, lowercaseCriteria, uppercaseCriteria, digitCriteria, specialCharCriteria].filter(Boolean).length;

    if (score <= 2) return "weak";
    if (score === 3) return "medium";
    return "strong";
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

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
        <div className="relative flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Entrez un mot de passe"
              required
              autoComplete="off"
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
            <button
              type="button"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={copyToClipboard}
              title="Copier le mot de passe"
            >
              <Clipboard className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {formData.generatePassword && (
            <Button type="button" variant="outline" onClick={generateRandomPassword} className="dark:text-black">
              Régénérer
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">
            {passwordStrength === "strong" ? "Mot de passe sécurisé" : 
             passwordStrength === "medium" ? "Sécurité moyenne" : 
             "Mot de passe faible"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
         <Checkbox
  id="requirePasswordChange"
  checked={formData.requirePasswordChange}
  onCheckedChange={(checked) => onChange("requirePasswordChange", checked === true)}
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
        onCheckedChange={handleSwitchChange}
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
