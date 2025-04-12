
import React from 'react';
import { Role } from '@/types/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Search, Filter, X } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string; 
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}) => {
  const roles: (Role | 'Tous')[] = [
    'Tous',
    'Super Admin',
    'Administrateur',
    'Commercial',
    'Gestionnaire CRM',
    'Investisseur',
    'Acheteur'
  ];
  
  const statuses = ['Tous', 'Active', 'Inactive', 'En attente'];
  
  const hasActiveFilters = roleFilter !== 'Tous' || statusFilter !== 'Tous';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Rechercher un utilisateur..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {hasActiveFilters && (
              <span className="ml-2 h-2 w-2 rounded-full bg-blue-600"></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Filtrer par rôle</h3>
            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <h3 className="font-medium text-sm">Filtrer par statut</h3>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2" 
                onClick={onClearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Effacer les filtres
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
