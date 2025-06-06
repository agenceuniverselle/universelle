import React, { useEffect, useState } from 'react';
import { User, Role } from '@/types/users';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

// Définir un type cohérent pour les permissions
interface PermissionObject {
  id: number;
  name: string;
  description?: string;
}

type Permission = PermissionObject | string;

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  currentUserRole: Role;
  availableRoles: Role[];
  onSave: (userId: string, userData: Partial<User> & { role_id: number, permissions: string[], password?: string }) => void;
}

// Schéma de validation Zod pour le formulaire
const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  role_id: z.number().min(1, "Veuillez sélectionner un rôle"),
  role_permissions: z.array(z.number()), // Ajusté pour stocker les IDs des permissions
  password: z.string().optional(),
});

type UserEditFormValues = z.infer<typeof formSchema>;

// Fonction pour extraire les IDs des permissions
function getPermissionIds(permissions: Permission[]): number[] {
  return permissions.map(perm => {
    if (typeof perm === 'string') {
      console.log("Permission au format string:", perm);
      return 0; // Cas non géré, nécessite un ID
    } else if (typeof perm === 'object' && perm !== null) {
      console.log("Permission au format objet:", perm);
      return perm.id || 0;
    }
    return 0;
  }).filter(id => id > 0); // Filtrer les ID valides
}

export function UserEditDialog({ 
  user, 
  open, 
  onClose, 
  currentUserRole,
  availableRoles: propRoles = [], 
  onSave 
}: UserEditDialogProps) {
  // État pour stocker les rôles chargés depuis l'API
  const [roles, setRoles] = useState<Role[]>(propRoles);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Log pour vérifier les rôles reçus
  console.log("Rôles disponibles transmis via props:", propRoles);

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role_id: 0,
      role_permissions: [], // Ajusté pour stocker les IDs
      password: '',
    }
  });

  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissionNames, setSelectedPermissionNames] = useState<string[]>([]);

  // Charger les rôles depuis l'API si non fournis par les props
  useEffect(() => {
    if (propRoles && propRoles.length > 0) {
      console.log("Utilisation des rôles fournis via props:", propRoles);
      setRoles(propRoles);
    } else {
      console.log("Tentative de chargement des rôles depuis l'API...");
      fetchRoles();
    }
  }, [propRoles]);

// Initialisation à partir du user existant
useEffect(() => {
  if (user && user.permissions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = user.permissions.map((perm: any) => perm.id); // ou perm.permission_id selon structure
    setSelectedPermissionIds(ids);
    form.setValue('role_permissions', ids); // Très important : synchronise avec react-hook-form
  }
}, [user]);

  // Fonction pour charger les rôles depuis l'API
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setError("Vous devez être connecté pour accéder aux rôles.");
        return;
      }
      
      const response = await axios.get("https://back-qhore.ondigitalocean.app/api/admin/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Rôles chargés depuis l'API:", response.data.roles);
      
      if (response.data && response.data.roles && Array.isArray(response.data.roles)) {
        setRoles(response.data.roles);
      } else {
        setError("Format de réponse invalide pour les rôles");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des rôles:", err);
      setError("Impossible de charger les rôles");
    } finally {
      setLoading(false);
    }
  };

// Reset le formulaire lorsque l'utilisateur change
  useEffect(() => {
    if (user) {
      console.log("Données utilisateur chargées:", user);
      console.log("Rôle de l'utilisateur:", user.role);
      
      // Extraire les permissions de l'utilisateur
      let userPermissionIds: number[] = [];
      
      // Gestion des permissions selon leur format
      if (user.permissions) {
        if (Array.isArray(user.permissions)) {
          userPermissionIds = getPermissionIds(user.permissions as Permission[]);
        } else if (typeof user.permissions === 'object') {
          // Si permissions est un objet plutôt qu'un tableau
          userPermissionIds = Object.values(user.permissions)
.map(perm => typeof perm === 'object' && perm !== null ? (perm as {id: number}).id : 0)            .filter(id => id > 0);
        }
      }
      
      console.log("IDs de permissions extraits:", userPermissionIds);
      
      // Réinitialiser le formulaire avec les données de l'utilisateur
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role_id: user.role?.id || 0,
        role_permissions: userPermissionIds,
        password: '',
      });
      
      // Mettre à jour les permissions disponibles
      if (user.role?.permissions) {
        const rolePermissions = Array.isArray(user.role.permissions) 
          ? user.role.permissions as Permission[]
          : Object.values(user.role.permissions).map(p => p as Permission);
        
        setAvailablePermissions(rolePermissions);
        setSelectedPermissionIds(userPermissionIds);
      }
    }
  }, [user, form]);

// Gérer le changement de rôle
  const onRoleChange = (roleId: number) => {
    form.setValue('role_id', roleId);
    const selectedRole = roles.find(role => role.id === roleId);
    
    if (selectedRole && selectedRole.permissions) {
      let permissionsArray: Permission[] = [];
      
      // Gérer différents formats de données pour les permissions
      if (Array.isArray(selectedRole.permissions)) {
        permissionsArray = selectedRole.permissions as Permission[];
      } else if (typeof selectedRole.permissions === 'object') {
        // Si permissions est un objet plutôt qu'un tableau
        permissionsArray = Object.values(selectedRole.permissions).map(p => p as Permission);
      }
      
      const permissionIds = getPermissionIds(permissionsArray);
      setAvailablePermissions(permissionsArray);
      setSelectedPermissionIds(permissionIds);
      form.setValue('role_permissions', permissionIds);
      
      console.log("Rôle sélectionné:", selectedRole.name);
      console.log("Permissions disponibles:", permissionsArray);
      console.log("IDs de permissions sélectionnés:", permissionIds);
    }
  };

  // Gestion des permissions
  const togglePermission = (permId: number) => {
    const currentPermissions = form.getValues('role_permissions');
    let updatedPermissions: number[];
    
    if (currentPermissions.includes(permId)) {
      // Retirer permission
      updatedPermissions = currentPermissions.filter(id => id !== permId);
    } else {
      // Ajouter permission
      updatedPermissions = [...currentPermissions, permId];
    }

    setSelectedPermissionIds(updatedPermissions);
    form.setValue('role_permissions', updatedPermissions);
  };
useEffect(() => {
  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("https://back-qhore.ondigitalocean.app/api/admin/permissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.permissions)) {
        setAvailablePermissions(response.data.permissions);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des permissions", error);
    }
  };

  fetchPermissions();
}, []);

  // Soumission du formulaire
  const onSubmit = async (values: UserEditFormValues) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Token manquant.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone || '');
      formData.append('role_id', values.role_id.toString());

      if (values.password && values.password.trim() !== '') {
        formData.append('password', values.password);
      }

      // Ajout des permissions en utilisant role_permissions[] pour correspondre à la structure du backend
      values.role_permissions.forEach((permId, index) => {
        formData.append(`role_permissions[${index}]`, permId.toString());
      });

      // Logging des données envoyées pour le débogage
      console.log("Données envoyées au serveur:", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role_id: values.role_id,
        role_permissions: values.role_permissions
      });

      // Utilise POST + _method=PUT dans l'URL
      const response = await axios.post(
        `https://back-qhore.ondigitalocean.app/api/admin/users/${user.id}?_method=PUT`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log("Réponse du serveur:", response.data);

      // Met à jour les données utilisateur localement pour refléter les changements
      if (onSave && typeof onSave === 'function') {
        // Convertir les IDs de permission en chaînes pour le format attendu par onSave
        const permissionStrings = values.role_permissions.map(id => id.toString());
        onSave(user.id.toString(), {
          name: values.name,
          email: values.email,
          phone: values.phone,
          role_id: values.role_id,
          permissions: permissionStrings,
          password: values.password
        });
      }

      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      setError("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations, rôles et permissions de l'utilisateur
          </DialogDescription>
        </DialogHeader>
        
        {loading && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-luxe-blue" />
            <span className="ml-2">Chargement des rôles...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchRoles} 
              className="mt-2"
            >
              Réessayer
            </Button>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Champ Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nom complet" 
                      className="
                        transition-all duration-200
                        hover:border-luxe-blue/30
                        focus:scale-101
                        bg-white text-black border-gray-300
                        dark:bg-gray-900 dark:text-white dark:border-gray-700
                        dark:placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
                        dark:focus:ring-luxe-blue/30
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Champ Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email" 
                      placeholder="email@example.com" 
                      className="
                        transition-all duration-200
                        hover:border-luxe-blue/30
                        focus:scale-101
                        bg-white text-black border-gray-300
                        dark:bg-gray-900 dark:text-white dark:border-gray-700
                        dark:placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
                        dark:focus:ring-luxe-blue/30
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Champ Téléphone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="06xxxxxxxx" 
                      className="
                        transition-all duration-200
                        hover:border-luxe-blue/30
                        focus:scale-101
                        bg-white text-black border-gray-300
                        dark:bg-gray-900 dark:text-white dark:border-gray-700
                        dark:placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
                        dark:focus:ring-luxe-blue/30
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Sélection de Rôle */}
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => onRoleChange(Number(value))}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="
                        transition-all duration-200
                        hover:border-luxe-blue/30
                        bg-white text-black border-gray-300
                        dark:bg-gray-900 dark:text-white dark:border-gray-700
                        focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
                        dark:focus:ring-luxe-blue/30
                      ">
                        <SelectValue placeholder={loading ? "Chargement des rôles..." : "Sélectionner un rôle"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="
                      bg-white text-black
                      dark:bg-gray-900 dark:text-white
                      border border-gray-200 dark:border-gray-700
                    ">
                      {roles && roles.length > 0 ? (
                        roles.map((role) => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          {loading ? "Chargement..." : "Aucun rôle disponible"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Gestion des Permissions */}
            <FormField
              control={form.control}
              name="role_permissions"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-auto border rounded p-2">
                    {availablePermissions.length === 0 ? (
                      <p className="text-gray-500">Aucune permission disponible</p>
                    ) : (
                      availablePermissions.map((perm) => {
                        const permName = typeof perm === 'string' ? perm : perm.name;
                        const permId = typeof perm === 'string' ? 0 : perm.id;
                        
                        return (
                          <label key={permId} className="flex items-center space-x-2 cursor-pointer">
                            <input
  type="checkbox"
  checked={selectedPermissionIds.includes(permId)}
  onChange={() => togglePermission(permId)}
  className="cursor-pointer"
/>

                            <span>{permName}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Champ Mot de passe */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe (laisser vide pour ne pas modifier)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nouveau mot de passe"
                        className="
                          transition-all duration-200
                          hover:border-luxe-blue/30
                          focus:scale-101
                          bg-white text-black border-gray-300
                          dark:bg-gray-900 dark:text-white dark:border-gray-700
                          dark:placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
                          dark:focus:ring-luxe-blue/30
                        "
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className='dark:text-black'
              >
                Annuler
              </Button>
              <Button type="submit">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
