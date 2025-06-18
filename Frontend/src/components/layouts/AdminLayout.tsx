import React, { ReactNode, useState, useEffect,useRef  } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDarkMode } from "@/context/DarkModeContext"; // ✅ IMPORTER DARK MODE
import { useNotifications } from "@/hooks/use-notifications"; // 🔔 Assure-toi que ce hook est importé
import { useClickOutside } from "@/hooks/use-click-outside";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Sun,
  Moon,
  BrickWall,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";


interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}
// ✅ Fonction pour obtenir les initiales d'un nom
const getInitials = (name: string): string => {
  if (!name) return "AA";
  const parts = name.split(" ");
  const initials = parts.map((part) => part[0]).join("").toUpperCase();
  return initials.length > 2 ? initials.slice(0, 2) : initials;
};
const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // ✅ UTILISER DARK MODE
  const { isAuthenticated, user, logout, permissions } = useAuth();
  const { toast } = useToast();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false); // 👈 ouvrir/fermer le menu
  const notifRef = useRef<HTMLDivElement>(null);
  useClickOutside(notifRef, () => setIsNotifOpen(false));
  const handleNotificationClick = async (notif: Notification) => {
  await markAsRead(notif.id);

  // Redirection selon le type
  switch (notif.type) {
    case "contact":
      navigate("/admin/prospects");
      break;
    case "comment":
      navigate("/admin/prospects");
      break;
    case "reaction":
      navigate("/admin/prospects"); 
      break;
    case "investor":
      navigate("/admin/prospects");
      break;
       case "message":
      navigate("/admin/prospects"); 
      break;
       case "newsletter":
      navigate("/admin/prospects"); 
      break;
       case "offer":
      navigate("/admin/prospects"); 
      break;
       case "expert_contact":
      navigate("/admin/investissements"); 
      break;
       case "message":
      navigate("/admin/prospects"); 
      break;
        case "conseiller":
      navigate("/admin/investissements"); 
      break;
      case "rating":
      navigate("/admin/content"); 
      break;
    default:
      // fallback
      navigate("/admin/dashboard");
      break;
  }
};

  const handleLogout = async () => {
  try {
    await logout(); // 🔄 Attendre que le logout finisse
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });

    navigate("/univ-2025", { replace: true }); // ✅ Navigation forcée
  } catch (error) {
    toast({
      title: "Erreur de déconnexion",
      description: "Veuillez réessayer.",
      variant: "destructive",
    });
  }
};

if (!isAuthenticated) {
    return null;
  }
  const getInitials = (name: string) => {
    if (!name) return "AA";
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
    return initials;
  };
// ✅ Fonction pour obtenir les éléments du menu en fonction des permissions
const getNavItems = () => {
  return [
    { 
      path: "/admin/dashboard", 
      label: "Tableau de bord", 
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    permissions.includes("view_properties") && {
      path: "/admin/biens",
      label: "Biens immobiliers",
      icon: <Building2 className="h-5 w-5" />,
    },
    permissions.includes("view_investments") && {
      path: "/admin/investissements",
      label: "Biens à Investir",
      icon: <TrendingUp className="h-5 w-5" />,
    },
     { 
      path: "/admin/projet", 
      label: "Projet Réalisé", 
      icon: <BrickWall className="h-5 w-5" />,
    },
 {
  path: "/admin/prospects",
  label: "Prospects",
  icon: <UserPlus className="h-5 w-5" />,
},

     /* { 
      path: "/admin/crm", 
      label: "CRM", 
      icon: <UserPlus className="h-5 w-5" />,
    },*/
    permissions.includes("view_users") && {
      path: "/admin/users",
      label: "Utilisateurs",
      icon: <Users className="h-5 w-5" />,
    },
    /*{ 
      path: "/admin/transactions", 
      label: "Transactions", 
      icon: <WalletCards className="h-5 w-5" />,
    }, */
    permissions.includes("view_blogs") && {
      path: "/admin/content",
      label: "Contenus",
      icon: <FileText className="h-5 w-5" />,
    },
    { 
      path: "/admin/stats", 
      label: "Statistiques", 
      icon: <BarChart3 className="h-5 w-5" />,
    },
  
  ].filter(Boolean); // ✅ Filtrer les éléments non autorisés
};


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900"> {/* ✅ GESTION DU MODE SOMBRE */}
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
    "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-r dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  )}
>
  <div className="flex flex-col h-full">
    <div className="p-4 border-b dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
          <img 
            src="/Cap2.png"  // ✅ Chemin de ton logo
            alt="Agence Universelle" 
            className="w-full h-full object-contain" 
          />
        </div>
        <div>
          <h1 className="font-playfair font-bold text-luxe-blue dark:text-white">Agence Universelle</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user ? user.role : "Utilisateur Inconnu"} Panel
          </p>
        </div>
      </div>
    </div>
    
    <ScrollArea className="flex-1 py-4 px-3">
      <nav className="space-y-1">
        {getNavItems().map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-md",
              location.pathname === item.path
                ? "bg-luxe-blue text-white dark:bg-blue-600 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      
      <Separator className="my-6 dark:border-gray-700" />
      
      {/*  <div className="space-y-1">
        <button 
          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-600/20 mt-20" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </button>
      </div>*/}
    </ScrollArea>
    
    <div className="p-4 border-t dark:border-gray-700 flex items-center">
      <Avatar className="h-8 w-8 mr-3 bg-luxe-blue text-white flex items-center justify-center rounded-full">
        <AvatarFallback className="bg-luxe-blue text-white">
          {user ? getInitials(user.name) : "AA"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium dark:text-white">{user ? user.name : "Utilisateur Inconnu"}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user ? user.email : "admin@example.com"}</p>
      </div>
    </div>
  </div>
</aside>

      
<div className="flex-1 flex flex-col overflow-hidden">
  <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex items-center justify-between">
    <h1 className="text-xl font-playfair font-semibold text-luxe-blue dark:text-white">{title}</h1>
    <div className="flex items-center space-x-4">
  <Button 
    onClick={toggleDarkMode} 
    variant="outline" 
    size="icon" 
    className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
  >
    {isDarkMode ? (
      <Sun className="h-5 w-5 text-yellow-400" />
    ) : (
      <Moon className="h-5 w-5 text-blue-500" />
    )}
  </Button>

<div className="relative" ref={notifRef}>

  <Button
    variant="outline"
    size="icon"
    onClick={() => setIsNotifOpen((prev) => !prev)}
    className="relative bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
  >
    <Bell className="h-5 w-5 text-gray-700 dark:text-gray-200" />
    {unreadCount > 0 && (
      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
    )}
  </Button>

  {isNotifOpen && (
    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-md z-50">
      <div className="px-4 py-2 border-b dark:border-gray-700 font-semibold text-sm text-gray-800 dark:text-gray-200">
        Notifications
      </div>
      <ul className="max-h-60 overflow-y-auto text-sm divide-y dark:divide-gray-700">
        {notifications.length === 0 ? (
          <li className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">Aucune notification</li>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <li
              key={notif.id}
              className={cn(
                "px-4 py-2 cursor-pointer transition-colors",
                !notif.is_read
                  ? "bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
              onClick={() => handleNotificationClick(notif)}
            >
              <p className="font-medium text-gray-700 dark:text-gray-100">{notif.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(notif.created_at).toLocaleString()}
              </p>
            </li>
          ))
        )}
      </ul>
      <div className="px-4 py-2 text-xs text-right text-blue-500 hover:underline cursor-pointer">
        Voir toutes les notifications
      </div>
    </div>
  )}
</div>
   <Button
        onClick={handleLogout}
        variant="outline"
        size="icon"
        className="bg-white dark:bg-gray-700 dark:text-red-400 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-600/20"
      >
        <LogOut className="h-5 w-5" />
      </Button>
</div>

  </header>

  <main className="flex-1 overflow-auto p-4 md:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    {children}
  </main>
</div>
</div>
  );
};

export default AdminLayout;
