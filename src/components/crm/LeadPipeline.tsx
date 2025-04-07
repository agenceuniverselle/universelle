
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { useLeads } from '@/context/LeadContext';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface LeadCardProps {
  id: string;
  name: string;
  property?: string;
  value?: string;
  lastContact?: Date;
  status: string;
  score?: number;
  email?: string;
}

const LeadPipeline = () => {
  const { leads, moveLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Get priority based on score
  const getLeadPriority = (score?: number): 'high' | 'medium' | 'low' => {
    if (!score) return 'medium';
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  // Filter leads by search term
  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(search)) ||
      (lead.email && lead.email.toLowerCase().includes(search)) ||
      (lead.phone && lead.phone.toLowerCase().includes(search)) ||
      (lead.propertyType && lead.propertyType.toLowerCase().includes(search))
    );
  });

  // Function to get leads by status
  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(lead => lead.status === status);
  };

  // Function to get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Component for lead card
  const LeadCard = ({ lead }: { lead: LeadCardProps }) => {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    };

    const dragStart = (e: React.DragEvent, lead: LeadCardProps) => {
      e.dataTransfer.setData('leadId', lead.id);
      e.dataTransfer.setData('currentStatus', lead.status);
    };

    const priority = getLeadPriority(lead.score);
    
    const handleCardClick = () => {
      navigate(`/admin/crm/lead/${lead.id}`);
    };

    return (
      <div
        draggable
        onDragStart={(e) => dragStart(e, lead)}
        onClick={handleCardClick}
        className="p-3 bg-white rounded-md border shadow-sm mb-3 cursor-move hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="" alt={lead.name} />
              <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{lead.name}</p>
              <p className="text-xs text-gray-500">{lead.property || 'Non spécifié'}</p>
            </div>
          </div>
          <Badge variant="outline" className={getPriorityColor(priority)}>
            {priority === 'high' ? 'Haute' : priority === 'medium' ? 'Moyenne' : 'Basse'}
          </Badge>
        </div>
        <div className="mt-2 text-xs">
          <div className="flex justify-between text-gray-500 mb-1">
            <span>Valeur:</span>
            <span className="font-medium text-gray-700">{lead.value || 'Non spécifié'}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Dernier contact:</span>
            <span>
              {lead.lastContact 
                ? `il y a ${getTimeAgo(new Date(lead.lastContact))}` 
                : 'Jamais'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Logic for moving lead between columns
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus === newStatus) return;
    
    // Move lead to new status
    moveLead(leadId, newStatus as any);
    
    toast({
      title: "Lead déplacé",
      description: `Le lead a été déplacé vers "${newStatus}"`,
    });
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Function to get time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInMs / (1000 * 60))} minutes`;
    }
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} heures`;
    }
    return `${Math.floor(diffInHours / 24)} jours`;
  };

  // Define pipeline columns
  const pipelineColumns = [
    { title: 'Nouveaux leads', status: 'Nouveau lead', leads: getLeadsByStatus('Nouveau lead') },
    { title: 'Contactés', status: 'Contacté', leads: getLeadsByStatus('Contacté') },
    { title: 'Qualifiés', status: 'Qualifié', leads: getLeadsByStatus('Qualifié') },
    { title: 'En négociation', status: 'En négociation', leads: getLeadsByStatus('En négociation') },
    { title: 'Vendus', status: 'Vendu', leads: getLeadsByStatus('Vendu') },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Pipeline de vente</h2>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un lead..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="bg-luxe-blue hover:bg-luxe-blue/90"
            onClick={() => navigate('/admin/crm')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un lead
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-6">
        {pipelineColumns.map((column) => (
          <div 
            key={column.status} 
            className="flex-shrink-0 w-72"
            onDragOver={allowDrop}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <Card>
              <CardHeader className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">{column.title}</CardTitle>
                    <CardDescription>{column.leads.length} leads</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100vh-300px)] overflow-y-auto">
                {column.leads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={{
                      id: lead.id,
                      name: lead.name,
                      property: lead.propertyType,
                      value: lead.budget,
                      lastContact: lead.lastContact,
                      status: lead.status,
                      score: lead.score,
                      email: lead.email
                    }} 
                  />
                ))}
                {column.leads.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Aucun lead dans cette étape
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadPipeline;
