
import React from 'react';
import LegalLayout from '@/components/layouts/LegalLayout';

const MentionsLegales = () => {
  const tableOfContents = [
    { id: 'editeur', title: 'Éditeur du site' },
    { id: 'hebergement', title: 'Hébergement' },
    { id: 'propriete', title: 'Propriété intellectuelle' },
    { id: 'donnees', title: 'Données personnelles' },
    { id: 'responsabilite', title: 'Limitation de responsabilité' },
    { id: 'liens', title: 'Liens externes' },
    { id: 'cookies', title: 'Gestion des cookies' },
    { id: 'modification', title: 'Modifications des mentions légales' },
  ];

  return (
    <LegalLayout 
      title="Mentions Légales" 
      subtitle="Informations légales concernant l'exploitation de notre site internet"
      tableOfContents={tableOfContents}
    >
      <div className="prose max-w-none">
        <section id="editeur" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">1. Éditeur du site</h2>
          <p>Le présent site web <strong>https://universelle.ma/</strong> est édité par :</p>
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <p><strong>Agence Universelle d'Investissement Immobilier</strong></p>
            <p>Forme juridique : S.A.R.L.</p>
            <p>Capital social : 100 000 MAD</p>
            <p>Siège social : AV MLY ISMAIL 14 RESIDENCE MLY ISMAIL  3EME ETG N° 09 , Tanger</p>
            <p>Immatriculation : 142747</p>
            <p>N° d'identification fiscale :57227292</p>
            <p>Tél :  +212 808604195 / +212 665944626</p>
            <p>Email : contact@universelle.ma</p>
          </div>
          <p className="mt-4">Directeur de l'agence : M. Mohamed Jaaouan, en qualité de Gérant.</p>
        </section>

        <section id="hebergement" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">2. Hébergement</h2>
          <p>Le Site est hébergé par :</p>
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <p><strong>DigitalOcean</strong></p>
            <p>Société par actions simplifiée</p>
            <p>Site web : https://www.digitalocean.com/</p>
          </div>
        </section>

        <section id="propriete" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">3. Propriété intellectuelle</h2>
          <p>Le Site et chacun des éléments qui le composent (tels que marques, logos, photographies, images, illustrations, textes, vidéos, etc.) sont protégés par le droit de la propriété intellectuelle.</p>
          <p>La reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l'Agence Universelle d'Investissement Immobilier.</p>
          <p>Toute exploitation non autorisée du Site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle français et des lois marocaines en vigueur.</p>
        </section>

        <section id="donnees" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">4. Données personnelles</h2>
          <p>Les informations concernant la collecte et le traitement des données personnelles sont détaillées dans notre <a href="/politique-de-confidentialite" className="text-gold hover:underline">Politique de Confidentialité</a>.</p>
        </section>

        <section id="responsabilite" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">5. Limitation de responsabilité</h2>
          <p>L'Agence Universelle d'Investissement Immobilier s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur le Site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le Site.</p>
          <p>En conséquence, l'Agence Universelle d'Investissement Immobilier décline toute responsabilité :</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Pour toute interruption du Site</li>
            <li>Pour toute survenance de bogues</li>
            <li>Pour toute inexactitude ou omission portant sur des informations disponibles sur le Site</li>
            <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le Site</li>
            <li>Et plus généralement, pour tous dommages, directs ou indirects, quelles qu'en soient les causes, origines, natures ou conséquences</li>
          </ul>
        </section>

        <section id="liens" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">6. Liens externes</h2>
          <p>Le Site peut contenir des liens hypertextes renvoyant vers d'autres sites internet. L'Agence Universelle d'Investissement Immobilier n'a pas la possibilité de vérifier le contenu de ces sites, et n'assumera en conséquence aucune responsabilité quant aux contenus, publicités, produits, services ou toute autre information présentée sur ces sites.</p>
        </section>

        <section id="cookies" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">7. Gestion des cookies</h2>
          <p>Pour en savoir plus sur notre utilisation des cookies, veuillez consulter notre <a href="/politique-des-cookies" className="text-gold hover:underline">Politique des Cookies</a>.</p>
        </section>

        <section id="modification" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">8. Modifications des mentions légales</h2>
          <p>L'Agence Universelle d'Investissement Immobilier se réserve le droit de modifier les présentes mentions légales à tout moment. L'utilisateur est donc invité à les consulter régulièrement.</p>
          <p>Dernière mise à jour : 11 juin 2025</p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">Pour toute question relative à ces mentions légales, vous pouvez nous contacter à : <a href="mailto:contact@universelle.ma" className="text-gold hover:underline">contact@universelle.ma</a></p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default MentionsLegales;
