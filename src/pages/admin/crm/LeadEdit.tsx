
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { LeadProvider } from '@/context/LeadContext';
import { LeadEditContent } from '@/components/crm/lead-edit/LeadEditContent';

const LeadEdit = () => {
  return (
    <AdminLayout title="Modifier le lead">
      <LeadProvider>
        <LeadEditContent />
      </LeadProvider>
    </AdminLayout>
  );
};

export default LeadEdit;
