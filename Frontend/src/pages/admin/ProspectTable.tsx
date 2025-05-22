import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BadgePercent, Plus, Pencil, Trash2, Search, Home, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

type Prospect = {
  id: number;
  property_id: number;
  montant_investissement: string;
  type_participation: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nationalite: string;
  adresse: string;
  commentaire: string | null;
  created_at: string;
  updated_at: string;
};
type Message = {
  id: number;
  bien_id: number;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
  visit_type: string | null;
  visit_date: string | null;
  message: string | null;
  created_at: string;
};
type Comment = {
  id: number;
  blog_article_id: number;
  first_name: string;
  last_name: string;
  email: string;
  content: string;
  parent_id: number | null;
  created_at: string;
  replies?: Comment[];
};
type Offer = {
  id: number;
  bien_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  offer: string;
  financing: 'cash' | 'mortgage' | 'other';
  message: string | null;
  created_at: string;
  updated_at: string;
};


// New types for Contact and Newsletter
type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  purpose: string;
  message: string;
  created_at: string;
};

type Newsletter = {
  id: number;
  email: string;
  created_at: string;
};

const AdminProspects = () => {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'prospect' | 'message'| 'commentaire'|'offer'|'contact'|'newsletter'; id: number } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activeView, setActiveView] = useState<'investisseurs' | 'messages' | 'commentaires' | 'offers' | 'contact' | 'newsletter'>('investisseurs');
  const [messages, setMessages] = useState<Message[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  // Effet pour charger les données initiales (investisseurs)
  useEffect(() => {
    const fetchInvestorRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/investor-requests');
        // Make sure the data structure matches our expectation
        const data = res.data?.data || [];
        setProspects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur API:', error);
        toast({ title: 'Erreur lors du chargement des investisseurs.' });
        setProspects([]); // Initialize with empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvestorRequests();
  }, []);
  
  // Effet pour charger les messages
  useEffect(() => {
    if (activeView === 'messages') {
      fetchMessages();
    }
  }, [activeView]);
  
  // Effet pour charger les commentaires
  useEffect(() => {
    if (activeView === 'commentaires') {
      fetchBlogComments();
    }
  }, [activeView]);

  // Effet pour charger les contacts
  useEffect(() => {
    if (activeView === 'contact') {
      fetchContacts();
    }
  }, [activeView]);

  // Effet pour charger les newsletters
  useEffect(() => {
    if (activeView === 'newsletter') {
      fetchNewsletters();
    }
  }, [activeView]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/messages');
      console.log("Messages response:", response.data); // Pour vérification

      setMessages(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      toast({ title: 'Erreur lors du chargement des messages.' });
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Nouvelle fonction pour récupérer tous les commentaires
  const fetchBlogComments = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les commentaires
      const res = await axios.get('http://localhost:8000/api/comments');
      
      console.log("Comments response:", res.data);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      toast({ title: 'Erreur lors du chargement des commentaires.' });
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      // À remplacer par votre endpoint API réel
      const response = await axios.get('http://localhost:8000/api/contacts');
      console.log("Contacts response:", response.data);
      
      setContacts(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      toast({ title: 'Erreur lors du chargement des contacts.' });
      setContacts([]); // Initialiser avec un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les abonnés à la newsletter
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      // À remplacer par votre endpoint API réel
      const response = await axios.get('http://localhost:8000/api/newsletters');
      console.log("Newsletters response:", response.data);
      
      setNewsletters(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des abonnés à la newsletter:', error);
      toast({ title: 'Erreur lors du chargement des abonnés à la newsletter.' });
      setNewsletters([]); // Initialiser avec un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };
// Filtrage des offres avec protection contre les undefined
 const filteredOffers = activeView === 'offers' ? offers.filter(o =>
  (
    `${o.first_name} ${o.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.financing.toLowerCase().includes(searchTerm.toLowerCase())
  )
) : [];

  // Fonction pour récupérer les offres
 const fetchOffers = async () => {
  try {
    setLoading(true);
    const response = await axios.get('http://localhost:8000/api/offers');
    console.log("Offers response:", response.data); // Pour vérification
    
    // Vérifiez la structure exacte de la réponse
    if (response.data?.data) {
      // Si les données sont dans un objet avec une propriété 'data'
      setOffers(Array.isArray(response.data.data) ? response.data.data : []);
    } else {
      // Si les données sont directement dans response.data
      setOffers(Array.isArray(response.data) ? response.data : []);
    }
    
    // Pour débogage
    console.log("Données d'offres après traitement:", 
      Array.isArray(response.data?.data) ? response.data.data : 
      (Array.isArray(response.data) ? response.data : []));
      
  } catch (error) {
    console.error('Erreur lors du chargement des offres:', error);
    toast({ title: 'Erreur lors du chargement des offres.' });
    setOffers([]);
  } finally {
    setLoading(false);
  }
};

// Assurez-vous que cette fonction est appelée quand activeView change à 'offers'
useEffect(() => {
  if (activeView === 'offers') {
    fetchOffers();
  }
}, [activeView]);

// Assurez-vous également que le composant affiche correctement les offres filtrées
// Vérifiez cette partie dans votre composant de rendu
console.log("Offres filtrées à afficher:", filteredOffers);

  // Filtrage des prospects avec protection contre les undefined
  const filteredProspects = activeView === 'investisseurs' ? prospects.filter(p =>
    p && p.nom && typeof p.nom === 'string' && p.nom.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Filtrage des messages avec protection contre les undefined
  const filteredMessages = activeView === 'messages' ? messages.filter(m =>
    m && m.name && typeof m.name === 'string' && m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m && m.email && typeof m.email === 'string' && m.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  // Filtrage des commentaires avec protection contre les undefined
  const filteredComments = activeView === 'commentaires' ? comments.filter(c =>
    (c && c.first_name && typeof c.first_name === 'string' && c.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.last_name && typeof c.last_name === 'string' && c.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.content && typeof c.content === 'string' && c.content.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  

  // Filtrage des contacts avec protection contre les undefined
  const filteredContacts = activeView === 'contact' ? contacts.filter(c => 
    (c && c.name && typeof c.name === 'string' && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.email && typeof c.email === 'string' && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.purpose && typeof c.purpose === 'string' && c.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // Filtrage des newsletters avec protection contre les undefined
  const filteredNewsletters = activeView === 'newsletter' ? newsletters.filter(n => 
    n && n.email && typeof n.email === 'string' && n.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setLoading(true);

      if (deleteTarget.type === 'prospect') {
        await axios.delete(`http://localhost:8000/api/investor-requests/${deleteTarget.id}`);
        setProspects(prev => prev.filter(p => p.id !== deleteTarget.id));
        toast({ title: 'Prospect supprimé avec succès.' });
      } else if (deleteTarget.type === 'message') {
        await axios.delete(`http://localhost:8000/api/messages/${deleteTarget.id}`);
        setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
        toast({ title: 'Message supprimé avec succès.' });
      } else if (deleteTarget.type === 'commentaire') {
        await axios.delete(`http://localhost:8000/api/comments/${deleteTarget.id}`);
        setComments(prev => prev.filter(c => c.id !== deleteTarget.id));
        toast({ title: 'Commentaire supprimé avec succès.' });
      } else if (deleteTarget.type === 'offer') {
        await axios.delete(`http://localhost:8000/api/offers/${deleteTarget.id}`);
        setOffers(prev => prev.filter(o => o.id !== deleteTarget.id));
        toast({ title: 'Offre supprimée avec succès.' });
      } else if (deleteTarget.type === 'contact') {
        await axios.delete(`http://localhost:8000/api/contacts/${deleteTarget.id}`);
        setContacts(prev => prev.filter(c => c.id !== deleteTarget.id));
        toast({ title: 'Contact supprimé avec succès.' });
      } else if (deleteTarget.type === 'newsletter') {
        await axios.delete(`http://localhost:8000/api/newsletters/${deleteTarget.id}`);
        setNewsletters(prev => prev.filter(n => n.id !== deleteTarget.id));
        toast({ title: 'Abonné supprimé avec succès.' });
      }

    } catch (error) {
      toast({ title: 'Erreur lors de la suppression.' });
    } finally {
      setLoading(false);
      setDeleteTarget(null);
      setDeleteConfirmOpen(false);
    }
  };
  if (!activeView) {
    return (
      <AdminLayout title="Gestion des prospects">
        <div className="text-center p-10 text-red-600 font-semibold">
          Vous n'avez pas la permission de voir cette page.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des prospects">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un prospect..."
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white pl-10 pr-10 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
          {activeView === 'investisseurs' && (
  <Button
    variant="default"
    onClick={() => navigate('/admin/prospects/add')}
    className="bg-luxe-blue hover:bg-luxe-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center gap-2"
  >
    <Plus className="w-4 h-4" />
    Ajouter Prospect
  </Button>
)}


      </div>
<div className="flex mb-4">
  <div className="flex space-x-2 border p-1 rounded-md bg-white dark:bg-gray-800 shadow-sm ">
    <Button
      onClick={() => setActiveView('investisseurs')}
      className={`flex items-center gap-2 ${
        activeView === 'investisseurs'
          ? 'bg-gold text-white'
          : 'bg-white text-black hover:bg-gold hover:text-white transition-colors duration-300'
      }`}
    >
      <Home className="h-4 w-4" />
      <span className="hidden sm:inline">Les investisseurs</span>
    </Button>

    <Button
      onClick={() => setActiveView('messages')}
      className={`flex items-center gap-2 ${
        activeView === 'messages'
          ? 'bg-gold text-white'
          : 'bg-white text-black hover:bg-gold hover:text-white transition-colors duration-300'
      }`}
    >
      <BadgePercent className="h-4 w-4" />
      <span className="hidden sm:inline">Les messages</span>
    </Button>

    <Button
      onClick={() => setActiveView('commentaires')}
      className={`flex items-center gap-2 ${
        activeView === 'commentaires'
          ? 'bg-gold text-white'
          : 'bg-white text-black hover:bg-gold hover:text-white transition-colors duration-300'
      }`}
    >
      {/* Icône commentaire */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-3 8a9 9 0 110-18 9 9 0 010 18z" />
      </svg>
      <span className="hidden sm:inline">Commentaires</span>
    </Button>

    <Button
      onClick={() => setActiveView('offers')}
      className={`flex items-center gap-2 ${
        activeView === 'offers'
          ? 'bg-gold text-white'
          : 'bg-white text-black hover:bg-gold hover:text-white transition-colors duration-300'
      }`}
    >
      {/* Icône offre */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h6m-3 8a9 9 0 110-18 9 9 0 010 18z" />
      </svg>
      <span className="hidden sm:inline">Offre proposée</span>
    </Button>

    <Button
      onClick={() => setActiveView('contact')}
      className={`flex items-center gap-2 ${
        activeView === 'contact'
          ? 'bg-gold text-white'
          : 'bg-white text-black hover:bg-gold hover:text-white transition-colors duration-300'
      }`}
    >
      {/* Icône contact */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 4H8m8-8H8m-2 8v2a2 2 0 002 2h8a2 2 0 002-2v-2m-12 0V8a2 2 0 012-2h8a2 2 0 012 2v4" />
      </svg>
      <span className="hidden sm:inline">Contact</span>
    </Button>

    <Button
      onClick={() => setActiveView('newsletter')}
      className={`flex items-center gap-2 ${
        activeView === 'newsletter'
          ? 'bg-gold text-white'
          : 'bg-white text-black hover:bg-gold hover:text-white transition-colors duration-300'
      }`}
    >
      {/* Icône newsletter */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19 14V8a7 7 0 10-14 0v6m7 3v1a3 3 0 11-6 0v-1m12 0a3 3 0 01-6 0v-1" />
      </svg>
      <span className="hidden sm:inline">Newsletter</span>
    </Button>
  </div>
</div>


      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
        </div>
      ) : (
        <>
          {activeView === 'investisseurs' && (
            <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Les investisseurs</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Liste des prospects intéressés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">ID</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Prospect</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Montant investissement</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Type participation</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Nationalité</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Adresse</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Commentaire</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Date création</TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredProspects.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{p.prenom} {p.nom}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{p.email}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{p.telephone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{p.montant_investissement}</TableCell>
                        <TableCell>{p.type_participation}</TableCell>
                        <TableCell>{p.nationalite}</TableCell>
                        <TableCell>{p.adresse}</TableCell>
                        <TableCell>{p.commentaire || '-'}</TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-2">
                          
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>navigate(`/admin/prospects/edit/${p.id}`)}
                                className="flex items-center gap-1 text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                         
                              </Button>
                        
                              <>
                                <Button
  variant="destructive"
  size="sm"
  onClick={() => {
    setDeleteTarget({ type: 'prospect', id: p.id });
    setDeleteConfirmOpen(true);
  }}
>
  <Trash2 className="w-4 h-4" />
</Button>

                              </>
                     
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProspects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                          Aucun prospect trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeView === 'messages' && (
             <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Les messages</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Liste des messages des prospects
                </CardDescription>
              </CardHeader>
              <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id </TableHead>
            <TableHead>Id du bien</TableHead>
            <TableHead>Prospects</TableHead>
            <TableHead>Méthode de contact</TableHead>
            <TableHead>Type de visite</TableHead>
            <TableHead>Date de visite</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Envoyé le</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMessages.map(m => (
            <TableRow key={m.id}>
              <TableCell>{m.id}</TableCell>
              <TableCell>{m.bien_id}</TableCell>
                <TableCell>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong>{m.name}</strong>
            <span>{m.email}</span>
            <span>{m.phone}</span>
          </div>
        </TableCell>
              <TableCell>{m.contact_method}</TableCell>
              <TableCell>{m.visit_type || '—'}</TableCell>
              <TableCell>{m.visit_date ? new Date(m.visit_date).toLocaleDateString() : '—'}</TableCell>
              <TableCell>{m.message || '—'}</TableCell>
              <TableCell>{m.created_at ? new Date(m.created_at).toLocaleString() : '—'}</TableCell>
              <TableCell>
                <Button
  variant="destructive"
  size="sm"
  onClick={() => {
    setDeleteTarget({ type: 'message', id: m.id });
    setDeleteConfirmOpen(true);
  }}
>
  <Trash2 className="w-4 h-4" />
</Button>

              </TableCell>
            </TableRow>
          ))}
          {filteredMessages.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                Aucun message trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
       </CardContent>
            </Card>
    )}
    {activeView === 'commentaires' && (
  <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-white">Les commentaires</CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        Liste des commentaires des utilisateurs
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-100 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">ID</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">ID Article</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Auteur</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Email</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Contenu</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Date</TableHead>
            <TableHead className="text-center text-gray-700 dark:text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredComments.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.blog_article_id}</TableCell>
              <TableCell>{c.first_name} {c.last_name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.content || '-'}</TableCell>
              <TableCell>{new Date(c.created_at).toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeleteTarget({ type: 'commentaire', id: c.id });
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredComments.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Aucun commentaire trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)}
{activeView === 'offers' && (
  <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-white">Les offres</CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        Liste des offres proposées
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-100 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">ID</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">ID Propriété</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Nom complet</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Offre</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Financement</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Message</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Date de création</TableHead>
            <TableHead className="text-center text-gray-700 dark:text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOffers.map(o => (
            <TableRow key={o.id}>
  <TableCell>{o.id}</TableCell>
  <TableCell>{o.bien_id}</TableCell>
  <TableCell>{o.first_name} {o.last_name}</TableCell>
  <TableCell>{o.offer} MAD</TableCell>
  <TableCell>
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      o.financing === 'cash' ? 'bg-green-100 text-green-800' :
      o.financing === 'mortgage' ? 'bg-blue-100 text-blue-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {o.financing}
    </span>
  </TableCell>
  <TableCell>{o.message || '-'}</TableCell>
  <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
  <TableCell className="text-center">
    <Button
      variant="destructive"
      size="sm"
      onClick={() => {
        setDeleteTarget({ type: 'offer', id: o.id });
        setDeleteConfirmOpen(true);
      }}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </TableCell>
</TableRow>
          ))}
          {filteredOffers.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                Aucune offre trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)}

{activeView === 'contact' && (
  <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-white">Les contacts</CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        Messages reçus via le formulaire de contact
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-100 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">ID</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Nom</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Email</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Sujet</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Message</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Date</TableHead>
            <TableHead className="text-center text-gray-700 dark:text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>
  <div className="font-semibold">{c.name}</div>
  <div className="text-sm text-gray-500 dark:text-gray-400">{c.phone}</div>
</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.purpose}</TableCell>
              <TableCell>
                <div className="max-w-xs truncate" title={c.message}>
                  {c.message}
                </div>
              </TableCell>
              <TableCell>{new Date(c.created_at).toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeleteTarget({ type: 'contact', id: c.id });
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredContacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Aucun contact trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)}

{activeView === 'newsletter' && (
  <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-white">Les abonnés à la newsletter</CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-300">
        Liste des adresses email inscrites à la newsletter
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-100 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">ID</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Email</TableHead>
            <TableHead className="text-left text-gray-700 dark:text-gray-300">Date d'inscription</TableHead>
            <TableHead className="text-center text-gray-700 dark:text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredNewsletters.map(n => (
            <TableRow key={n.id}>
              <TableCell>{n.id}</TableCell>
              <TableCell>{n.email}</TableCell>
             
              <TableCell>{new Date(n.created_at).toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeleteTarget({ type: 'newsletter', id: n.id });
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredNewsletters.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                Aucun abonné trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)}
        </>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              Cette action est irréversible. Cela supprimera définitivement
              {deleteTarget?.type === 'prospect' && " le prospect "}
              {deleteTarget?.type === 'message' && " le message "}
              {deleteTarget?.type === 'commentaire' && " le commentaire "}
              {deleteTarget?.type === 'offer' && " l'offre "}
              {deleteTarget?.type === 'contact' && " le contact "}
              {deleteTarget?.type === 'newsletter' && " l'abonné "}
              de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
                 <AlertDialogCancel className="text-gray-700 dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1">
           Annuler</AlertDialogCancel>
            <AlertDialogAction 
                     className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"

              onClick={handleDelete}
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminProspects;