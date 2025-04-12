
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Save, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const GeneralSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    platformName: 'ImmoLuxe Platform',
    language: 'fr',
    timezone: 'Europe/Paris',
    darkMode: true
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaviconFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('General settings saved:', formData);
      console.log('Logo file:', logoFile);
      console.log('Favicon file:', faviconFile);

      setIsLoading(false);
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres généraux ont été mis à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Paramètres Généraux</CardTitle>
        <CardDescription>
          Configurez les paramètres de base de votre plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="platformName">Nom de la plateforme</Label>
              <Input 
                id="platformName"
                name="platformName"
                value={formData.platformName}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="h-16 w-16 rounded border flex items-center justify-center bg-gray-50">
                    {logoFile ? (
                      <img 
                        src={URL.createObjectURL(logoFile)} 
                        alt="Logo" 
                        className="max-h-14 max-w-14 object-contain" 
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">Aucun logo</div>
                    )}
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload size={16} />
                        <span>Choisir</span>
                      </Button>
                      {logoFile && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setLogoFile(null)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                    <Input 
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format JPG, PNG. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>
            
              <div>
                <Label htmlFor="favicon">Favicon</Label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="h-16 w-16 rounded border flex items-center justify-center bg-gray-50">
                    {faviconFile ? (
                      <img 
                        src={URL.createObjectURL(faviconFile)} 
                        alt="Favicon" 
                        className="max-h-14 max-w-14 object-contain" 
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">Aucune favicon</div>
                    )}
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => document.getElementById('favicon-upload')?.click()}
                      >
                        <Upload size={16} />
                        <span>Choisir</span>
                      </Button>
                      {faviconFile && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setFaviconFile(null)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                    <Input 
                      id="favicon-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFaviconChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format ICO, PNG. Max 1MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <Label htmlFor="language">Langue par défaut</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
              <div>
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select 
                  value={formData.timezone} 
                  onValueChange={(value) => handleSelectChange('timezone', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir un fuseau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                    <SelectItem value="Africa/Casablanca">Africa/Casablanca (GMT)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                checked={formData.darkMode}
                onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)}
                id="dark-mode"
              />
              <Label htmlFor="dark-mode">Activer le mode sombre par défaut</Label>
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
