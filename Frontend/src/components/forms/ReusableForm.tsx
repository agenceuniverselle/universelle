import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | boolean;
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  submitButtonText: string;
  fields: FormField[];
  successMessage: string;
  redirectUrl?: string;
  clientType?: 'Investisseur' | 'Acheteur' | 'Prospect';
}

interface ReusableFormProps {
  formConfig: FormConfig;
  onSubmit?: (formData: Record<string, any>) => void;
  className?: string;
}

const ReusableForm: React.FC<ReusableFormProps> = ({ 
  formConfig, 
  onSubmit,
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check required fields
      const missingFields = formConfig.fields
        .filter(field => field.required && !formData[field.id])
        .map(field => field.label);

      if (missingFields.length > 0) {
        toast({
          title: "Formulaire incomplet",
          description: `Veuillez remplir les champs obligatoires: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // If onSubmit is provided, call it
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Show success message
      toast({
        title: "Formulaire envoyé",
        description: formConfig.successMessage,
      });

      // Reset form
      setFormData({});

      // Redirect if URL provided
      if (formConfig.redirectUrl) {
        window.location.href = formConfig.redirectUrl;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const { id, type, label, placeholder, required, options } = field;
    const value = formData[id] ?? field.defaultValue ?? '';

    switch (type) {
      case 'textarea':
        return (
          <div className="mb-4" key={id}>
            <Label htmlFor={id} className="block mb-2">{label} {required && <span className="text-red-500">*</span>}</Label>
            <Textarea
              id={id}
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(id, e.target.value)}
              className="w-full"
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="mb-4" key={id}>
            <Label htmlFor={id} className="block mb-2">{label} {required && <span className="text-red-500">*</span>}</Label>
            <Select
              value={value as string}
              onValueChange={(value) => handleInputChange(id, value)}
            >
              <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2 mb-4" key={id}>
            <Switch
              id={id}
              checked={value as boolean}
              onCheckedChange={(checked) => handleInputChange(id, checked)}
            />
            <Label htmlFor={id} className="cursor-pointer">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
          </div>
        );

      case 'email':
        return (
          <div className="mb-4" key={id}>
            <Label htmlFor={id} className="block mb-2">{label} {required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={id}
              type="email"
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(id, e.target.value)}
            />
          </div>
        );

      case 'phone':
        return (
          <div className="mb-4" key={id}>
            <Label htmlFor={id} className="block mb-2">{label} {required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={id}
              type="tel"
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(id, e.target.value)}
            />
          </div>
        );

      case 'number':
        return (
          <div className="mb-4" key={id}>
            <Label htmlFor={id} className="block mb-2">{label} {required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={id}
              type="number"
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(id, e.target.value)}
            />
          </div>
        );
        
      // Default to text input
      default:
        return (
          <div className="mb-4" key={id}>
            <Label htmlFor={id} className="block mb-2">{label} {required && <span className="text-red-500">*</span>}</Label>
            <Input
              id={id}
              type="text"
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(id, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{formConfig.title}</CardTitle>
        {formConfig.description && <p className="mt-1 text-gray-500">{formConfig.description}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          {formConfig.fields.map(renderField)}
          <Button 
            type="submit" 
            className="w-full mt-4 bg-luxe-blue hover:bg-luxe-blue/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : formConfig.submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReusableForm;
