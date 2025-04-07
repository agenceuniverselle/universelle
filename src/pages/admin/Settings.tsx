
import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/layouts/AdminLayout';
import { SettingsTabs } from '@/components/admin/settings/SettingsTabs';

const Settings = () => {
  return (
    <AdminLayout title="Settings">
      <Helmet>
        <title>Paramètres | Admin Dashboard</title>
      </Helmet>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground">
              Configurer et personnaliser votre plateforme immobilière
            </p>
          </div>
        </div>
        <SettingsTabs />
      </div>
    </AdminLayout>
  );
};

export default Settings;
