
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Filter, FileDown, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AdminTransactions = () => {
  // Mock data for transactions
  const transactions = [
    {
      id: 'TR001',
      property: 'Villa de luxe - Casablanca',
      propertyId: 'P001',
      buyer: 'Marie Leclerc',
      amount: '5,200,000 MAD',
      date: '15/03/2024',
      status: 'Complétée',
      paymentMethod: 'Virement bancaire',
      documents: ['contrat.pdf', 'facture.pdf']
    },
    {
      id: 'TR002',
      property: 'Appartement vue mer - Rabat',
      propertyId: 'P002',
      buyer: 'Jean Moreau',
      amount: '2,800,000 MAD',
      date: '12/03/2024',
      status: 'En cours',
      paymentMethod: 'Paiement échelonné',
      documents: ['reservation.pdf']
    },
    {
      id: 'TR003',
      property: 'Terrain constructible - Agadir',
      propertyId: 'P005',
      buyer: 'Ahmed Benjelloun',
      amount: '1,200,000 MAD',
      date: '05/03/2024',
      status: 'Acompte versé',
      paymentMethod: 'Chèque',
      documents: ['compromis.pdf']
    },
    {
      id: 'TR004',
      property: 'Riad traditionnel - Marrakech',
      propertyId: 'P004',
      buyer: 'Sophie Martin',
      amount: '3,950,000 MAD',
      date: '28/02/2024',
      status: 'Annulée',
      paymentMethod: '-',
      documents: ['annulation.pdf']
    },
    {
      id: 'TR005',
      property: 'Bureau open space - Tanger',
      propertyId: 'P003',
      buyer: 'Entreprise Globex',
      amount: '4,500,000 MAD',
      date: '15/02/2024',
      status: 'Complétée',
      paymentMethod: 'Virement bancaire',
      documents: ['contrat.pdf', 'facture.pdf', 'transfert.pdf']
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complétée':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Acompte versé':
        return 'bg-amber-100 text-amber-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Gestion des transactions">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Rechercher une transaction..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
              <FileText className="h-4 w-4 mr-2" />
              Nouveau rapport
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Transactions immobilières</CardTitle>
                <CardDescription>Suivi des ventes et paiements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Bien immobilier</TableHead>
                    <TableHead>Acheteur</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.property}</div>
                          <div className="text-xs text-gray-500">ID: {transaction.propertyId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.buyer}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {transaction.documents.map((doc, index) => (
                            <Button key={index} variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc.split('.')[0]}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier le statut</DropdownMenuItem>
                            <DropdownMenuItem>Ajouter un document</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Générer une facture</DropdownMenuItem>
                            <DropdownMenuItem>Envoyer un rappel</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Annuler la transaction</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
