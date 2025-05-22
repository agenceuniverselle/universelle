import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { UserFormValues } from "@/hooks/useUserManagement";
import { Permission, Role } from "@/types/users";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Circle } from "lucide-react";

interface UserPermissionsFormProps {
  formData: UserFormValues;
  onChange: (field: keyof UserFormValues, value: string | number | boolean | string[] | number[]) => void;
}

const UserPermissionsForm: React.FC<UserPermissionsFormProps> = ({ formData, onChange }) => {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    loadAllPermissions();
  }, []);

 useEffect(() => {
  if (!formData.customPermissions && formData.role) {
    loadPermissionsForRole(formData.role.id); // ✅ utiliser formData.role.id
  }
}, [formData.role, formData.customPermissions]);


  // ✅ Charger toutes les permissions disponibles
  const loadAllPermissions = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/admin/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllPermissions(response.data.permissions);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les permissions.",
        variant: "destructive",
      });
    }
  };

  // ✅ Charger les permissions associées au rôle sélectionné
  const loadPermissionsForRole = async (roleId: number | string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/admin/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = response.data.roles.find((r: Role) => r.id === Number(roleId));

if (role && role.permissions.length > 0) {
  const permissions = role.permissions.map((perm: Permission) => perm.name);


        setRolePermissions(permissions);
        if (!formData.customPermissions) {
          onChange("permissions", permissions);
        }
      } else {
        setRolePermissions([]);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les permissions de rôle.",
        variant: "destructive",
      });
    }
  };

  // ✅ Gérer le changement de permission


// ✅ Gérer la sélection de toutes les permissions
const handleSelectAllPermissions = (checked: boolean) => {
  if (checked) {
    const allPermissionNames = allPermissions.map((perm) => perm.name);
    onChange("permissions", allPermissionNames);
  } else {
    onChange("permissions", []);
  }
};

  // ✅ Catégoriser les permissions
  const categorizedPermissions = {
    "Utilisateurs": allPermissions.filter((perm) => perm.name.includes("users")),
    "Rôles & Permissions": allPermissions.filter((perm) => perm.name.includes("roles")),
    "Biens immobiliers": allPermissions.filter((perm) => perm.name.includes("properties")),
    "Investissements": allPermissions.filter((perm) => perm.name.includes("investments")),
    "Offres Exclusives": allPermissions.filter((perm) => perm.name.includes("exclusive_offers")), // ✅ Ajouté
    "Blogs": allPermissions.filter((perm) => perm.name.includes("blogs")),
    "Témoignages": allPermissions.filter((perm) => perm.name.includes("testimonials")),
    "Messages & Contacts": allPermissions.filter((perm) => perm.name.includes("contacts")),
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="customPermissions">Permissions personnalisées</Label>
          <Switch
            id="customPermissions"
            checked={formData.customPermissions}
            onCheckedChange={(checked) => onChange("customPermissions", checked)}
          />
        </div>
        <p className="text-sm text-gray-500">
          Par défaut, les permissions sont définies selon le rôle sélectionné.
        </p>
      </div>

      <Card className="dark:bg-gray-800">
        <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-gray-100">
            <span className="text-2xl ">👤</span> Permissions de l'utilisateur
          </h3>
          <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => handleSelectAllPermissions(!(formData.permissions.length === allPermissions.length))}
      >
        {formData.permissions.length === allPermissions.length && allPermissions.length > 0 ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
        <span className="text-sm font-semibold dark:text-gray-100">Tout sélectionner</span>
      </div>
    </div>

          <div className="mt-4 space-y-4 ">
            {Object.entries(categorizedPermissions).map(([category, permissions]) => (
              permissions.length > 0 && (
                <div key={category} className="mb-4">
                  <h4 className="text-md font-semibold mb-2 dark:text-gray-100">{category}</h4>
                  <ul className="space-y-1">
                    {permissions.map((perm) => (
                      <li key={perm.id} className="flex items-center gap-2 cursor-pointer dark:text-gray-100" >
                        {formData.permissions.includes(perm.name) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <span>{perm.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPermissionsForm;
