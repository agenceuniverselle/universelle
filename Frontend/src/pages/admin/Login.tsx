// src/pages/admin/Login.tsx
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // ✅ Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("[Login] Attempting login with:", email);
      
      // Use the login function from AuthContext
      await login(email, password);
      console.log("[Login] Login successful");

      // Navigate to dashboard on success
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("[Login] Login error:", error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion. Vérifiez vos identifiants.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-luxe-blue">Agence Universelle</h1>
          <p className="text-gray-600 mt-2">Espace Administrateur</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-playfair text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous pour accéder à votre tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-luxe-blue hover:bg-luxe-blue/90" 
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-600">
              Ceci est une zone sécurisée. Accès réservé au personnel autorisé.
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Agence Universelle d'Investissement Immobilier. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;