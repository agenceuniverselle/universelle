
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  MoreHorizontal 
} from 'lucide-react';

interface Testimonial {
  id: string;
  client: string;
  rating: number;
  content: string;
  status: string;
  date: string;
}

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  getStatusColor: (status: string) => string;
  renderStars: (rating: number) => JSX.Element;
}

const TestimonialsTab: React.FC<TestimonialsTabProps> = ({
  testimonials,
  getStatusColor,
  renderStars
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un témoignage..." 
              className="pl-10"
            />
          </div>
        </div>
        <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un témoignage
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Témoignages clients</CardTitle>
              <CardDescription>Gérez les avis et témoignages de vos clients</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Évaluation</TableHead>
                  <TableHead>Témoignage</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.id}</TableCell>
                    <TableCell>{testimonial.client}</TableCell>
                    <TableCell>{renderStars(testimonial.rating)}</TableCell>
                    <TableCell>
                      <p className="truncate max-w-xs">{testimonial.content}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(testimonial.status)}>
                        {testimonial.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{testimonial.date}</TableCell>
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
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {testimonial.status === 'En attente' ? (
                            <DropdownMenuItem>Approuver</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Masquer</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
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
    </>
  );
};

export default TestimonialsTab;
