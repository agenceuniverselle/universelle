
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Save, UserPlus, Users, ListChecks, AlertCircle } from 'lucide-react';

export const CRMSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    autoAssignLeads: true,
    assignmentType: 'round-robin',
    enablePipeline: true,
    enableNotifications: true,
    autoNotifyAfter: '24',
    followUpDays: '3',
    trackLeadActions: true,
    showLeadValue: true,
    enableScoring: true,
    enableTasks: true,
    requireNotes: false,
  });

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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('CRM settings saved:', formData);
      
      setIsLoading(false);
      toast({
        title: "Paramètres CRM enregistrés",
        description: "Les paramètres du CRM ont été mis à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>CRM & Logiciel Commercial</CardTitle>
        <CardDescription>
          Configurez les paramètres de votre système de gestion des relations clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-medium flex items-center gap-2">
                <UserPlus size={18} />
                Attribution des leads
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-assign" className="font-medium">Attribution automatique des leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Attribue automatiquement les nouveaux leads aux agents
                  </p>
                </div>
                <Switch 
                  id="auto-assign"
                  checked={formData.autoAssignLeads}
                  onCheckedChange={(checked) => handleSwitchChange('autoAssignLeads', checked)}
                />
              </div>
              
              {formData.autoAssignLeads && (
                <div>
                  <Label htmlFor="assignment-type">Type d'attribution</Label>
                  <Select 
                    value={formData.assignmentType} 
                    onValueChange={(value) => handleSelectChange('assignmentType', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choisir un type d'attribution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Tour à tour (Round-robin)</SelectItem>
                      <SelectItem value="load-balance">Charge de travail (équilibré)</SelectItem>
                      <SelectItem value="performance">Performance (meilleurs agents)</SelectItem>
                      <SelectItem value="specialty">Spécialité (par type de bien)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Définit la méthode d'attribution des leads aux agents
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-medium flex items-center gap-2">
                <Users size={18} />
                Pipeline de vente
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-pipeline" className="font-medium">Activer le pipeline de vente</Label>
                  <p className="text-sm text-muted-foreground">
                    Permet le suivi des leads à travers les étapes de vente
                  </p>
                </div>
                <Switch 
                  id="enable-pipeline"
                  checked={formData.enablePipeline}
                  onCheckedChange={(checked) => handleSwitchChange('enablePipeline', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-lead-value" className="font-medium">Afficher la valeur des leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Montre la valeur estimée des leads dans le pipeline
                  </p>
                </div>
                <Switch 
                  id="show-lead-value"
                  checked={formData.showLeadValue}
                  onCheckedChange={(checked) => handleSwitchChange('showLeadValue', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-scoring" className="font-medium">Activer le scoring des leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Attribue un score aux leads en fonction de leur potentiel
                  </p>
                </div>
                <Switch 
                  id="enable-scoring"
                  checked={formData.enableScoring}
                  onCheckedChange={(checked) => handleSwitchChange('enableScoring', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-medium flex items-center gap-2">
                <ListChecks size={18} />
                Tâches et suivi
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-tasks" className="font-medium">Activer les tâches</Label>
                  <p className="text-sm text-muted-foreground">
                    Permet la création et le suivi des tâches liées aux leads
                  </p>
                </div>
                <Switch 
                  id="enable-tasks"
                  checked={formData.enableTasks}
                  onCheckedChange={(checked) => handleSwitchChange('enableTasks', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-notes" className="font-medium">Notes obligatoires</Label>
                  <p className="text-sm text-muted-foreground">
                    Exige l'ajout de notes lors de la mise à jour d'un lead
                  </p>
                </div>
                <Switch 
                  id="require-notes"
                  checked={formData.requireNotes}
                  onCheckedChange={(checked) => handleSwitchChange('requireNotes', checked)}
                />
              </div>
              
              <div>
                <Label htmlFor="followUpDays">Suivi périodique (jours)</Label>
                <Input 
                  id="followUpDays"
                  name="followUpDays"
                  type="number"
                  min="1"
                  max="90"
                  value={formData.followUpDays}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Rappelle aux agents de contacter les leads après X jours sans interaction
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <AlertCircle size={18} />
                Notifications
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-notifications" className="font-medium">
                    Notifications automatiques aux prospects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Envoie des emails automatiques aux prospects
                  </p>
                </div>
                <Switch 
                  id="enable-notifications"
                  checked={formData.enableNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('enableNotifications', checked)}
                />
              </div>
              
              {formData.enableNotifications && (
                <div>
                  <Label htmlFor="autoNotifyAfter">
                    Délai avant notification automatique (heures)
                  </Label>
                  <Input 
                    id="autoNotifyAfter"
                    name="autoNotifyAfter"
                    type="number"
                    min="1"
                    max="72"
                    value={formData.autoNotifyAfter}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Envoie un email au prospect si aucun contact n'est fait dans ce délai
                  </p>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-4">Historique des actions</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="track-actions" 
                  checked={formData.trackLeadActions}
                  onCheckedChange={(checked) => handleCheckboxChange('trackLeadActions', checked === true)}
                />
                <div>
                  <Label htmlFor="track-actions">Suivre les actions sur les leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Enregistre chaque interaction et modification des leads
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
