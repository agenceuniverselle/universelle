
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, Info, AlertTriangle, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PrivacySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    privacyPolicyUrl: '/politique-de-confidentialite',
    dataDeletionPeriod: '12',
    mandatoryConsent: true,
    cookieConsentEnabled: true,
    dataPortabilityEnabled: true,
    autoDeleteInactiveData: false,
    inactivityPeriod: '24',
    deleteDataType: 'anonymize'
  });
  
  const [privacyPolicy, setPrivacyPolicy] = useState(
    `# Politique de Confidentialité

## 1. Introduction

Cette politique de confidentialité s'applique à l'utilisation de la plateforme ImmoLuxe et à la collecte de vos données personnelles.

## 2. Données collectées

Nous collectons les données suivantes :
- Informations de contact (nom, email, téléphone)
- Préférences immobilières
- Historique de recherche et de consultation
- Données de transaction

## 3. Utilisation des données

Vos données sont utilisées pour :
- Fournir nos services immobiliers
- Personnaliser votre expérience
- Communiquer avec vous concernant vos demandes
- Améliorer nos services

## 4. Vos droits

Vous disposez des droits suivants :
- Droit d'accès à vos données
- Droit de rectification
- Droit à l'effacement
- Droit à la portabilité
- Droit d'opposition

## 5. Contact

Pour toute question concernant vos données, contactez notre DPO à privacy@immoluxe.com.
    `.trim()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('Privacy settings saved:', {
        formData,
        privacyPolicy
      });
      
      setIsLoading(false);
      toast({
        title: "Paramètres de confidentialité enregistrés",
        description: "La configuration de la confidentialité a été mise à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Confidentialité & RGPD</CardTitle>
        <CardDescription>
          Gérez les paramètres liés à la protection des données et à la conformité RGPD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 rounded p-4">
              <Info size={20} />
              <div>
                <h4 className="font-medium">Conformité RGPD</h4>
                <p className="text-sm">
                  Ces paramètres vous aident à respecter la réglementation européenne sur la protection des données (RGPD) 
                  et à protéger les données personnelles de vos utilisateurs.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium flex items-center gap-2">
                <FileText size={18} />
                Politique de confidentialité
              </h3>
              
              <div>
                <Label htmlFor="privacyPolicyUrl">URL de la politique de confidentialité</Label>
                <Input 
                  id="privacyPolicyUrl"
                  name="privacyPolicyUrl"
                  value={formData.privacyPolicyUrl}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Chemin vers votre page de politique de confidentialité
                </p>
              </div>
              
              <div>
                <Label htmlFor="privacyPolicy">Contenu de la politique de confidentialité</Label>
                <Textarea 
                  id="privacyPolicy"
                  value={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
                  className="mt-1 font-mono text-sm"
                  rows={10}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format Markdown supporté. Ce contenu sera affiché sur la page de politique de confidentialité.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium">Consentement des utilisateurs</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mandatory-consent" className="font-medium">
                    Consentement obligatoire
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Exige l'acceptation des conditions d'utilisation et de la politique de confidentialité
                  </p>
                </div>
                <Switch 
                  id="mandatory-consent"
                  checked={formData.mandatoryConsent}
                  onCheckedChange={(checked) => handleSwitchChange('mandatoryConsent', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cookie-consent" className="font-medium">
                    Bannière de consentement aux cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Affiche une bannière pour le consentement aux cookies
                  </p>
                </div>
                <Switch 
                  id="cookie-consent"
                  checked={formData.cookieConsentEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('cookieConsentEnabled', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium">Gestion des données</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-portability" className="font-medium">
                    Exportation des données utilisateur
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permet aux utilisateurs d'exporter leurs données personnelles
                  </p>
                </div>
                <Switch 
                  id="data-portability"
                  checked={formData.dataPortabilityEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('dataPortabilityEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-delete" className="font-medium">
                    Suppression automatique des données inactives
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Supprime automatiquement les données des utilisateurs inactifs
                  </p>
                </div>
                <Switch 
                  id="auto-delete"
                  checked={formData.autoDeleteInactiveData}
                  onCheckedChange={(checked) => handleSwitchChange('autoDeleteInactiveData', checked)}
                />
              </div>
              
              {formData.autoDeleteInactiveData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 mt-2 border-l-2 border-gray-100">
                  <div>
                    <Label htmlFor="inactivityPeriod">Période d'inactivité (mois)</Label>
                    <Input 
                      id="inactivityPeriod"
                      name="inactivityPeriod"
                      type="number"
                      min="1"
                      max="60"
                      value={formData.inactivityPeriod}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supprimer les données après X mois d'inactivité
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="deleteDataType">Type de suppression</Label>
                    <Select 
                      value={formData.deleteDataType} 
                      onValueChange={(value) => handleSelectChange('deleteDataType', value)}
                    >
                      <SelectTrigger id="deleteDataType" className="mt-1">
                        <SelectValue placeholder="Type de suppression" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anonymize">Anonymiser</SelectItem>
                        <SelectItem value="delete">Supprimer complètement</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Anonymiser conserve des statistiques mais supprime les données personnelles
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-medium">Conservation des données</h3>
              
              <div>
                <Label htmlFor="dataDeletionPeriod">
                  Période de conservation des données (mois)
                </Label>
                <Input 
                  id="dataDeletionPeriod"
                  name="dataDeletionPeriod"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.dataDeletionPeriod}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Durée maximale de conservation des données personnelles
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded p-4 mt-4">
                <AlertTriangle size={20} />
                <div>
                  <h4 className="font-medium">Attention</h4>
                  <p className="text-sm">
                    La réduction de la période de conservation ou l'activation de la suppression automatique 
                    peut entraîner la perte définitive de données. Assurez-vous d'avoir des sauvegardes 
                    appropriées avant d'appliquer ces paramètres.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end border-t pt-6">
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
