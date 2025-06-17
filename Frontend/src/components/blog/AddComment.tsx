import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  articleId: number;
  onCommentAdded: () => void;
  parentId?: number; // 👈 ajouté ici
}

const AddComment = ({ articleId, onCommentAdded, parentId }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`https://back-qhore.ondigitalocean.app/api/blogs/${articleId}/comments`, {
        first_name: firstName,
        last_name: lastName,
        email,
        content,
        parent_id: parentId ?? null, // ✅ Ajout ici
      });

      // Clear form
      setFirstName('');
      setLastName('');
      setEmail('');
      setContent('');
      onCommentAdded();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error('🛑 Erreur en ajoutant le commentaire', err);
        console.log('📦 Détails de l’erreur Laravel :', err.response?.data);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="flex gap-4">
        <Input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <Input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse email"
        required
        type="email"
      />
      <Textarea
        placeholder="Votre commentaire"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Publication...' : 'Publier mon commentaire'}
      </Button>
    </form>
  );
};

export default AddComment;
