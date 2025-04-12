import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Mail, Phone, Briefcase, Home, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useLeads } from '@/context/LeadContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientsListProps {
  type: 'leads' | 'clients';
  clientType?: 'Investisseur' | 'Acheteur' | 'Prospect' | 'all';
}

const ClientsList = ({ type, clientType = 'all' }: ClientsListProps) => {
  const { clients, getClientsByType } = useLeads();
  const [selectedType, setSelectedType] = useState<string>(clientType);
  
  const getClientsData = () => {
    if (type === 'clients') {
      if (selectedType === 'all') {
        return clients;
      } else {
        return getClientsByType(selectedType as 'Investisseur' | 'Acheteur' | 'Prospect');
      }
    } else {
      return leadsData;
    }
  };

  const leadsData = [
    {
      id: 'L001',
      name: 'Émilie Laurent',
      email: 'emilie.laurent@example.com',
      phone: '+212 6 12 34 56 78',
      status: 'Nouveau',
      score: 85,
      lastContact: '2 heures',
      nextAction: 'Appel de qualification',
      property: 'Appartement 3 pièces',
    },
    {
      id: 'L002',
      name: 'Marc Dubois',
      email: 'marc.dubois@example.com',
      phone: '+212 6 23 45 67 89',
      status: 'Contacté',
      score: 65,
      lastContact: '1 jour',
      nextAction: 'Envoyer documentation',
      property: 'Villa avec piscine',
    },
    {
      id: 'L003',
      name: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      phone: '+212 6 34 56 78 90',
      status: 'Qualifié',
      score: 90,
      lastContact: '5 heures',
      nextAction: 'Planifier visite',
      property: 'Duplex moderne',
    },
    {
      id: 'L004',
      name: 'Pierre Lefèvre',
      email: 'pierre.lefevre@example.com',
      phone: '+212 6 45 67 89 01',
      status: 'Négociation',
      score: 95,
      lastContact: '3 heures',
      nextAction: 'Suivi de l\'offre',
      property: 'Studio centre ville',
    },
    {
      id: 'L005',
      name: 'Julie Moreau',
      email: 'julie.moreau@example.com',
      phone: '+212 6 56 78 90 12',
      status: 'Inactif',
      score: 40,
      lastContact: '15 jours',
      nextAction: 'Relance',
      property: 'Terrain constructible',
    },
  ];

  const data = getClientsData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau':
        return 'bg-blue-100 text-blue-800';
      case 'Contacté':
        return 'bg-purple-100 text-purple-800';
      case 'Qualifié':
        return 'bg-green-100 text-green-800';
      case 'Négociation':
        return 'bg-amber-100 text-amber-800';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800';
      case 'Actif':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Acheteur':
        return 'bg-blue-100 text-blue-800';
      case 'Investisseur':
        return 'bg-purple-100 text-purple-800';
      case 'Prospect':
        return 'bg-amber-100 text-amber-800';
      case 'Vendeur':
        return 'bg-green-100 text-green-800';
      case 'Locataire':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getClientTypeIcon = (clientType?: string) => {
    switch (clientType) {
      case 'Investisseur':
        return <Briefcase className="mr-2 h-4 w-4" />;
      case 'Acheteur':
        return <Home className="mr-2 h-4 w-4" />;
      case 'Prospect':
        return <Users className="mr-2 h-4 w-4" />;
      default:
        return <Users className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {type === 'clients' && (
        <div className="flex justify-end mb-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              <SelectItem value="Investisseur">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Investisseurs
                </div>
              </SelectItem>
              <SelectItem value="Acheteur">
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Acheteurs
                </div>
              </SelectItem>
              <SelectItem value="Prospect">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Prospects
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nom / Contact</TableHead>
              {type === 'leads' && (
                <>
                  <TableHead>Score</TableHead>
                  <TableHead>Propriété</TableHead>
                </>
              )}
              {type === 'clients' && (
                <TableHead>Type</TableHead>
              )}
              <TableHead>Statut</TableHead>
              <TableHead>Dernier contact</TableHead>
              <TableHead>Prochaine action</TableHead>
              {type === 'clients' && (
                <TableHead>Informations</TableHead>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type === 'clients' ? 7 : 7} className="text-center py-8">
                  <p className="text-gray-500">Aucun {type === 'clients' ? 'client' : 'lead'} trouvé.</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" alt={item.name} />
                        <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" /> {item.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" /> {item.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {type === 'leads' && (
                    <>
                      <TableCell>
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium">{item.score}%</span>
                          </div>
                          <Progress value={item.score} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{item.property}</TableCell>
                    </>
                  )}
                  
                  {type === 'clients' && (
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(item.clientType || '')}>
                        <div className="flex items-center">
                          {getClientTypeIcon(item.clientType)}
                          {item.clientType || 'Non défini'}
                        </div>
                      </Badge>
                    </TableCell>
                  )}
                  
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {typeof item.lastContact === 'string' ? item.lastContact : 
                     item.lastContact ? `Il y a ${Math.floor((new Date().getTime() - new Date(item.lastContact).getTime()) / (1000 * 60 * 60 * 24))} jours` : 'N/A'}
                  </TableCell>
                  
                  <TableCell>{item.nextAction}</TableCell>
                  
                  {type === 'clients' && (
                    <TableCell>
                      {item.clientType === 'Investisseur' && item.investmentCriteria ? (
                        <span className="text-xs text-gray-700">{item.investmentCriteria}</span>
                      ) : item.clientType === 'Acheteur' && item.interestedProperty ? (
                        <span className="text-xs text-gray-700">{item.interestedProperty}</span>
                      ) : (
                        <span className="text-xs text-gray-500">Aucune information</span>
                      )}
                    </TableCell>
                  )}
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ajouter une note</DropdownMenuItem>
                          <DropdownMenuItem>Planifier une tâche</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            {type === 'leads' ? 'Supprimer le lead' : 'Archiver le client'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsList;
