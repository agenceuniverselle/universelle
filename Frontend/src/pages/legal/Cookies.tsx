
import React from 'react';
import LegalLayout from '@/components/layouts/LegalLayout';
import { Separator } from '@/components/ui/separator';

const Cookies = () => {
  return (
    <LegalLayout 
      title="Politique des Cookies" 
      subtitle="Comment nous utilisons les cookies pour améliorer votre expérience"
    >
      <div className="space-y-6">
        <section id="introduction">
          <h2 className="text-xl font-bold mb-3">Introduction</h2>
          <p>
            Agence Universelle d'Investissement Immobilier utilise des cookies et technologies similaires sur son site web. 
            Ces technologies nous permettent d'améliorer votre expérience, d'analyser le trafic et de personnaliser le contenu.
            Cette politique explique comment nous utilisons les cookies et les choix que vous avez concernant leur utilisation.
          </p>
        </section>
        
        <Separator />
        
        <section id="what-are-cookies">
          <h2 className="text-xl font-bold mb-3">Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte placé sur votre appareil lorsque vous visitez un site web. 
            Les cookies sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, 
            ainsi que pour fournir des informations aux propriétaires du site.
          </p>
          <p className="mt-2">
            Ces fichiers stockent des informations sur votre visite, vos préférences et peuvent vous reconnaître lors de visites ultérieures.
            Les cookies peuvent être "persistants" ou "de session" : un cookie persistant est stocké par le navigateur et reste valide jusqu'à sa date d'expiration,
            à moins d'être supprimé avant par l'utilisateur ; un cookie de session expire à la fin de la session utilisateur, lors de la fermeture du navigateur.
          </p>
        </section>
        
        <Separator />
        
        <section id="types-of-cookies">
          <h2 className="text-xl font-bold mb-3">Types de cookies que nous utilisons</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">Cookies essentiels</h3>
              <p>Ces cookies sont nécessaires au fonctionnement du site. Ils vous permettent de naviguer sur notre site et d'utiliser ses fonctionnalités.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Cookies analytiques</h3>
              <p>Nous utilisons Google Analytics pour comprendre comment les visiteurs interagissent avec notre site. Ces cookies nous aident à améliorer notre site web.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Cookies de fonctionnalité</h3>
              <p>Ces cookies permettent à notre site de se souvenir des choix que vous faites et de fournir des fonctionnalités améliorées et personnalisées.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Cookies de marketing</h3>
              <p>Ces cookies sont utilisés pour suivre les visiteurs sur les sites web. L'intention est d'afficher des publicités pertinentes et engageantes pour l'utilisateur.</p>
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section id="third-party-cookies">
          <h2 className="text-xl font-bold mb-3">Cookies tiers</h2>
          <p>
            Notre site peut également contenir des cookies tiers provenant de services tels que :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Google Analytics (analyse du trafic web)</li>
            <li>Google Ads (publicité)</li>
            <li>Facebook Pixel (marketing et remarketing)</li>
            <li>LinkedIn Insight (analyse professionnelle)</li>
            <li>HubSpot (gestion de la relation client)</li>
          </ul>
          <p className="mt-2">
            Ces services tiers peuvent utiliser des cookies, balises web et technologies similaires pour collecter ou recevoir des informations 
            depuis notre site web et ailleurs sur internet, qu'ils utilisent pour fournir des services de mesure et cibler des publicités.
          </p>
        </section>
        
        <Separator />
        
        <section id="cookie-management">
          <h2 className="text-xl font-bold mb-3">Gestion des cookies</h2>
          <p>
            Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies 
            déjà présents sur votre appareil et vous pouvez configurer la plupart des navigateurs pour qu'ils ne soient pas acceptés. 
            Toutefois, si vous faites cela, vous devrez peut-être ajuster manuellement certaines préférences chaque fois que vous 
            visiterez un site, et certains services et fonctionnalités pourraient ne pas fonctionner.
          </p>
          <p className="mt-2">
            Vous pouvez modifier vos paramètres de cookies à tout moment en cliquant sur le bouton "Paramètres des cookies" 
            en bas de notre site ou en utilisant les paramètres de votre navigateur.
          </p>
          <p className="mt-2">
            Pour plus d'informations sur la façon de gérer les cookies dans votre navigateur web, veuillez visiter :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-blue-600 hover:underline">Safari</a></li>
          </ul>
        </section>
        
        <Separator />
        
        <section id="changes-to-policy">
          <h2 className="text-xl font-bold mb-3">Modifications de notre politique de cookies</h2>
          <p>
            Nous pouvons mettre à jour cette politique de cookies de temps à autre pour refléter, par exemple, des changements dans les cookies 
            que nous utilisons ou pour d'autres raisons opérationnelles, légales ou réglementaires. Veuillez donc consulter régulièrement 
            cette politique pour rester informé de notre utilisation des cookies et des technologies connexes.
          </p>
          <p className="mt-2">
            La date en bas de cette page indique quand elle a été mise à jour pour la dernière fois.
          </p>
        </section>
        
        <Separator />
        
        <section id="contact">
          <h2 className="text-xl font-bold mb-3">Nous contacter</h2>
          <p>
            Si vous avez des questions concernant notre utilisation des cookies ou d'autres technologies, veuillez nous contacter à :
          </p>
          <p className="mt-2 font-medium">
            Email : contact@universelle.ma<br />
            Téléphone : +212 808604195<br />
            IMM17 N°9 Touzine, Complexe Bayt Laatik, Tanger 90000
          </p>
        </section>
        
        <div className="text-sm text-gray-500 mt-8">
          Dernière mise à jour : 11 juin 2025
        </div>
      </div>
    </LegalLayout>
  );
};

export default Cookies;
