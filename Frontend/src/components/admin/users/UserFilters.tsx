
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
  type RoleName = 'Tous' | 'Super Admin' | 'Administrateur' | 'Commercial' | 'Gestionnaire CRM' | 'Investisseur' | 'Acheteur';

const roles: RoleName[] = [
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
          className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white pl-10 pr-10 w-full transition-all duration-200 bg-white focus:ring-2 focus:ring-luxe-blue/20 focus:border-luxe-blue focus:shadow-[0_0_0_2px_rgba(10,37,64,0.05)] focus:scale-[1.01] cursor-text"
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
        <Button 
  variant="outline" 
  size="sm" 
  className="flex items-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
>
  <Filter className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-200" />
  Filtres
  {hasActiveFilters && (
    <span className="ml-2 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
  )}
</Button>

        </PopoverTrigger>
        <PopoverContent className="w-72 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900 transition-colors">
  <div className="space-y-4 p-4">
    <h3 className="font-medium text-sm">Filtrer par rôle</h3>
    <Select value={roleFilter} onValueChange={onRoleFilterChange}>
      <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
        <SelectValue placeholder="Sélectionner un rôle" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        {roles.map((role) => (
          <SelectItem 
            key={role} 
            value={role} 
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    
    <h3 className="font-medium text-sm">Filtrer par statut</h3>
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
        <SelectValue placeholder="Sélectionner un statut" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        {statuses.map((status) => (
          <SelectItem 
            key={status} 
            value={status} 
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    
    {hasActiveFilters && (
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full mt-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
