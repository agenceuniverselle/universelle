import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        
        switch(user.role) {
          case 'Super Admin':
          case 'Administrateur':
            navigate('/admin/dashboard');
            break;
          case 'Commercial':
            navigate('/admin/crm');
            break;
          case 'Gestionnaire CRM':
            navigate('/admin/crm');
            break;
          case 'Investisseur':
            navigate('/admin/investissements');
            break;
          case 'Acheteur':
          case 'Client Acheteur':
            navigate('/admin/biens');
            break;
          default:
            navigate('/admin/dashboard');
            break;
        }
      }
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const storedUsers = localStorage.getItem('appUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    console.log("Tentative de connexion avec:", email, password);
    console.log("Utilisateurs disponibles:", users);
    
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ 
          email, 
          role: 'Super Admin',
          name: 'Admin Demo' 
        }));
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace administrateur",
        });
        
        navigate('/admin/dashboard');
      } 
      else {
        const user = users.find((u: any) => u.email === email);
        
        if (user) {
          console.log("Utilisateur trouvé:", user);
          console.log("Mot de passe soumis:", password);
          console.log("Mot de passe stocké:", user.password);
          
          if (
            (user.password && user.password === password) || 
            password === 'admin123' // Fallback password pour test
          ) {
            if (user.status === 'Active') {
              localStorage.setItem('adminAuth', 'true');
              localStorage.setItem('currentUser', JSON.stringify({ 
                email: user.email, 
                role: user.role,
                name: user.name 
              }));
              
              const updatedUsers = users.map((u: any) => 
                u.email === email 
                  ? { ...u, lastLogin: new Date().toLocaleDateString('fr-FR') } 
                  : u
              );
              localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
              
              toast({
                title: "Connexion réussie",
                description: `Bienvenue ${user.name}`,
              });
              
              switch(user.role) {
                case 'Super Admin':
                case 'Administrateur':
                  navigate('/admin/dashboard');
                  break;
                case 'Commercial':
                  navigate('/admin/crm');
                  break;
                case 'Gestionnaire CRM':
                  navigate('/admin/crm');
                  break;
                case 'Investisseur':
                  navigate('/admin/investissements');
                  break;
                case 'Acheteur':
                case 'Client Acheteur':
                  navigate('/admin/biens');
                  break;
                default:
                  navigate('/admin/dashboard');
                  break;
              }
            } else {
              toast({
                title: "Accès refusé",
                description: "Votre compte est désactivé. Veuillez contacter l'administrateur.",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Échec de la connexion",
              description: "Mot de passe incorrect",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Échec de la connexion",
            description: "Aucun compte trouvé avec cet email",
            variant: "destructive",
          });
        }
      }
      
      setIsLoading(false);
    }, 1500);
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <a 
                      href="#" 
                      className="text-sm text-gold hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: "Réinitialisation du mot de passe",
                          description: "Fonctionnalité à implémenter",
                        });
                      }}
                    >
                      Mot de passe oublié?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-luxe-blue hover:bg-luxe-blue/90" disabled={isLoading}>
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
