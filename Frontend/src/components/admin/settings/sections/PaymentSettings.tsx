
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Save, CreditCard, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PaymentHistoryItem {
  id: string;
  date: Date;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  customer: string;
}

export const PaymentSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [formData, setFormData] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    cmiEnabled: false,
    stripeKey: 'sk_test_51NcTjkJK0MEehsdfskljdfs298KLJsdfJLKJljlkj',
    paypalClientId: '',
    cmiMerchantId: '',
    defaultCurrency: 'MAD',
    taxRate: '20',
    commissionRate: '5',
    webhookUrl: 'https://yourdomain.com/api/webhooks/payment',
  });
  
  const [paymentHistory] = useState<PaymentHistoryItem[]>([
    {
      id: 'pay_1NjK8h2eZvKYlo2CKqUu1h5c',
      date: new Date(2023, 9, 15),
      amount: 2500,
      status: 'completed',
      method: 'Stripe (Carte)',
      customer: 'Marc Dubois'
    },
    {
      id: 'pay_1NjF2h2eZvKYlo2CHgUe9j2m',
      date: new Date(2023, 9, 13),
      amount: 1800,
      status: 'completed',
      method: 'Stripe (Carte)',
      customer: 'Sophie Martin'
    },
    {
      id: 'pay_1NhY7h2eZvKYlo2CBnTp5g1k',
      date: new Date(2023, 9, 10),
      amount: 3500,
      status: 'failed',
      method: 'CMI',
      customer: 'Ahmed Benani'
    },
    {
      id: 'pay_1NgR4h2eZvKYlo2CAsCm2d9j',
      date: new Date(2023, 9, 5),
      amount: 4200,
      status: 'completed',
      method: 'PayPal',
      customer: 'Émilie Laurent'
    },
  ]);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: formData.defaultCurrency 
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('Payment settings saved:', formData);
      
      setIsLoading(false);
      toast({
        title: "Paramètres de paiement enregistrés",
        description: "La configuration des paiements a été mise à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Paiement & Abonnement</CardTitle>
        <CardDescription>
          Configurez les paramètres de paiement et de facturation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers">Fournisseurs de paiement</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="pt-6">
            <TabsContent value="providers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Stripe</h3>
                    </div>
                    <Switch 
                      checked={formData.stripeEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('stripeEnabled', checked)}
                    />
                  </div>
                  
                  {formData.stripeEnabled && (
                    <div className="space-y-3 mt-4">
                      <div>
                        <Label htmlFor="stripeKey">Clé secrète Stripe</Label>
                        <div className="relative">
                          <Input 
                            id="stripeKey"
                            name="stripeKey"
                            type={showApiKey ? 'text' : 'password'}
                            value={formData.stripeKey}
                            onChange={handleInputChange}
                            className="mt-1 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Clé secrète trouvable dans le dashboard Stripe
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded p-2 text-sm">
                        <AlertTriangle size={16} />
                        <span>Ne partagez jamais votre clé secrète</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="https://cdn.worldvectorlogo.com/logos/paypal-3.svg" alt="PayPal" className="h-6 w-6" />
                      <h3 className="font-medium">PayPal</h3>
                    </div>
                    <Switch 
                      checked={formData.paypalEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('paypalEnabled', checked)}
                    />
                  </div>
                  
                  {formData.paypalEnabled && (
                    <div className="space-y-3 mt-4">
                      <div>
                        <Label htmlFor="paypalClientId">Client ID PayPal</Label>
                        <Input 
                          id="paypalClientId"
                          name="paypalClientId"
                          value={formData.paypalClientId}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Trouvable dans votre compte développeur PayPal
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="https://maroc.paymee.tn/assets/img/CMI-Logo.png" alt="CMI" className="h-6" />
                      <h3 className="font-medium">CMI</h3>
                    </div>
                    <Switch 
                      checked={formData.cmiEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('cmiEnabled', checked)}
                    />
                  </div>
                  
                  {formData.cmiEnabled && (
                    <div className="space-y-3 mt-4">
                      <div>
                        <Label htmlFor="cmiMerchantId">Identifiant marchand CMI</Label>
                        <Input 
                          id="cmiMerchantId"
                          name="cmiMerchantId"
                          value={formData.cmiMerchantId}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Fourni par CMI lors de l'inscription
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Webhook de confirmation</h3>
                
                <div>
                  <Label htmlFor="webhookUrl">URL du Webhook</Label>
                  <Input 
                    id="webhookUrl"
                    name="webhookUrl"
                    value={formData.webhookUrl}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ce point d'accès recevra les notifications de paiement
                  </p>
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
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                  <Select 
                    value={formData.defaultCurrency} 
                    onValueChange={(value) => handleSelectChange('defaultCurrency', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choisir une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAD">Dirham marocain (MAD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar américain (USD)</SelectItem>
                      <SelectItem value="GBP">Livre sterling (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                  <Input 
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                <Input 
                  id="commissionRate"
                  name="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Commission prélevée sur les transactions immobilières
                </p>
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
            </TabsContent>
            
            <TabsContent value="history">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Transaction</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{payment.customer}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {payment.status === 'completed' ? 'Complété' : 
                             payment.status === 'pending' ? 'En attente' : 'Échoué'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="button"
                  variant="outline"
                >
                  Télécharger l'historique
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
    </>
  );
};
