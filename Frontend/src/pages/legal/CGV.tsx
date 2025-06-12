
import React from 'react';
import LegalLayout from '@/components/layouts/LegalLayout';

const CGV = () => {
  const tableOfContents = [
    { id: 'preambule', title: 'Préambule' },
    { id: 'definitions', title: 'Définitions' },
    { id: 'services', title: 'Services proposés' },
    { id: 'reservation', title: 'Réservation et paiement' },
    { id: 'prix', title: 'Prix et modalités de paiement' },
    { id: 'retractation', title: 'Droit de rétractation' },
    { id: 'responsabilites', title: 'Responsabilités' },
    { id: 'garanties', title: 'Garanties' },
    { id: 'litiges', title: 'Litiges' },
    { id: 'force-majeure', title: 'Force majeure' },
  ];

  return (
    <LegalLayout 
      title="Conditions Générales de Vente" 
      subtitle="Modalités d'achat et de réservation des biens immobiliers"
      tableOfContents={tableOfContents}
    >
      <div className="prose max-w-none">
        <section id="preambule" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">1. Préambule</h2>
          <p>Les présentes Conditions Générales de Vente définissent les modalités dans lesquelles l'Agence Universelle d'Investissement Immobilier propose la vente de biens immobiliers et de services associés à sa clientèle.</p>
          <p>Ces CGV s'appliquent à l'ensemble des contrats conclus entre l'Agence et ses clients, qu'ils soient particuliers ou professionnels .</p>
          <p>Toute réservation ou achat auprès de l'Agence implique l'acceptation préalable et sans réserve des présentes CGV par le Client. L'Agence se réserve le droit de modifier à tout moment les présentes CGV. Les CGV applicables sont celles en vigueur au jour de la signature du contrat.</p>
        </section>

        {/* Continue with other sections... */}
        <section id="definitions" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">2. Définitions</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Agence :</strong> désigne l'Agence Universelle d'Investissement Immobilier, SARL au capital de 100 000 MAD.</li>
            <li><strong>Client :</strong> désigne toute personne physique ou morale qui achète ou réserve un bien immobilier ou un service proposé par l'Agence.</li>
            <li><strong>Bien Immobilier :</strong> désigne tout bien immobilier proposé à la vente par l'Agence.</li>
            <li><strong>Services :</strong> désigne l'ensemble des prestations proposées par l'Agence (conseil, accompagnement, etc.).</li>
            <li><strong>Contrat :</strong> désigne tout document contractuel régissant la relation entre l'Agence et le Client.</li>
          </ul>
        </section>

        <section id="services" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">3. Services proposés</h2>
          <p>L'Agence propose les services suivants :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Vente de biens immobiliers</li>
            <li>Conseil en investissement immobilier</li>
            <li>Accompagnement dans les démarches administratives</li>
          </ul>
          <p className="mt-4">La description détaillée de chaque service est disponible sur demande auprès de l'Agence.</p>
        </section>

        <section id="reservation" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">4. Réservation et paiement</h2>
          <h3 className="text-xl font-semibold mb-3">4.1 Processus de réservation</h3>
          <p>La réservation d'un bien immobilier s'effectue selon les étapes suivantes :</p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Visite du bien et confirmation de l'intérêt</li>
            <li>Signature d'un bon de réservation</li>
            <li>Versement d'un acompte</li>
            <li>Constitution du dossier administratif</li>
            <li>Signature du compromis de vente</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Acompte</h3>
          <p>L'acompte représente 5% du prix de vente du bien. Il est versé à la signature du bon de réservation et vient en déduction du prix total.</p>
        </section>

        <section id="prix" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">5. Prix et modalités de paiement</h2>
          <div className="space-y-4">
            <p>Les prix des biens immobiliers sont exprimés en Dirhams Marocains (MAD) et incluent :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le prix du bien immobilier</li>
              <li>Les honoraires de l'Agence</li>
              <li>Les frais de dossier</li>
            </ul>
            <p>Ne sont pas inclus et restent à la charge du Client :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les frais de notaire</li>
              <li>Les frais d'enregistrement</li>
              <li>Les taxes et impôts liés à l'acquisition</li>
            </ul>
          </div>
        </section>

        <section id="retractation" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">6. Droit de rétractation</h2>
          <p>Conformément à la législation en vigueur, le Client dispose d'un délai de rétractation de 7 jours à compter de la signature du bon de réservation.</p>
          <p>Pour exercer ce droit, le Client doit notifier sa décision de rétractation par lettre recommandée avec accusé de réception à l'adresse suivante :</p>
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <p>Agence Universelle d'Investissement Immobilier</p>
            <p>IMM17 N°9 Touzine, Complexe Bayt Laatik</p>
            <p>90000 Tanger, Maroc</p>
          </div>
        </section>

        <section id="responsabilites" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">7. Responsabilités</h2>
          <p>L'Agence s'engage à :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Fournir des informations exactes et complètes sur les biens proposés</li>
            <li>Accompagner le Client tout au long du processus d'acquisition</li>
            <li>Respecter la confidentialité des informations communiquées par le Client</li>
            <li>Sécuriser les transactions financières</li>
          </ul>
          <p className="mt-4">Le Client s'engage à :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Fournir des informations exactes et actualisées</li>
            <li>Respecter les échéances de paiement convenues</li>
            <li>Collaborer de bonne foi avec l'Agence</li>
          </ul>
        </section>

        <section id="garanties" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">8. Garanties</h2>
          <p>L'Agence garantit :</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>La conformité des biens aux descriptions fournies</li>
            <li>La régularité juridique des transactions</li>
            <li>L'accompagnement post-vente pendant une durée de 12 mois</li>
          </ul>
        </section>

        <section id="litiges" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">9. Litiges</h2>
          <p>En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.</p>
          <p>À défaut d'accord amiable, tout litige relatif à l'interprétation ou l'exécution des présentes CGV sera soumis aux tribunaux compétents de Casablanca.</p>
        </section>

        <section id="force-majeure" className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">10. Force majeure</h2>
          <p>L'Agence ne pourra être tenue responsable en cas d'inexécution de ses obligations due à un cas de force majeure tel que défini par la jurisprudence marocaine.</p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">Les présentes CGV sont régies par le droit marocain. Pour toute question relative à ces CGV, vous pouvez contacter notre service juridique à : <a href="mailto:contact@universelle.ma" className="text-gold hover:underline">contact@universelle.ma</a></p>
          <p className="text-sm text-gray-600 mt-2">Date de dernière mise à jour : 11 juin 2025</p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default CGV;
