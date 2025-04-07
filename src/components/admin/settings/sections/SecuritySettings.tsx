
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const SecuritySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    twoFactorAuth: true,
    passwordCycle: '90',
    loginAttempts: '5',
    sessionTimeout: '30',
    logSuccessfulLogins: true,
    logFailedLogins: true,
  });
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleUserReset = () => {
    if (!userToReset.trim()) return;
    
    // Simuler un appel API pour réinitialiser
    setTimeout(() => {
      console.log('Password reset for user:', userToReset);
      
      setResetDialogOpen(false);
      setUserToReset('');
      
      toast({
        title: "Demande de réinitialisation envoyée",
        description: `Un email de réinitialisation a été envoyé à l'utilisateur ${userToReset}.`,
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('Security settings saved:', formData);
      
      setIsLoading(false);
      toast({
        title: "Paramètres de sécurité enregistrés",
        description: "Les paramètres de sécurité ont été mis à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Sécurité & Connexion</CardTitle>
        <CardDescription>
          Configurez les paramètres de sécurité et les règles d'authentification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Authentification à deux facteurs (2FA)</Label>
                <p className="text-sm text-muted-foreground">
                  Requiert une authentification supplémentaire pour les utilisateurs
                </p>
              </div>
              <Switch 
                checked={formData.twoFactorAuth}
                onCheckedChange={(checked) => handleSwitchChange('twoFactorAuth', checked)}
                id="two-factor-auth"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="passwordCycle">Cycle de mot de passe</Label>
                <Select 
                  value={formData.passwordCycle} 
                  onValueChange={(value) => handleSelectChange('passwordCycle', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 jours</SelectItem>
                    <SelectItem value="60">60 jours</SelectItem>
                    <SelectItem value="90">90 jours</SelectItem>
                    <SelectItem value="180">6 mois</SelectItem>
                    <SelectItem value="365">1 an</SelectItem>
                    <SelectItem value="0">Jamais</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Force le changement de mot de passe après la période
                </p>
              </div>
              
              <div>
                <Label htmlFor="loginAttempts">Limite de tentatives de connexion</Label>
                <Select 
                  value={formData.loginAttempts} 
                  onValueChange={(value) => handleSelectChange('loginAttempts', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Nombre de tentatives" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 tentatives</SelectItem>
                    <SelectItem value="5">5 tentatives</SelectItem>
                    <SelectItem value="10">10 tentatives</SelectItem>
                    <SelectItem value="0">Illimité</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Bloque le compte après X tentatives échouées
                </p>
              </div>
              
              <div>
                <Label htmlFor="sessionTimeout">Expiration de session</Label>
                <Select 
                  value={formData.sessionTimeout} 
                  onValueChange={(value) => handleSelectChange('sessionTimeout', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="480">8 heures</SelectItem>
                    <SelectItem value="1440">1 jour</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Déconnexion automatique après inactivité
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-4">Réinitialisation de mot de passe</h3>
              <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    type="button" 
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Forcer la réinitialisation d'un utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Réinitialiser un mot de passe</DialogTitle>
                    <DialogDescription>
                      Entrez l'email de l'utilisateur dont vous souhaitez réinitialiser le mot de passe.
                      Un email avec des instructions sera envoyé à l'utilisateur.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded p-2 mb-4">
                      <AlertTriangle size={16} />
                      <p className="text-sm">Cette action ne peut pas être annulée.</p>
                    </div>
                    <Label htmlFor="user-email" className="mb-2">
                      Email de l'utilisateur
                    </Label>
                    <Input
                      id="user-email"
                      value={userToReset}
                      onChange={(e) => setUserToReset(e.target.value)}
                      placeholder="utilisateur@example.com"
                    />
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setResetDialogOpen(false)}
                      type="button"
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleUserReset}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      disabled={!userToReset.trim()}
                      type="button"
                    >
                      Réinitialiser le mot de passe
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-4">Journalisation des accès</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="log-successful" className="cursor-pointer">
                    Journaliser les connexions réussies
                  </Label>
                  <Switch 
                    id="log-successful"
                    checked={formData.logSuccessfulLogins}
                    onCheckedChange={(checked) => handleSwitchChange('logSuccessfulLogins', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="log-failed" className="cursor-pointer">
                    Journaliser les tentatives de connexion échouées
                  </Label>
                  <Switch 
                    id="log-failed"
                    checked={formData.logFailedLogins}
                    onCheckedChange={(checked) => handleSwitchChange('logFailedLogins', checked)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 rounded p-4 mt-4">
              <Shield size={20} />
              <div>
                <h4 className="font-medium">Recommandation de sécurité</h4>
                <p className="text-sm">
                  Pour une sécurité optimale, nous recommandons d'activer l'authentification à deux facteurs et 
                  de définir un cycle de mot de passe de 90 jours maximum.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-luxe-blue hover:bg-luxe-blue/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
};
