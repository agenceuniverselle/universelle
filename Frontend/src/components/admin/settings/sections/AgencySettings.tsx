
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, Upload, PlusCircle, Trash2 } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rcNumber: string;
  ifNumber: string;
  iceNumber: string;
  logo: File | null;
}

export const AgencySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: '1',
      name: 'ImmoLuxe Marrakech',
      address: '123 Avenue Mohammed V, Marrakech',
      phone: '+212 5 24 12 34 56',
      email: 'contact@immoluxe-marrakech.com',
      rcNumber: 'RC12345',
      ifNumber: 'IF67890',
      iceNumber: 'ICE00123456789',
      logo: null
    }
  ]);

  const handleChange = (id: string, field: keyof Agency, value: string) => {
    setAgencies(agencies.map(agency => 
      agency.id === id ? { ...agency, [field]: value } : agency
    ));
  };

  const handleLogoChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAgencies(agencies.map(agency => 
        agency.id === id ? { ...agency, logo: e.target.files![0] } : agency
      ));
    }
  };

  const addAgency = () => {
    const newAgency: Agency = {
      id: Date.now().toString(),
      name: '',
      address: '',
      phone: '',
      email: '',
      rcNumber: '',
      ifNumber: '',
      iceNumber: '',
      logo: null
    };
    setAgencies([...agencies, newAgency]);
  };

  const removeAgency = (id: string) => {
    setAgencies(agencies.filter(agency => agency.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      console.log('Agency settings saved:', agencies);
      
      setIsLoading(false);
      toast({
        title: "Agences enregistrées",
        description: "Les informations des agences ont été mises à jour avec succès.",
      });
    }, 1000);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Informations de l'Agence</CardTitle>
        <CardDescription>
          Gérez les informations de vos agences immobilières
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {agencies.map((agency, index) => (
            <div 
              key={agency.id} 
              className={`p-6 ${index > 0 ? 'border-t pt-8' : ''} ${agencies.length > 1 ? 'relative' : ''}`}
            >
              {agencies.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-8 right-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeAgency(agency.id)}
                >
                  <Trash2 size={18} />
                </Button>
              )}
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor={`name-${agency.id}`}>Nom de l'agence</Label>
                    <Input 
                      id={`name-${agency.id}`}
                      value={agency.name}
                      onChange={(e) => handleChange(agency.id, 'name', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`logo-${agency.id}`}>Logo de l'agence</Label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="h-16 w-16 rounded border flex items-center justify-center bg-gray-50">
                        {agency.logo ? (
                          <img 
                            src={URL.createObjectURL(agency.logo)} 
                            alt="Logo" 
                            className="max-h-14 max-w-14 object-contain" 
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">Aucun logo</div>
                        )}
                      </div>
                      <div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => document.getElementById(`logo-upload-${agency.id}`)?.click()}
                        >
                          <Upload size={16} />
                          <span>Choisir</span>
                        </Button>
                        <Input 
                          id={`logo-upload-${agency.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoChange(agency.id, e)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Format JPG, PNG. Max 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`address-${agency.id}`}>Adresse</Label>
                  <Textarea 
                    id={`address-${agency.id}`}
                    value={agency.address}
                    onChange={(e) => handleChange(agency.id, 'address', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor={`phone-${agency.id}`}>Téléphone</Label>
                    <Input 
                      id={`phone-${agency.id}`}
                      value={agency.phone}
                      onChange={(e) => handleChange(agency.id, 'phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`email-${agency.id}`}>Email</Label>
                    <Input 
                      id={`email-${agency.id}`}
                      type="email"
                      value={agency.email}
                      onChange={(e) => handleChange(agency.id, 'email', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor={`rc-${agency.id}`}>Numéro RC</Label>
                    <Input 
                      id={`rc-${agency.id}`}
                      value={agency.rcNumber}
                      onChange={(e) => handleChange(agency.id, 'rcNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`if-${agency.id}`}>Numéro IF</Label>
                    <Input 
                      id={`if-${agency.id}`}
                      value={agency.ifNumber}
                      onChange={(e) => handleChange(agency.id, 'ifNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`ice-${agency.id}`}>Numéro ICE</Label>
                    <Input 
                      id={`ice-${agency.id}`}
                      value={agency.iceNumber}
                      onChange={(e) => handleChange(agency.id, 'iceNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col gap-8">
            <Button
              type="button"
              variant="outline"
              onClick={addAgency}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <PlusCircle size={16} />
              Ajouter une autre agence
            </Button>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-luxe-blue hover:bg-luxe-blue/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
};
