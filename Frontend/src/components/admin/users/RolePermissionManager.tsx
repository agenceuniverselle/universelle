import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Edit2, Plus, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext"; // ✅ Importer le contexte d'authentification

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

const RolePermissionManager: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const { toast } = useToast();
  const { permissions } = useAuth(); // ✅ Récupérer les permissions de l'utilisateur connecté

  useEffect(() => {
    fetchRoles();
  }, []);

  // ✅ Permissions dynamiques
  const canViewRoles = permissions.includes("view_roles");
  const canCreateRoles = permissions.includes("create_roles");
  const canEditRoles = permissions.includes("edit_roles");
  const canDeleteRoles = permissions.includes("delete_roles");

  // ✅ Récupération des rôles depuis l'API
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/admin/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data.roles);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les rôles.",
        variant: "destructive",
      });
    }
  };

  // ✅ Fonction pour ajouter un nouveau rôle
  const addNewRole = async () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du rôle est requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/admin/roles",
        {
          name: newRoleName,
          description: newRoleDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRoles([...roles, response.data.role]);
      setIsAddingRole(false);
      setNewRoleName("");
      setNewRoleDescription("");
      toast({
        title: "Succès",
        description: "Le rôle a été créé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la création.",
        variant: "destructive",
      });
    }
  };

  // ✅ Fonction pour annuler la création
  const cancelAddingRole = () => {
    setIsAddingRole(false);
    setNewRoleName("");
    setNewRoleDescription("");
  };

  if (!canViewRoles) {
    return <p className="text-center text-gray-500">Vous n'avez pas la permission de voir les rôles.</p>;
  }

  return (
    <Card className="mt-6 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-300">
      <CardHeader className="border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="dark:text-white">Gestion des rôles et permissions</CardTitle>
            <CardDescription className="dark:text-gray-300">Définissez les rôles et leurs permissions associées</CardDescription>
          </div>
          {!isAddingRole && canCreateRoles && ( // ✅ Bouton affiché uniquement si permission de créer
            <Button onClick={() => setIsAddingRole(true)}
            className="bg-luxe-blue hover:bg-luxe-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
              Nouveau rôle
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAddingRole ? (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="text-lg font-semibold">Nouveau rôle</h3>
            <div className="space-y-2">
              <Input
                placeholder="Nom du rôle"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelAddingRole}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={addNewRole}>
                <Save className="h-4 w-4 mr-2" />
                Créer le rôle
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" dark:text-gray-300">Rôle</TableHead>
                  <TableHead className=" dark:text-gray-300">Description</TableHead>
                  <TableHead className=" dark:text-gray-300">Permissions</TableHead>
                  {canEditRoles || canDeleteRoles ? (
                    <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {role.permissions.length} permissions
                      </Badge>
                    </TableCell>
                    {(canEditRoles || canDeleteRoles) && (
                      <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={!canEditRoles}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export { RolePermissionManager };
