// Contact.tsx
import { useState } from 'react';
import ContactFormFields from './contact/ContactFormFields';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@radix-ui/react-select';
import ContactFormSecurity from './contact/ContactFormSecurity';
import { toast } from '@/hooks/use-toast'; 
import { CheckCircle } from 'lucide-react';

interface ContactProps {
  onSuccess: () => void;
}

const Contact = ({ onSuccess }: ContactProps) => {
    const [showVipForm, setShowVipForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
    purpose: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <Separator className="mb-4" />
      <ScrollArea className="flex-grow overflow-y-auto pr-2">
        
      <ContactFormFields 
  
  onSuccess={onSuccess}
/>

      </ScrollArea>
      <ContactFormSecurity />

    </div>
  );
};

export default Contact;
