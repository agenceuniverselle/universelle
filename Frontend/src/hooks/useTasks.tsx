import { useState, useCallback, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export interface Task {
  id: string;
  title: string;
  date: Date;
  type: 'call' | 'email' | 'meeting' | 'visit';
  time: string;
  client: string;
  location?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'canceled' | 'on-hold';
  associatedWith?: {
    type: 'lead' | 'client';
    id: string;
    name: string;
  };
}

// Mock data pour les tâches
const initialTasks: Task[] = [
  {
    id: 'T001',
    title: 'Appel de suivi',
    date: new Date(),
    type: 'call',
    time: '10:30',
    client: 'Sophie Martin',
    status: 'pending',
    associatedWith: {
      type: 'lead',
      id: 'L003',
      name: 'Sophie Martin'
    }
  },
  {
    id: 'T002',
    title: 'Envoi de documentation',
    date: new Date(),
    type: 'email',
    time: '14:00',
    client: 'Marc Dubois',
    status: 'pending',
    associatedWith: {
      type: 'lead',
      id: 'L002',
      name: 'Marc Dubois'
    }
  },
  {
    id: 'T003',
    title: 'Rendez-vous bureau',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'meeting',
    time: '11:00',
    client: 'Alexandre Dupont',
    location: 'Agence Principale',
    status: 'pending',
    associatedWith: {
      type: 'client',
      id: 'C001',
      name: 'Alexandre Dupont'
    }
  },
  {
    id: 'T004',
    title: 'Visite appartement',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: 'visit',
    time: '15:30',
    client: 'Julie Moreau',
    location: 'Appartement Casablanca #A102',
    status: 'pending',
    associatedWith: {
      type: 'lead',
      id: 'L005',
      name: 'Julie Moreau'
    }
  },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Récupérer du localStorage s'il existe
    const savedTasks = localStorage.getItem('crm-tasks');
    return savedTasks ? JSON.parse(savedTasks, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : initialTasks;
  });

  // Sauvegarde des tâches dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('crm-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Optimisation des fonctions avec useCallback pour éviter les re-renders inutiles
  const addTask = useCallback((newTask: Omit<Task, 'id'>) => {
    const taskId = `T${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const task = { ...newTask, id: taskId };
    setTasks(prev => [...prev, task]);
    toast({
      title: "Tâche créée",
      description: `La tâche "${newTask.title}" a été créée avec succès.`,
    });
    // Envoyer une notification de rappel pour les tâches prévues aujourd'hui
    if (new Date(newTask.date).toDateString() === new Date().toDateString()) {
      setTimeout(() => {
        toast({
          title: "Rappel de tâche",
          description: `N'oubliez pas : ${newTask.title} à ${newTask.time}`,
          variant: "default",
        });
      }, 5000); // Notification après 5 secondes pour simuler
    }
    return task;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    toast({
      title: "Tâche mise à jour",
      description: "Les modifications ont été enregistrées.",
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès.",
    });
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
    toast({
      title: "Tâche terminée",
      description: "La tâche a été marquée comme terminée.",
      variant: "default",
    });
  }, []);

  const putTaskOnHold = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'on-hold' } : task
    ));
    toast({
      title: "Tâche en attente",
      description: "La tâche a été mise en attente.",
    });
  }, []);

  const cancelTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'canceled' } : task
    ));
    toast({
      title: "Tâche annulée",
      description: "La tâche a été annulée.",
    });
  }, []);

  const getTasksForDate = useCallback((date: Date | undefined) => {
    if (!date) return [];
    return tasks.filter(task => 
      task.date.getDate() === date.getDate() && 
      task.date.getMonth() === date.getMonth() && 
      task.date.getFullYear() === date.getFullYear()
    );
  }, [tasks]);

  const getUpcomingTasks = useCallback((limit = 5) => {
    const now = new Date();
    return tasks
      .filter(task => task.status === 'pending' || task.status === 'on-hold')
      .filter(task => task.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  }, [tasks]);

  // Exportation de l'API du calendrier pour intégration externe
  const exportToCalendar = useCallback((taskId: string, type: 'google' | 'outlook') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const startDateTime = new Date(task.date);
    const [hours, minutes] = task.time.split(':').map(Number);
    startDateTime.setHours(hours, minutes);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1); // Assume 1 hour duration

    if (type === 'google') {
      const url = new URL('https://calendar.google.com/calendar/r/eventedit');
      url.searchParams.append('text', task.title);
      url.searchParams.append('dates', `${formatDateForCalendar(startDateTime)}/${formatDateForCalendar(endDateTime)}`);
      url.searchParams.append('details', `Client: ${task.client}${task.location ? `\nLieu: ${task.location}` : ''}`);
      if (task.location) url.searchParams.append('location', task.location);

      window.open(url.toString(), '_blank');
      
      toast({
        title: "Exportation vers Google Calendar",
        description: "Ouverture de Google Calendar dans un nouvel onglet.",
      });
    } else if (type === 'outlook') {
      const url = new URL('https://outlook.office.com/calendar/0/deeplink/compose');
      url.searchParams.append('subject', task.title);
      url.searchParams.append('startdt', startDateTime.toISOString());
      url.searchParams.append('enddt', endDateTime.toISOString());
      url.searchParams.append('body', `Client: ${task.client}${task.location ? `\nLieu: ${task.location}` : ''}`);
      if (task.location) url.searchParams.append('location', task.location);

      window.open(url.toString(), '_blank');
      
      toast({
        title: "Exportation vers Outlook Calendar",
        description: "Ouverture d'Outlook Calendar dans un nouvel onglet.",
      });
    }
  }, [tasks]);

  // Fonction utilitaire pour formater les dates pour Google Calendar
  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    cancelTask,
    putTaskOnHold,
    getTasksForDate,
    getUpcomingTasks,
    exportToCalendar
  };
};
