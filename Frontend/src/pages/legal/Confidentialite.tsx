
import React from 'react';
import LegalLayout from '@/components/layouts/LegalLayout';

const Confidentialite = () => {
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'donnees-collectees', title: 'Données collectées' },
    { id: 'utilisation', title: 'Utilisation des données' },
    { id: 'stockage', title: 'Stockage et sécurité' },
    { id: 'droits', title: 'Vos droits' },
    { id: 'consentement', title: 'Consentement' },
    { id: 'modifications', title: 'Modifications de la politique' },
    { id: 'contact', title: 'Nous contacter' },
  ];

  return (
    <LegalLayout 
      title="Politique de Confidentialité" 
      subtitle="Protection de vos données personnelles et respect de votre vie privée"
      tableOfContents={tableOfContents}
    >
      <div className="prose max-w-none">
        <section id="introduction" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">1. Introduction</h2>
          <p>
            L'Agence Universelle d'Investissement Immobilier s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation marocaine sur la protection des données.
          </p>
          <p>
            En utilisant notre site web et nos services, vous consentez à la collecte et à l'utilisation de vos informations conformément à cette politique.
          </p>
        </section>

        <section id="donnees-collectees" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">2. Données collectées</h2>
          <p>Nous pouvons collecter les types d'informations suivants :</p>
          <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Informations que vous nous fournissez</h3>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Informations d'identification :</strong> nom, prénom, adresse email, numéro de téléphone, adresse postale.</li>
            <li><strong>Informations financières :</strong> informations bancaires nécessaires pour les transactions immobilières.</li>
            <li><strong>Documents d'identité :</strong> copie de pièce d'identité, justificatif de domicile pour la vérification d'identité.</li>
            <li><strong>Préférences :</strong> vos préférences immobilières, critères de recherche.</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Informations collectées automatiquement</h3>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Informations de navigation :</strong> adresse IP, type et version du navigateur, paramètres de fuseau horaire.</li>
            <li><strong>Activité sur le site :</strong> pages visitées, temps passé sur le site, liens cliqués.</li>
            <li><strong>Cookies :</strong> informations stockées sur votre appareil via des cookies (voir notre <a href="/politique-des-cookies" className="text-gold hover:underline">Politique des Cookies</a>).</li>
          </ul>
        </section>

        <section id="utilisation" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">3. Utilisation des données</h2>
          <p>Nous utilisons vos données personnelles pour les finalités suivantes :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Fournir nos services :</strong> répondre à vos demandes, gérer les transactions immobilières, vous informer sur les biens correspondant à vos critères.</li>
            <li><strong>Communication :</strong> vous contacter concernant votre compte, nos services ou pour répondre à vos questions.</li>
            <li><strong>Amélioration :</strong> améliorer notre site web, nos services et votre expérience utilisateur.</li>
            <li><strong>Marketing :</strong> vous envoyer des informations sur nos services, offres spéciales (uniquement avec votre consentement explicite).</li>
            <li><strong>Obligations légales :</strong> respecter nos obligations légales et réglementaires dans le secteur immobilier.</li>
          </ul>
        </section>

        <section id="stockage" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">4. Stockage et sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération et la destruction.
          </p>
          <p>
            Vos données sont conservées pour la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, ou pour se conformer aux exigences légales et réglementaires.
          </p>
        </section>

        <section id="droits" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">5. Vos droits</h2>
          <p>Conformément au RGPD et à la législation marocaine applicable, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Droit d'accès :</strong> vous pouvez demander une copie des données personnelles que nous détenons à votre sujet.</li>
            <li><strong>Droit de rectification :</strong> vous pouvez demander la correction de données inexactes ou incomplètes.</li>
            <li><strong>Droit à l'effacement :</strong> vous pouvez demander la suppression de vos données dans certaines circonstances.</li>
            <li><strong>Droit à la limitation du traitement :</strong> vous pouvez demander la limitation du traitement de vos données.</li>
            <li><strong>Droit à la portabilité :</strong> vous pouvez recevoir vos données dans un format structuré et les transférer à un autre responsable du traitement.</li>
            <li><strong>Droit d'opposition :</strong> vous pouvez vous opposer au traitement de vos données, notamment à des fins de marketing direct.</li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, veuillez nous contacter à <a href="mailto:contact@universelle.ma" className="text-gold hover:underline">contact@universelle.ma</a>.
          </p>
        </section>

        <section id="consentement" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">6. Consentement</h2>
          <p>
            En utilisant notre site web et nos services, vous consentez à notre politique de confidentialité. Vous pouvez retirer votre consentement à tout moment en nous contactant, mais cela n'affectera pas la légalité du traitement effectué avant le retrait.
          </p>
        </section>

        <section id="modifications" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">7. Modifications de la politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de révision mise à jour. Nous vous encourageons à consulter régulièrement cette politique pour rester informé de nos pratiques en matière de protection des données.
          </p>
          <p>Dernière mise à jour : 11 juin 2025</p>
        </section>

        <section id="contact" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">8. Nous contacter</h2>
          <p>
            Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, veuillez contacter notre Délégué à la Protection des Données (DPO) :
          </p>
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <p><strong>Délégué à la Protection des Données</strong></p>
            <p>Agence Universelle d'Investissement Immobilier</p>
            <p>IMM17 N°9 Touzine, Complexe Bayt Laatik, Tanger 90000</p>
            <p>Email : <a href="mailto:contact@universelle.ma" className="text-gold hover:underline">contact@universelle.ma</a></p>
            <p>Tél : +212 808604195</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Vous avez également le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente si vous estimez que le traitement de vos données personnelles constitue une violation des lois applicables.
          </p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default Confidentialite;
