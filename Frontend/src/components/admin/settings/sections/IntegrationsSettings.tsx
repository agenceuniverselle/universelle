
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save, Copy, RefreshCw, Trash2, Eye, EyeOff, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Integration {
  id: string;
  name: string;
  type: 'whatsapp' | 'twilio' | 'zapier' | 'google';
  enabled: boolean;
  apiKey?: string;
  webhook?: string;
  lastUsed?: Date;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed?: Date;
}

export const IntegrationsSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'WhatsApp Business',
      type: 'whatsapp',
      enabled: false,
      apiKey: 'wh_12345abcdef',
      webhook: 'https://api.immoluxe.com/webhooks/whatsapp'
    },
    {
      id: '2',
      name: 'Twilio SMS',
      type: 'twilio',
      enabled: true,
      apiKey: 'tw_67890ghijkl',
      lastUsed: new Date(2023, 9, 15)
    },
    {
      id: '3',
      name: 'Zapier Integration',
      type: 'zapier',
      enabled: true,
      webhook: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
      lastUsed: new Date(2023, 9, 20)
    },
    {
      id: '4',
      name: 'Google Calendar',
      type: 'google',
      enabled: false
    }
  ]);
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Application Web',
      key: 'api_web_12345abcdefghijklmnopqrstuvwxyz',
      created: new Date(2023, 5, 15),
      lastUsed: new Date(2023, 9, 25)
    },
    {
      id: '2',
      name: 'Application Mobile',
      key: 'api_mob_67890abcdefghijklmnopqrstuvwxyz',
      created: new Date(2023, 8, 10),
      lastUsed: new Date(2023, 9, 28)
    }
  ]);
  
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');

  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
    ));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${type} copié dans le presse-papiers.`,
    });
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: "Clé API supprimée",
      description: "La clé API a été supprimée avec succès.",
    });
  };

  const generateNewApiKey = () => {
    if (!newApiKeyName.trim()) return;
    
    // Generate a random API key (simplified for example)
    const randomKey = 'api_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKeyName,
      key: randomKey,
      created: new Date()
    };
    
    setApiKeys([...apiKeys, newKey]);
    setNewApiKeyName('');
    
    toast({
      title: "Nouvelle clé API générée",
      description: `La clé API pour "${newApiKeyName}" a été créée avec succès.`,
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Jamais';
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    }).format(date);
  };

  const handleIntegrationSetup = (integration: Integration) => {
    setSelectedIntegration(integration);
    setWebhookUrl(integration.webhook || '');
  };

  const saveIntegrationSettings = () => {
    if (!selectedIntegration) return;
    
    setIntegrations(integrations.map(integration => 
      integration.id === selectedIntegration.id 
        ? { ...integration, webhook: webhookUrl } 
        : integration
    ));
    
    toast({
      title: "Intégration mise à jour",
      description: `Les paramètres de ${selectedIntegration.name} ont été mis à jour.`,
    });
    
    setSelectedIntegration(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('Integration settings saved:', {
        integrations,
        apiKeys
      });
      
      setIsLoading(false);
      toast({
        title: "Paramètres d'intégration enregistrés",
        description: "La configuration des intégrations a été mise à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Intégrations & API</CardTitle>
        <CardDescription>
          Gérez les intégrations avec des services tiers et les clés API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Intégrations Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Intégrations</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière utilisation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell>
                        <div className="font-medium">{integration.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch 
                            checked={integration.enabled}
                            onCheckedChange={() => toggleIntegrationStatus(integration.id)}
                            className="mr-2"
                          />
                          <span className={integration.enabled ? 'text-green-600' : 'text-gray-400'}>
                            {integration.enabled ? 'Activée' : 'Désactivée'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(integration.lastUsed)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleIntegrationSetup(integration)}
                            >
                              Configurer
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Configuration de {integration.name}</DialogTitle>
                              <DialogDescription>
                                Paramétrez les informations nécessaires pour cette intégration.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              {integration.type === 'whatsapp' || integration.type === 'zapier' ? (
                                <div>
                                  <Label htmlFor="webhook-url">URL du Webhook</Label>
                                  <div className="flex mt-1">
                                    <Input 
                                      id="webhook-url"
                                      value={webhookUrl}
                                      onChange={(e) => setWebhookUrl(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => copyToClipboard(webhookUrl, 'URL de webhook')}
                                      className="ml-2"
                                    >
                                      <Copy size={16} />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Ce webhook recevra les notifications de {integration.name}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <Label htmlFor="api-token">Clé API</Label>
                                  <div className="flex mt-1">
                                    <Input 
                                      id="api-token"
                                      type="text"
                                      value={integration.apiKey || ''}
                                      readOnly
                                      className="flex-1"
                                    />
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => copyToClipboard(integration.apiKey || '', 'Clé API')}
                                      className="ml-2"
                                    >
                                      <Copy size={16} />
                                    </Button>
                                  </div>
                                  {integration.type === 'google' && (
                                    <div className="mt-4">
                                      <Button type="button" className="w-full">
                                        Se connecter avec Google
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button 
                                  variant="outline" 
                                  type="button"
                                >
                                  Annuler
                                </Button>
                              </DialogClose>
                              <Button type="button" onClick={saveIntegrationSettings}>
                                Enregistrer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* API Keys Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Clés API</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle size={16} />
                    Nouvelle clé API
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle clé API</DialogTitle>
                    <DialogDescription>
                      Donnez un nom à votre clé API pour l'identifier facilement.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="api-key-name">Nom de la clé API</Label>
                    <Input 
                      id="api-key-name"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                      className="mt-1"
                      placeholder="Ex: Application Web"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Utilisez un nom descriptif pour vous rappeler de l'usage de cette clé.
                    </p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => setNewApiKeyName('')}
                      >
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button onClick={generateNewApiKey} disabled={!newApiKeyName.trim()}>
                      Générer la clé
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Clé API</TableHead>
                    <TableHead>Créée le</TableHead>
                    <TableHead>Dernière utilisation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell>{apiKey.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono truncate max-w-[200px]">
                            {showApiKey ? apiKey.key : apiKey.key.substring(0, 10) + '...'}
                          </code>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="ml-2"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="ml-1"
                            onClick={() => copyToClipboard(apiKey.key, 'Clé API')}
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(apiKey.created)}</TableCell>
                      <TableCell>{formatDate(apiKey.lastUsed)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center">
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteApiKey(apiKey.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon"
                            className="ml-2"
                            onClick={() => {
                              // Régénérer la clé (simulé)
                              const newKey = 'api_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                              setApiKeys(apiKeys.map(key => 
                                key.id === apiKey.id ? { ...key, key: newKey, created: new Date() } : key
                              ));
                              toast({
                                title: "Clé API régénérée",
                                description: `La clé pour "${apiKey.name}" a été régénérée avec succès.`,
                              });
                            }}
                          >
                            <RefreshCw size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {apiKeys.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune clé API disponible</p>
              </div>
            )}
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
