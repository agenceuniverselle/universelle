import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    try {
      const res = await axios.post('/api/newsletter', { email });
      setSuccess(res.data.message);
      setError('');
      setEmail('');
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Erreur');
        } else {
          setError('Une erreur est survenue');
        }
        setSuccess('');
      }
      
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-luxe-blue rounded-lg p-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair font-bold text-white mb-4">
              Ne ratez aucune opportunité
            </h2>
            <p className="text-white/80 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et conseils d&apos;experts directement dans votre boîte mail.
            </p>

            {success && <p className="text-green-400 mb-4">{success}</p>}
            {error && <p className="text-red-400 mb-4">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-3 px-4 rounded-md outline-none"
              />
              <Button
                onClick={handleSubscribe}
                className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-md transition-all duration-300"
              >
                S&apos;inscrire <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
