
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { GeneralSettings } from './sections/GeneralSettings';
import { AgencySettings } from './sections/AgencySettings';
import { SecuritySettings } from './sections/SecuritySettings';
import { EmailSettings } from './sections/EmailSettings';
import { PaymentSettings } from './sections/PaymentSettings';
import { CRMSettings } from './sections/CRMSettings';
import { UserRolesSettings } from './sections/UserRolesSettings';
import { IntegrationsSettings } from './sections/IntegrationsSettings';
import { PrivacySettings } from './sections/PrivacySettings';
import { 
  Settings, 
  Building2, 
  Shield, 
  Mail, 
  CreditCard, 
  Users2, 
  Users, 
  Cable, 
  FileText 
} from 'lucide-react';

export const SettingsTabs = () => {
  return (
    <Tabs defaultValue="general" className="w-full space-y-6">
      <TabsList className="grid grid-cols-3 md:grid-cols-9 h-auto bg-muted mb-4 overflow-x-auto">
        <TabsTrigger value="general" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <Settings size={18} className="mb-1" />
          <span className="text-xs">Général</span>
        </TabsTrigger>
        <TabsTrigger value="agency" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <Building2 size={18} className="mb-1" />
          <span className="text-xs">Agence</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <Shield size={18} className="mb-1" />
          <span className="text-xs">Sécurité</span>
        </TabsTrigger>
        <TabsTrigger value="email" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <Mail size={18} className="mb-1" />
          <span className="text-xs">Email</span>
        </TabsTrigger>
        <TabsTrigger value="payment" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <CreditCard size={18} className="mb-1" />
          <span className="text-xs">Paiement</span>
        </TabsTrigger>
        <TabsTrigger value="crm" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <Users2 size={18} className="mb-1" />
          <span className="text-xs">CRM</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <Users size={18} className="mb-1" />
          <span className="text-xs">Utilisateurs</span>
        </TabsTrigger>
        <TabsTrigger value="integrations" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <Cable size={18} className="mb-1" />
          <span className="text-xs">Intégrations</span>
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex flex-col py-3 px-1 data-[state=active]:bg-luxe-blue data-[state=active]:text-white">
          <FileText size={18} className="mb-1" />
          <span className="text-xs">Confidentialité</span>
        </TabsTrigger>
      </TabsList>

      <Card className="border rounded-lg">
        <TabsContent value="general" className="p-0">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="agency" className="p-0">
          <AgencySettings />
        </TabsContent>
        <TabsContent value="security" className="p-0">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="email" className="p-0">
          <EmailSettings />
        </TabsContent>
        <TabsContent value="payment" className="p-0">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="crm" className="p-0">
          <CRMSettings />
        </TabsContent>
        <TabsContent value="users" className="p-0">
          <UserRolesSettings />
        </TabsContent>
        <TabsContent value="integrations" className="p-0">
          <IntegrationsSettings />
        </TabsContent>
        <TabsContent value="privacy" className="p-0">
          <PrivacySettings />
        </TabsContent>
      </Card>
    </Tabs>
  );
};
