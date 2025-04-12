
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Save, TestTube, Mail, Smartphone, BellRing } from 'lucide-react';

export const EmailSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.example.com',
    port: '587',
    username: 'no-reply@immoluxe.com',
    password: '********',
    encryption: 'tls',
    fromEmail: 'no-reply@immoluxe.com',
    fromName: 'ImmoLuxe Platform',
  });
  
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    notifyNewLead: true,
    notifyLeadStatusChange: true,
    notifyNewMessage: true,
    notifyNewReview: false,
    notifyPayment: true,
  });
  
  const [emailTemplates, setEmailTemplates] = useState({
    contactForm: {
      subject: 'Nous avons reçu votre message',
      content: `
Cher(e) {name},

Nous vous remercions d'avoir pris contact avec ImmoLuxe.

Votre message a bien été reçu et notre équipe s'engage à vous répondre dans les meilleurs délais.

Cordialement,
L'équipe ImmoLuxe
      `.trim()
    },
    leadWelcome: {
      subject: 'Bienvenue chez ImmoLuxe',
      content: `
Cher(e) {name},

Merci de votre intérêt pour nos services immobiliers.

Un conseiller ImmoLuxe vous contactera prochainement pour discuter de votre projet.

À bientôt,
L'équipe ImmoLuxe
      `.trim()
    },
    paymentConfirmation: {
      subject: 'Confirmation de paiement',
      content: `
Cher(e) {name},

Nous vous confirmons que votre paiement de {amount} a bien été enregistré.

Référence de transaction: {transactionId}

Merci pour votre confiance,
L'équipe ImmoLuxe
      `.trim()
    }
  });

  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmtpConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleTemplateChange = (template: string, field: string, value: string) => {
    setEmailTemplates(prev => ({
      ...prev,
      [template]: {
        ...prev[template as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const testSmtpConnection = () => {
    setIsTesting(true);
    
    // Simuler un appel API pour tester SMTP
    setTimeout(() => {
      setIsTesting(false);
      toast({
        title: "Test SMTP réussi",
        description: "La connexion au serveur SMTP a été établie avec succès.",
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('Email settings saved:', {
        smtpConfig,
        notifications,
        emailTemplates
      });
      
      setIsLoading(false);
      toast({
        title: "Paramètres d'email enregistrés",
        description: "La configuration des emails et notifications a été mise à jour.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Email & Notifications</CardTitle>
        <CardDescription>
          Configurez les paramètres d'email et de notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="smtp" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="smtp">Configuration SMTP</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="templates">Modèles d'Email</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="pt-6">
            <TabsContent value="smtp" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="host">Serveur SMTP</Label>
                  <Input 
                    id="host"
                    name="host"
                    value={smtpConfig.host}
                    onChange={handleSmtpChange}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="port">Port</Label>
                  <Input 
                    id="port"
                    name="port"
                    value={smtpConfig.port}
                    onChange={handleSmtpChange}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input 
                    id="username"
                    name="username"
                    value={smtpConfig.username}
                    onChange={handleSmtpChange}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    value={smtpConfig.password}
                    onChange={handleSmtpChange}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="encryption">Chiffrement</Label>
                  <Input 
                    id="encryption"
                    name="encryption"
                    value={smtpConfig.encryption}
                    onChange={handleSmtpChange}
                    className="mt-1"
                    placeholder="tls, ssl, ou aucun"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
                <div>
                  <Label htmlFor="fromEmail">Email d'expéditeur</Label>
                  <Input 
                    id="fromEmail"
                    name="fromEmail"
                    value={smtpConfig.fromEmail}
                    onChange={handleSmtpChange}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="fromName">Nom d'expéditeur</Label>
                  <Input 
                    id="fromName"
                    name="fromName"
                    value={smtpConfig.fromName}
                    onChange={handleSmtpChange}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={testSmtpConnection}
                  disabled={isTesting}
                  className="flex items-center gap-2"
                >
                  {isTesting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Test en cours...
                    </>
                  ) : (
                    <>
                      <TestTube size={16} />
                      Tester la connexion SMTP
                    </>
                  )}
                </Button>
                
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
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail size={20} className="text-blue-600" />
                    <h3 className="font-medium">Notifications par Email</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-enabled">Activer</Label>
                    <Switch 
                      id="email-enabled"
                      checked={notifications.emailEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('emailEnabled', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone size={20} className="text-green-600" />
                    <h3 className="font-medium">Notifications par SMS</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-enabled">Activer</Label>
                    <Switch 
                      id="sms-enabled"
                      checked={notifications.smsEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('smsEnabled', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <BellRing size={20} className="text-purple-600" />
                    <h3 className="font-medium">Notifications Push</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-enabled">Activer</Label>
                    <Switch 
                      id="push-enabled"
                      checked={notifications.pushEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('pushEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Événements de notification</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="notify-new-lead" 
                      checked={notifications.notifyNewLead}
                      onCheckedChange={(checked) => handleCheckboxChange('notifyNewLead', checked === true)}
                    />
                    <Label htmlFor="notify-new-lead">Nouveau lead</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="notify-lead-status" 
                      checked={notifications.notifyLeadStatusChange}
                      onCheckedChange={(checked) => handleCheckboxChange('notifyLeadStatusChange', checked === true)}
                    />
                    <Label htmlFor="notify-lead-status">Changement de statut d'un lead</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="notify-new-message" 
                      checked={notifications.notifyNewMessage}
                      onCheckedChange={(checked) => handleCheckboxChange('notifyNewMessage', checked === true)}
                    />
                    <Label htmlFor="notify-new-message">Nouveau message</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="notify-new-review" 
                      checked={notifications.notifyNewReview}
                      onCheckedChange={(checked) => handleCheckboxChange('notifyNewReview', checked === true)}
                    />
                    <Label htmlFor="notify-new-review">Nouvel avis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="notify-payment" 
                      checked={notifications.notifyPayment}
                      onCheckedChange={(checked) => handleCheckboxChange('notifyPayment', checked === true)}
                    />
                    <Label htmlFor="notify-payment">Paiement reçu</Label>
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
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-8">
              <div className="space-y-6">
                <h3 className="font-medium">Email formulaire de contact</h3>
                
                <div>
                  <Label htmlFor="contact-subject">Sujet</Label>
                  <Input 
                    id="contact-subject"
                    value={emailTemplates.contactForm.subject}
                    onChange={(e) => handleTemplateChange('contactForm', 'subject', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-content">Contenu</Label>
                  <Textarea 
                    id="contact-content"
                    value={emailTemplates.contactForm.content}
                    onChange={(e) => handleTemplateChange('contactForm', 'content', e.target.value)}
                    className="mt-1"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Variables disponibles: {'{name}'}, {'{email}'}, {'{message}'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6 border-t pt-6">
                <h3 className="font-medium">Email de bienvenue pour lead</h3>
                
                <div>
                  <Label htmlFor="lead-subject">Sujet</Label>
                  <Input 
                    id="lead-subject"
                    value={emailTemplates.leadWelcome.subject}
                    onChange={(e) => handleTemplateChange('leadWelcome', 'subject', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lead-content">Contenu</Label>
                  <Textarea 
                    id="lead-content"
                    value={emailTemplates.leadWelcome.content}
                    onChange={(e) => handleTemplateChange('leadWelcome', 'content', e.target.value)}
                    className="mt-1"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Variables disponibles: {'{name}'}, {'{propertyType}'}, {'{source}'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6 border-t pt-6">
                <h3 className="font-medium">Email confirmation de paiement</h3>
                
                <div>
                  <Label htmlFor="payment-subject">Sujet</Label>
                  <Input 
                    id="payment-subject"
                    value={emailTemplates.paymentConfirmation.subject}
                    onChange={(e) => handleTemplateChange('paymentConfirmation', 'subject', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="payment-content">Contenu</Label>
                  <Textarea 
                    id="payment-content"
                    value={emailTemplates.paymentConfirmation.content}
                    onChange={(e) => handleTemplateChange('paymentConfirmation', 'content', e.target.value)}
                    className="mt-1"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Variables disponibles: {'{name}'}, {'{amount}'}, {'{transactionId}'}, {'{date}'}
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
          </form>
        </Tabs>
      </CardContent>
    </>
  );
};
