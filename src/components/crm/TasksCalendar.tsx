import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Phone, Mail, Calendar as CalendarIcon, MapPin, Clock, X, CheckCircle2, PauseCircle, Trash2, ExternalLink, ArrowRightCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTasksContext } from '@/context/TasksContext';
import { Task } from '@/hooks/useTasks';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const TasksCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    date: new Date(),
    type: 'call',
    time: '09:00',
    client: '',
    status: 'pending',
  });

  const { toast } = useToast();
  const { 
    tasks, 
    addTask, 
    completeTask, 
    cancelTask, 
    putTaskOnHold,
    getTasksForDate,
    getUpcomingTasks,
    exportToCalendar,
    deleteTask,
    updateTask
  } = useTasksContext();

  // Effet pour vérifier les tâches à venir toutes les minutes
  useEffect(() => {
    const checkUpcomingTasks = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const tasksForToday = tasks.filter(task => 
        task.status === 'pending' && 
        task.date.getDate() === now.getDate() && 
        task.date.getMonth() === now.getMonth() && 
        task.date.getFullYear() === now.getFullYear()
      );
      
      // Notification pour les tâches qui commencent dans moins de 15 minutes
      tasksForToday.forEach(task => {
        const [taskHour, taskMinute] = task.time.split(':').map(Number);
        const [nowHour, nowMinute] = currentTime.split(':').map(Number);
        
        const taskMinutes = taskHour * 60 + taskMinute;
        const nowMinutes = nowHour * 60 + nowMinute;
        
        // Si la tâche est dans moins de 15 minutes mais n'a pas encore commencé
        if (taskMinutes - nowMinutes <= 15 && taskMinutes - nowMinutes > 0) {
          toast({
            title: "Rappel de tâche imminente",
            description: `${task.title} avec ${task.client} commence dans ${taskMinutes - nowMinutes} minutes.`,
            variant: "default",
          });
        }
      });
    };
    
    // Vérifier au chargement
    checkUpcomingTasks();
    
    // Vérifier toutes les minutes
    const intervalId = setInterval(checkUpcomingTasks, 60000);
    
    return () => clearInterval(intervalId);
  }, [tasks, toast]);

  // Filtrer les tâches pour la date sélectionnée
  const filteredTasks = getTasksForDate(date);
  const upcomingTasks = getUpcomingTasks(5);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isNewTaskDialogOpen) {
      setNewTask({
        title: '',
        date: new Date(),
        type: 'call',
        time: '09:00',
        client: '',
        status: 'pending',
      });
    }
  }, [isNewTaskDialogOpen]);

  // Obtenir l'icône pour le type de tâche
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-blue-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-green-600" />;
      case 'meeting':
        return <CalendarIcon className="h-4 w-4 text-purple-600" />;
      case 'visit':
        return <MapPin className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Formatter la date
  const formatDate = (date: Date) => {
    return format(date, 'PPP', { locale: fr });
  };

  // Gérer la création d'une nouvelle tâche
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.client || !newTask.date || !newTask.time || !newTask.type) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    addTask(newTask as Omit<Task, 'id'>);
    setIsNewTaskDialogOpen(false);
  };

  // Bouton d'action par statut
  const getActionButtonsByStatus = (task: Task) => {
    switch(task.status) {
      case 'pending':
        return (
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => completeTask(task.id)}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Complété
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 text-xs border-amber-500 text-amber-600 hover:bg-amber-50"
              onClick={() => putTaskOnHold(task.id)}
            >
              <PauseCircle className="h-3 w-3 mr-1" />
              En attente
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                  <ArrowRightCircle className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Plus d'actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => cancelTask(task.id)}>
                  <X className="h-3 w-3 mr-1" /> Annuler
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Supprimer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportToCalendar(task.id, 'google')}>
                  <ExternalLink className="h-3 w-3 mr-1" /> Google Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToCalendar(task.id, 'outlook')}>
                  <ExternalLink className="h-3 w-3 mr-1" /> Outlook Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      case 'on-hold':
        return (
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => completeTask(task.id)}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Complété
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => updateTask(task.id, { status: 'pending' })}
            >
              <ArrowRightCircle className="h-3 w-3 mr-1" />
              Reprendre
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => cancelTask(task.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Complété
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Annulé
          </Badge>
        );
      default:
        return null;
    }
  };

  // Mettre à jour la tâche en cours de création
  const updateNewTask = (field: string, value: any) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  // Task card component
  const TaskCard = ({ task }: { task: Task }) => (
    <div key={task.id} className="flex items-start relative">
      <div className="w-16 pt-1 text-sm text-gray-500 font-medium pr-4 text-right">
        {task.time}
      </div>
      <div 
        className={`flex-1 p-3 rounded-md border ${
          task.status === 'completed' 
            ? 'bg-green-50 border-green-200' 
            : task.status === 'canceled' 
            ? 'bg-gray-50 border-gray-200 line-through' 
            : task.status === 'on-hold'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className="mr-2 p-1 rounded-full bg-gray-100">
                {getTaskIcon(task.type)}
              </div>
              <h4 className="font-medium">{task.title}</h4>
            </div>
            <p className="text-sm text-gray-600 mt-1">Client: {task.client}</p>
            {task.location && (
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" /> {task.location}
              </p>
            )}
          </div>
          
          <div className="flex space-x-1">
            {getActionButtonsByStatus(task)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
          <CardDescription>Sélectionnez une date pour voir vos tâches</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 30))}
            initialFocus
          />
          
          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Tâches à venir</div>
            <div className="space-y-2">
              {upcomingTasks.length === 0 ? (
                <p className="text-xs text-gray-500">Aucune tâche prévue</p>
              ) : (
                upcomingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="text-xs flex items-center p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => setDate(new Date(task.date))}
                  >
                    {getTaskIcon(task.type)}
                    <span className="ml-2 flex-1">{task.title}</span>
                    <span className="text-gray-500">{format(task.date, 'dd/MM')}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Tâches pour le {date ? formatDate(date) : ''}
              </CardTitle>
              <CardDescription>{filteredTasks.length} tâches prévues</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue={view} onValueChange={(value) => setView(value as 'day' | 'week')}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Vue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Journée</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Nouvelle tâche</DialogTitle>
                    <DialogDescription>
                      Créez une nouvelle tâche pour votre agenda. Tous les champs marqués * sont obligatoires.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => updateNewTask('title', e.target.value)}
                        placeholder="Ex: Appel de suivi"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select 
                          value={newTask.type} 
                          onValueChange={(value) => updateNewTask('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type de tâche" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Appel</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="meeting">Rendez-vous</SelectItem>
                            <SelectItem value="visit">Visite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Heure *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newTask.time}
                          onChange={(e) => updateNewTask('time', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newTask.date ? format(newTask.date, 'PPP', { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newTask.date}
                            onSelect={(date) => updateNewTask('date', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">Client / Contact *</Label>
                      <Input
                        id="client"
                        value={newTask.client}
                        onChange={(e) => updateNewTask('client', e.target.value)}
                        placeholder="Nom du client ou contact"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Lieu (optionnel)</Label>
                      <Input
                        id="location"
                        value={newTask.location || ''}
                        onChange={(e) => updateNewTask('location', e.target.value)}
                        placeholder="Adresse ou emplacement"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (optionnel)</Label>
                      <Textarea
                        id="notes"
                        value={newTask.notes || ''}
                        onChange={(e) => updateNewTask('notes', e.target.value)}
                        placeholder="Notes ou informations supplémentaires"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleCreateTask} className="bg-luxe-blue hover:bg-luxe-blue/90">Créer la tâche</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-16 w-px bg-gray-200"></div>
            
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Aucune tâche prévue pour cette journée
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTasks
                  .sort((a, b) => {
                    const timeA = parseInt(a.time.split(':').join(''));
                    const timeB = parseInt(b.time.split(':').join(''));
                    return timeA - timeB;
                  })
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksCalendar;
