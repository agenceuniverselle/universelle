
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Investir from "./pages/Investir";
import NosServices from "./pages/NosServices";
import NosBiens from "./pages/NosBiens";
import BienDetails from "./pages/BienDetails";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

// Legal Pages
import MentionsLegales from "./pages/legal/MentionsLegales";
import CGV from "./pages/legal/CGV";
import Confidentialite from "./pages/legal/Confidentialite";
import Cookies from "./pages/legal/Cookies";

// Admin Dashboard
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBiens from "./pages/admin/Biens";
import AdminUsers from "./pages/admin/Users";
import AdminTransactions from "./pages/admin/Transactions";
import AdminContent from "./pages/admin/Content";
import AdminStats from "./pages/admin/Stats";
import AdminCRM from "./pages/admin/CRM";
import AdminInvestissements from "./pages/admin/Investissements";
import AdminPropertyDetails from "./pages/admin/PropertyDetails";
import AdminInvestissementDetailsBien from "./pages/admin/InvestissementDetailsBien";
import InvestissementEdit from "./pages/admin/InvestissementEdit";
import PropertyEdit from "./pages/admin/PropertyEdit";
import ExclusiveOfferDetails from '@/pages/admin/ExclusiveOfferDetails';
import ExclusiveOfferEdit from '@/pages/admin/ExclusiveOfferEdit';
import TestimonialEdit from '@/pages/admin/TestimonialEdit';
import BlogDetails from '@/pages/admin/BlogDetails';
import BlogEdit from '@/pages/admin/BlogEdit';
import ActivityHistory from "@/pages/admin/ActivityHistory"; 
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LeadDetails from './pages/admin/crm/LeadDetails';
import LeadEdit from './pages/admin/crm/LeadEdit';
import Settings from './pages/admin/Settings';
import BlogArticle from "./components/blog/BlogArticle";
import BlogArticlePage from "./components/blog/BlogArticlePage";
import AdminProspects from "./pages/admin/ProspectTable";
import EditProspectForm from "./pages/admin/EditProspectForm";
import InvestmentForm from "./components/properties/InvestmentForm";
import AddProspectForm from "./pages/admin/AddProspectForm";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import PourquoiNous from "./components/PourquoiNous";
import ProjetPage from "./pages/ProjetPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/investir" element={<Investir />} />
          <Route path="/nos-services" element={<NosServices />} />
          <Route path="/nos-biens" element={<NosBiens />} />
          <Route path="/bien/:id" element={<BienDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogArticlePage />} />

          {/* Legal Pages */}
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/conditions-generales-de-vente" element={<CGV />} />
          <Route path="/politique-de-confidentialite" element={<Confidentialite />} />
          <Route path="/politique-des-cookies" element={<Cookies />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/prospects" element={<AdminProspects />} />
          <Route path="/admin/prospects/edit/:id" element={<EditProspectForm />} />
          <Route path="/admin/prospects/add" element={<AddProspectForm />} />

          <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/biens" element={<AdminBiens />} />
          <Route path="/admin/investissements" element={<AdminInvestissements />} />
          <Route path="/admin/investissements/:propertyId" element={<AdminInvestissementDetailsBien />} />
          <Route path="/admin/investissements/edit/:propertyId" element={<InvestissementEdit />} />
          <Route path="/admin/biens/:bienId" element={<AdminPropertyDetails />} />
          <Route path="/admin/biens/edit/:bienId" element={<PropertyEdit />} />
          <Route path="/admin/offres-exclusives/:offerId" element={<ExclusiveOfferDetails />} />
          <Route path="/admin/offres-exclusives/edit/:offerId" element={<ExclusiveOfferEdit />} />
          <Route path="/admin/temoignages/edit/:id" element={<TestimonialEdit />} />
          <Route path="/admin/blogs/:id" element={<BlogDetails />} />
          <Route path="/admin/blogs/edit/:id" element={<BlogEdit />} />
          
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/crm" element={<AdminCRM />} />
          <Route path="/admin/crm/lead/:id" element={<LeadDetails />} />
          <Route path="/admin/crm/lead/:id/edit" element={<LeadEdit />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/activities" element={<ActivityHistory />} />

          </Route>
          <Route path="/PrivacyPolicyPage" element={<PrivacyPolicyPage />} />
          <Route path="/PourquoiNous" element={<PourquoiNous />} />
          <Route path="/admin/projet" element={<ProjetPage />}/>
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
