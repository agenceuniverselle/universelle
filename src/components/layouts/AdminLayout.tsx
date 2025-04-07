import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Building2,
  Users,
  WalletCards,
  FileText,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated && location.pathname !== '/admin') {
      navigate('/admin');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/admin/biens', label: 'Biens immobiliers', icon: <Building2 className="h-5 w-5" /> },
    { path: '/admin/investissements', label: 'Biens à Investir', icon: <TrendingUp className="h-5 w-5" /> },
    { path: '/admin/crm', label: 'CRM', icon: <UserPlus className="h-5 w-5" /> },
    { path: '/admin/users', label: 'Utilisateurs', icon: <Users className="h-5 w-5" /> },
    { path: '/admin/transactions', label: 'Transactions', icon: <WalletCards className="h-5 w-5" /> },
    { path: '/admin/content', label: 'Contenus', icon: <FileText className="h-5 w-5" /> },
    { path: '/admin/stats', label: 'Statistiques', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-luxe-blue flex items-center justify-center text-white font-bold">
                AU
              </div>
              <div>
                <h1 className="font-playfair font-bold text-luxe-blue">Agence Universelle</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md",
                    location.pathname === item.path
                      ? "bg-luxe-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <Separator className="my-6" />
            
            <div className="space-y-1">
              <button className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md w-full text-gray-700 hover:bg-gray-100">
                <Settings className="h-5 w-5 mr-3" />
                Paramètres
              </button>
              <button 
                className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md w-full text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </button>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t flex items-center">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src="" alt="Admin" />
              <AvatarFallback className="bg-luxe-blue text-white">AA</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-playfair font-semibold text-luxe-blue">{title}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
