import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MoreHorizontal, UserPlus, Eye, Edit, Trash2, MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/context/LeadContext';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface LeadsListProps {
  searchTerm?: string;
}

const LeadsList = ({ searchTerm = '' }: LeadsListProps) => {
  const { leads, moveLead, deleteLead, convertToClient } = useLeads();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmConvert, setConfirmConvert] = useState<string | null>(null);
  const [highlightNew, setHighlightNew] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const newLeadsIds = leads
      .filter(lead => {
        const createdDate = new Date(lead.createdAt);
        const now = new Date();
        return now.getTime() - createdDate.getTime() < 10 * 60 * 1000;
      })
      .map(lead => lead.id);

    if (newLeadsIds.length) {
      setHighlightNew(new Set(newLeadsIds));
      
      setTimeout(() => {
        setHighlightNew(new Set());
      }, 10000);
    }
  }, [leads]);

  const filteredLeads = leads
    .filter(lead => statusFilter === "all" || lead.status === statusFilter)
    .filter(lead => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        (lead.name && lead.name.toLowerCase().includes(search)) ||
        (lead.email && lead.email.toLowerCase().includes(search)) ||
        (lead.phone && lead.phone.toLowerCase().includes(search)) ||
        (lead.propertyType && lead.propertyType.toLowerCase().includes(search))
      );
    });

  const handleViewLead = (leadId: string) => {
    navigate(`/admin/crm/lead/${leadId}`);
  };

  const handleEditLead = (leadId: string) => {
    navigate(`/admin/crm/lead/${leadId}/edit`);
  };

  const handleConvertToClient = () => {
    if (confirmConvert) {
      convertToClient(confirmConvert);
      setConfirmConvert(null);
      toast({
        title: "Lead converti en client",
        description: "Le lead a été converti en client avec succès.",
      });
    }
  };

  const handleDeleteLead = () => {
    if (confirmDelete) {
      deleteLead(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau lead':
        return 'bg-blue-100 text-blue-800';
      case 'Contacté':
        return 'bg-purple-100 text-purple-800';
      case 'Qualifié':
        return 'bg-green-100 text-green-800';
      case 'En négociation':
        return 'bg-amber-100 text-amber-800';
      case 'Vendu':
        return 'bg-emerald-100 text-emerald-800';
      case 'Perdu':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Leads et prospects</CardTitle>
              <CardDescription>Gérez vos nouveaux contacts et prospects</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les leads</SelectItem>
                <SelectItem value="Nouveau lead">Nouveaux</SelectItem>
                <SelectItem value="Contacté">Contactés</SelectItem>
                <SelectItem value="Qualifié">Qualifiés</SelectItem>
                <SelectItem value="En négociation">En négociation</SelectItem>
                <SelectItem value="Vendu">Vendus</SelectItem>
                <SelectItem value="Perdu">Perdus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nom / Contact</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernier contact</TableHead>
                  <TableHead>Prochaine action</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Aucun lead trouvé dans cette catégorie.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className={highlightNew.has(lead.id) ? "bg-blue-50 transition-colors" : ""}
                      onClick={() => handleViewLead(lead.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src="" alt={lead.name} />
                            <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            {lead.email && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" /> {lead.email}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" /> {lead.phone}
                              </div>
                            )}
                            {lead.source && (
                              <div className="text-xs text-gray-500 mt-1">
                                <Badge variant="outline" className="text-xs font-normal">{lead.source}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium">{lead.score || 0}%</span>
                          </div>
                          <Progress 
                            value={lead.score || 0} 
                            className={getScoreColor(lead.score || 0)}
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell>{lead.propertyType || 'Non spécifié'}</TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {lead.lastContact ? `Il y a ${getTimeAgo(new Date(lead.lastContact))}` : 'Jamais'}
                      </TableCell>
                      
                      <TableCell>{lead.nextAction || 'À définir'}</TableCell>
                      
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            window.open(`mailto:${lead.email}`);
                          }}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${lead.phone}`);
                          }}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewLead(lead.id)}>
                                <Eye className="h-4 w-4 mr-2" /> Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditLead(lead.id)}>
                                <Edit className="h-4 w-4 mr-2" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setConfirmConvert(lead.id)}>
                                <UserPlus className="h-4 w-4 mr-2" /> Convertir en client
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setConfirmDelete(lead.id)} 
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
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
        </CardContent>
      </Card>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce lead ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteLead}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmConvert} onOpenChange={() => setConfirmConvert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convertir en client</DialogTitle>
            <DialogDescription>
              Voulez-vous convertir ce lead en client ? Il sera déplacé vers la base clients.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmConvert(null)}>Annuler</Button>
            <Button 
              className="bg-luxe-blue hover:bg-luxe-blue/90" 
              onClick={handleConvertToClient}
            >
              <MoveRight className="h-4 w-4 mr-2" /> Convertir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsList;
