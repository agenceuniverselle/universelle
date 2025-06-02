// src/app/politique-de-confidentialite/page.tsx (or src/pages/politique-de-confidentialite.tsx)

import React from 'react';
 // Adjust path if necessary
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layouts/MainLayout';

// Define types for your sections if you want more structured data
interface PolicySection {
  id: string;
  title: string;
  content: JSX.Element; // Use JSX.Element to allow for rich content (p, ul, strong, etc.)
}

const PrivacyPolicyPage: React.FC = () => {
  // Define your policy content here, using the text you provided
  const policySections: PolicySection[] = [
    {
      id: 'introduction',
      title: 'Politique de Confidentialité',
      content: (
        <>
          <p className="mb-3 text-black">Dernière mise à jour : 24 Mai 2025</p>
          <p className="mb-3 text-black">
            Cette Politique de Confidentialité décrit Nos politiques et procédures
            concernant la collecte, l'utilisation et la divulgation de Vos
            informations lorsque Vous utilisez le Service et Vous informe de Vos
            droits en matière de confidentialité et de la manière dont la loi Vous
            protège.
          </p>
          <p className='text-black'>
            Nous utilisons Vos Données Personnelles pour fournir et améliorer le
            Service. En utilisant le Service, Vous acceptez la collecte et
            l'utilisation d'informations conformément à cette Politique de
            Confidentialité.
          </p>
        </>
      ),
    },
    {
      id: 'interpretation-definitions',
      title: 'Interprétation et Définitions',
      content: (
        <>
          <h3 className="font-semibold text-lg mt-4 mb-2 text-black">Interprétation</h3>
          <p className="mb-3 text-black">
            Les mots dont la lettre initiale est en majuscule ont des significations
            définies dans les conditions suivantes. Les définitions suivantes auront
            la même signification, qu'elles apparaissent au singulier ou au pluriel.
          </p>
          <h3 className="font-semibold text-lg mt-4 mb-2 text-black">Définitions</h3>
          <p className="mb-3 text-black">Aux fins de la présente Politique de Confidentialité :</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li className='text-black'>
           <span className="font-semibold">Compte</span> désigne un compte unique créé pour Vous permettre
              d'accéder à notre Service ou à des parties de notre Service.
            </li>
            <li className='text-black'>
              <span className="font-semibold">Filiale</span> désigne une entité qui contrôle, est contrôlée par ou
              est sous le contrôle commun avec une partie, où "contrôle" signifie
              la propriété de 50 % ou plus des actions, des participations ou
              d'autres titres ayant le droit de vote pour l'élection des
              administrateurs ou d'une autre autorité de gestion.
            </li>
            <li className='text-black'>
              <span className="font-semibold">Société</span> (désignée par "la Société", "Nous", "Notre" ou "Nos"
              dans cet Accord) fait référence à **Agence universelle, IMM17 N°9
              Touzine, Complexe Bayt Laatik, Tanger 90000**.
            </li>
            <li className='text-black'>
              <span className="font-semibold">Cookies</span>  sont de petits fichiers qui sont placés sur Votre
              ordinateur, appareil mobile ou tout autre appareil par un site
              web, contenant les détails de Votre historique de navigation sur ce
              site web parmi ses nombreuses utilisations.
            </li>
            <li className='text-black'>
              <span className="font-semibold">Pays</span> fait référence à : <span className="font-semibold">Maroc</span>.
            </li>
            <li className='text-black'>
               <span className="font-semibold">Appareil</span> désigne tout appareil pouvant accéder au Service tel
              qu'un ordinateur, un téléphone portable ou une tablette numérique.
            </li>
            <li className='text-black'>
               <span className="font-semibold">Données Personnelles</span>  est toute information qui concerne un
              individu identifié ou identifiable.
            </li>
            <li className='text-black'>
              <span className="font-semibold">Service</span>  fait référence au Site Web.
            </li>
            <li className='text-black'>
              <span className="font-semibold">Fournisseur de Services</span> désigne toute personne physique ou
              morale qui traite les données pour le compte de la Société. Il
              s'agit d'entreprises tierces ou d'individus employés par la Société
              pour faciliter le Service, pour fournir le Service au nom de la
              Société, pour effectuer des services liés au Service ou pour aider
              la Société à analyser la manière dont le Service est utilisé.
            </li>
            <li className='text-black'>
               <span className="font-semibold">Service de Médias Sociaux Tiers</span> fait référence à tout site web
              ou tout site de réseau social par lequel un Utilisateur peut se
              connecter ou créer un compte pour utiliser le Service.
            </li>
            <li className='text-black'>
               <span className="font-semibold">Données d'Utilisation</span> fait référence aux données collectées
              automatiquement, générées soit par l'utilisation du Service soit
              par l'infrastructure du Service elle-même (par exemple, la durée
              d'une visite de page).
            </li>
            <li className='text-black'>
               <span className="font-semibold">Site Web</span> fait référence à <span className="font-semibold">Universelle</span>, accessible depuis{' '}
              <a href="https://universelle.ma/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://universelle.ma/</a>
            </li>
            <li className='text-black'>
              <span className="font-semibold">Vous </span> désigne la personne physique accédant ou utilisant le
              Service, ou l'entreprise, ou toute autre entité juridique pour le
              compte de laquelle cette personne physique accède ou utilise le
              Service, selon le cas.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'collecte-utilisation-donnees',
      title: 'Collecte et Utilisation de Vos Données Personnelles',
      content: (
        <>
          <h3 className="font-semibold text-lg mt-4 mb-2 text-black">Types de Données Collectées</h3>
          <h4 className="font-semibold mt-4 mb-2 text-black">Données Personnelles</h4>
          <p className="mb-3 text-black">
            Lors de l'utilisation de Notre Service, Nous pourrions Vous demander
            de Nous fournir certaines informations personnellement identifiables
            qui peuvent être utilisées pour Vous contacter ou Vous identifier. Les
            informations personnellement identifiables peuvent inclure, sans s'y
            limiter :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li className='text-black'>Adresse e-mail</li>
            <li className='text-black'>Nom et prénom</li>
            <li className='text-black'>Numéro de téléphone</li>
            <li className='text-black'>Adresse, État, Province, Code Postal, Ville</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-2 text-black">Données d'Utilisation</h4>
          <p className="mb-3 text-black">
            Les Données d'Utilisation sont collectées automatiquement lors de
            l'utilisation du Service.
          </p>
          <p className="mb-3 text-black">
            Les Données d'Utilisation peuvent inclure des informations telles
            que l'adresse IP de Votre appareil (par exemple, adresse IP), le type
            de navigateur, la version du navigateur, les pages de Notre Service
            que Vous visitez, l'heure et la date de Votre visite, le temps passé
            sur ces pages, les identifiants uniques d'appareil et d'autres
            données de diagnostic.
          </p>
          <p className="mb-3 text-black">
            Lorsque Vous accédez au Service par ou via un appareil mobile, Nous
            pouvons collecter automatiquement certaines informations, y compris,
            mais sans s'y limiter, le type d'appareil mobile que Vous utilisez,
            l'identifiant unique de Votre appareil mobile, l'adresse IP de Votre
            appareil mobile, Votre système d'exploitation mobile, le type de
            navigateur Internet mobile que Vous utilisez, les identifiants
            uniques d'appareil et d'autres données de diagnostic.
          </p>
          <p className='text-black'>
            Nous pouvons également collecter des informations que Votre
            navigateur envoie chaque fois que Vous visitez Notre Service ou
            lorsque Vous accédez au Service par ou via un appareil mobile.
          </p>

          <h4 className="font-semibold mt-4 mb-2 text-black">Informations provenant des Services de Médias Sociaux Tiers</h4>
          <p className="mb-3 text-black ">
            La Société Vous permet de créer un compte et de Vous connecter
            pour utiliser le Service via les Services de Médias Sociaux Tiers
            suivants :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-black">
            <li className='text-black'>Google</li>
            <li className='text-black'>Facebook</li>
            <li className='text-black'>Instagram</li>
            <li className='text-black'>Twitter</li>
            <li className='text-black'>LinkedIn</li>
          </ul>
          <p className="mb-3 text-black">
            Si Vous décidez de Vous inscrire ou de Nous accorder un accès à un
            Service de Médias Sociaux Tiers, Nous pouvons collecter des Données
            Personnelles déjà associées à Votre compte de Service de Médias
            Sociaux Tiers, telles que Votre nom, Votre adresse e-mail, Vos
            activités ou Votre liste de contacts associée à ce compte.
          </p>
          <p className='text-black'>
            Vous pouvez également avoir la possibilité de partager des
            informations supplémentaires avec la Société via Votre compte de
            Service de Médias Sociaux Tiers. Si Vous choisissez de fournir de
            telles informations et Données Personnelles, lors de l'inscription
            ou autrement, Vous donnez à la Société la permission de les utiliser,
            de les partager et de les stocker d'une manière conforme à cette
            Politique de Confidentialité.
          </p>

          <h4 className="font-semibold mt-4 mb-2 text-black">Technologies de Suivi et Cookies</h4>
          <p className="mb-3 text-black">
            Nous utilisons des Cookies et des technologies de suivi
            similaires pour suivre l'activité sur Notre Service et stocker
            certaines informations. Les technologies de suivi utilisées sont les
            balises web, les balises et les scripts pour collecter et suivre les
            informations et pour améliorer et analyser Notre Service. Les
            technologies que Nous utilisons peuvent inclure :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-black">
            <li>
               <span className="font-semibold">Cookies de Navigateur</span> Un cookie est un petit fichier placé
              sur Votre Appareil. Vous pouvez demander à Votre navigateur de
              refuser tous les Cookies ou d'indiquer quand un Cookie est envoyé.
              Cependant, si Vous n'acceptez pas les Cookies, Vous pourriez ne
              pas être en mesure d'utiliser certaines parties de notre Service.
              À moins que vous n'ayez ajusté les paramètres de votre navigateur
              pour qu'il refuse les Cookies, notre Service peut utiliser des Cookies.
            </li>
            <li>
             <span className="font-semibold">Balises Web </span> Certaines sections de notre Service et de nos
              e-mails peuvent contenir de petits fichiers électroniques connus
              sous le nom de balises web (également appelées gifs transparents,
              balises pixel et gifs à pixel unique) qui permettent à la Société,
              par exemple, de compter les utilisateurs qui ont visité ces pages
              ou ouvert un e-mail et pour d'autres statistiques de site web
              connexes (par exemple, enregistrer la popularité d'une certaine
              section et vérifier l'intégrité du système et du serveur).
            </li>
          </ul>
          <p className="mb-3 text-black">
            Les Cookies peuvent être des "Cookies Persistants" ou des "Cookies
            de Session". Les Cookies Persistants restent sur Votre ordinateur
            personnel ou appareil mobile lorsque Vous vous déconnectez, tandis que
            les Cookies de Session sont supprimés dès que Vous fermez Votre
            navigateur web. 
          </p>
          <p className="mb-3 text-black">
            Nous utilisons à la fois des Cookies de Session et des Cookies
            Persistants aux fins énoncées ci-dessous :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-black">
            <li>
                <span className="font-semibold">Cookies Nécessaires / Essentiels </span>
              <br/>
              Type : Cookies de Session
              <br/>
              Administrés par : Nous
              <br/>
              Objectif : Ces Cookies sont essentiels pour Vous fournir les
              services disponibles via le Site Web et pour Vous permettre
              d'utiliser certaines de ses fonctionnalités. Ils aident à
              authentifier les utilisateurs et à prévenir l'utilisation
              frauduleuse des comptes d'utilisateurs. Sans ces Cookies, les
              services que Vous avez demandés ne peuvent pas être fournis, et
              Nous n'utilisons ces Cookies que pour Vous fournir ces services.
            </li>
            <li>
               <span className="font-semibold">Cookies de Politique de Cookies / Acceptation de l'Avis</span>
              <br/>
              Type : Cookies Persistants
              <br/>
              Administrés par : Nous
              <br/>
              Objectif : Ces Cookies identifient si les utilisateurs ont accepté
              l'utilisation de cookies sur le Site Web.
            </li>
            <li>
               <span className="font-semibold">Cookies de Fonctionnalité</span>
              <br/>
              Type : Cookies Persistants
              <br/>
              Administrés par : Nous
              <br/>
              Objectif : Ces Cookies Nous permettent de mémoriser les choix que
              Vous faites lorsque Vous utilisez le Site Web, tels que la
              mémorisation de Vos détails de connexion ou de Votre préférence
              linguistique. Le but de ces Cookies est de Vous offrir une
              expérience plus personnelle et de Vous éviter d'avoir à
              saisir à nouveau vos préférences chaque fois que Vous utilisez
              le Site Web.
            </li>
          </ul>
          <p className='text-black'>
            Pour plus d'informations sur les cookies que nous utilisons et vos
            choix concernant les cookies, veuillez visiter notre Politique en
            matière de Cookies ou la section Cookies de notre Politique de
            Confidentialité.
          </p>
        </>
      ),
    },
    {
      id: 'utilisation-donnees-personnelles',
      title: 'Utilisation de Vos Données Personnelles',
      content: (
        <>
          <p className="mb-3 text-black">
            La Société peut utiliser les Données Personnelles aux fins suivantes :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-black">
            <li>
               <span className="font-semibold">Pour fournir et maintenir notre Service</span>, y compris pour
              surveiller l'utilisation de notre Service.
            </li>
            <li>
               <span className="font-semibold">Pour gérer Votre Compte</span>: pour gérer Votre inscription en tant
              qu'utilisateur du Service. Les Données Personnelles que Vous
              fournissez peuvent Vous donner accès à différentes fonctionnalités
              du Service qui Vous sont disponibles en tant qu'utilisateur
              enregistré.
            </li>
            <li>
              <span className="font-semibold">Pour l'exécution d'un contrat</span> : le développement, la
              conformité et l'exécution du contrat d'achat des produits, articles
              ou services que Vous avez achetés ou de tout autre contrat avec
              Nous via le Service.
            </li>
            <li>
               <span className="font-semibold">Pour Vous contacter</span> : Pour Vous contacter par e-mail, appels
              téléphoniques, SMS, ou d'autres formes équivalentes de communication
              électronique, telles que les notifications push d'une application
              mobile concernant les mises à jour ou les communications
              informatives liées aux fonctionnalités, produits ou services
              contractés, y compris les mises à jour de sécurité, lorsque cela
              est nécessaire ou raisonnable pour leur mise en œuvre.
            </li>
            <li>
               <span className="font-semibold">Pour Vous fournir des actualités</span>, des offres spéciales et des
              informations générales sur d'autres biens, services et événements
              que nous proposons qui sont similaires à ceux que vous avez déjà
              achetés ou pour lesquels vous vous êtes renseigné, à moins que Vous
              n'ayez choisi de ne pas recevoir de telles informations.
            </li>
            <li>
               <span className="font-semibold">Pour gérer Vos demandes</span> : Pour prendre en charge et gérer Vos
              demandes auprès de Nous.
            </li>
            <li>
               <span className="font-semibold">Pour les transferts d'entreprise</span> : Nous pouvons utiliser Vos
              informations pour évaluer ou mener une fusion, une cession, une
              restructuration, une réorganisation, une dissolution ou toute autre
              vente ou transfert de tout ou partie de Nos actifs, que ce soit
              dans le cadre d'une activité continue ou d'une faillite, d'une
              liquidation ou d'une procédure similaire, dans laquelle les Données
              Personnelles que Nous détenons sur Nos utilisateurs du Service
              figurent parmi les actifs transférés.
            </li>
            <li>
               <span className="font-semibold">À d'autres fins</span> : Nous pouvons utiliser Vos informations à
              d'autres fins, telles que l'analyse de données, l'identification
              des tendances d'utilisation, la détermination de l'efficacité de
              nos campagnes promotionnelles et l'évaluation et l'amélioration de
              notre Service, produits, services, marketing et de votre expérience.
            </li>
          </ul>
          <h3 className="font-semibold text-lg mt-4 mb-2 text-black">Partage de Vos informations personnelles</h3>
          <p className="mb-3 text-black">
            Nous pouvons partager Vos informations personnelles dans les
            situations suivantes :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-black">
            <li>
               <span className="font-semibold">Avec les Fournisseurs de Services</span> : Nous pouvons partager Vos
              informations personnelles avec les Fournisseurs de Services pour
              surveiller et analyser l'utilisation de notre Service, pour Vous
              contacter.
            </li>
            <li>
               <span className="font-semibold">Pour les transferts d'entreprise</span> : Nous pouvons partager ou
              transférer Vos informations personnelles en relation avec, ou
              pendant les négociations de, toute fusion, vente d'actifs de la
              Société, financement ou acquisition de tout ou partie de Notre
              entreprise par une autre société.
            </li>
            <li>
               <span className="font-semibold">Avec les Filiales</span> : Nous pouvons partager Vos informations avec
              Nos filiales, auquel cas nous exigerons de ces filiales qu'elles
              respectent cette Politique de Confidentialité. Les filiales
              comprennent Notre société mère et toute autre filiale, partenaire
              de coentreprise ou autres sociétés que Nous contrôlons ou qui sont
              sous contrôle commun avec Nous.
            </li>
            <li>
               <span className="font-semibold">Avec les partenaires commerciaux</span> : Nous pouvons partager Vos
              informations avec Nos partenaires commerciaux pour Vous offrir
              certains produits, services ou promotions.
            </li>
            <li>
               <span className="font-semibold">Avec d'autres utilisateurs</span> : lorsque Vous partagez des
              informations personnelles ou interagissez autrement dans les zones
              publiques avec d'autres utilisateurs, ces informations peuvent être
              consultées par tous les utilisateurs et peuvent être distribuées
              publiquement à l'extérieur. Si Vous interagissez avec d'autres
              utilisateurs ou Vous inscrivez via un Service de Médias Sociaux
              Tiers, Vos contacts sur le Service de Médias Sociaux Tiers peuvent
              voir Votre nom, profil, photos et description de Votre activité.
              De même, les autres utilisateurs pourront voir des descriptions de
              Votre activité, communiquer avec Vous et consulter Votre profil.
            </li>
            <li>
               <span className="font-semibold">Avec Votre consentement</span> : Nous pouvons divulguer Vos
              informations personnelles à toute autre fin avec Votre consentement.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'conservation-donnees',
      title: 'Conservation de Vos Données Personnelles',
      content: (
        <>
          <p className="mb-3 text-black">
            La Société conservera Vos Données Personnelles uniquement aussi longtemps
            que nécessaire aux fins énoncées dans cette Politique de Confidentialité.
            Nous conserverons et utiliserons Vos Données Personnelles dans la mesure
            nécessaire pour nous conformer à nos obligations légales (par exemple, si
            nous sommes tenus de conserver vos données pour nous conformer aux lois
            applicables), résoudre les litiges et faire respecter nos accords et
            politiques juridiques.
          </p>
          <p className='text-black'>
            La Société conservera également les Données d'Utilisation à des fins
            d'analyse interne. Les Données d'Utilisation sont généralement conservées
            pendant une période plus courte, sauf lorsque ces données sont utilisées
            pour renforcer la sécurité ou pour améliorer la fonctionnalité de Notre
            Service, ou que Nous sommes légalement tenus de conserver ces données
            pendant des périodes plus longues.
          </p>
        </>
      ),
    },
    {
      id: 'transfert-donnees',
      title: 'Transfert de Vos Données Personnelles',
      content: (
        <>
          <p className="mb-3 text-black">
            Vos informations, y compris les Données Personnelles, sont traitées dans
            les bureaux d'exploitation de la Société et dans tout autre endroit où les
            parties impliquées dans le traitement sont situées. Cela signifie que ces
            informations peuvent être transférées vers — et maintenues sur — des
            ordinateurs situés en dehors de Votre état, province, pays ou autre
            juridiction gouvernementale où les lois sur la protection des données
            peuvent différer de celles de Votre juridiction.
          </p>
          <p className="mb-3 text-black">
            Votre consentement à cette Politique de Confidentialité, suivi de Votre
            soumission de ces informations, représente Votre accord à ce transfert.
          </p>
          <p className='text-black'>
            La Société prendra toutes les mesures raisonnablement nécessaires pour
            garantir que Vos données sont traitées en toute sécurité et
            conformément à cette Politique de Confidentialité et aucun transfert de
            Vos Données Personnelles n'aura lieu vers une organisation ou un pays à
            moins qu'il n'y ait des contrôles adéquats en place, y compris la
            sécurité de Vos données et autres informations personnelles.
          </p>
        </>
      ),
    },
    {
      id: 'suppression-donnees',
      title: 'Supprimer Vos Données Personnelles',
      content: (
        <>
          <p className="mb-3 text-black">
            Vous avez le droit de supprimer ou de demander que Nous Vous aidions à
            supprimer les Données Personnelles que Nous avons collectées à Votre
            sujet.
          </p>
          <p className="mb-3 text-black">
            Notre Service peut Vous donner la possibilité de supprimer certaines
            informations Vous concernant depuis le Service.
          </p>
          <p className="mb-3 text-black">
            Vous pouvez mettre à jour, modifier ou supprimer Vos informations à
            tout moment en Vous connectant à Votre Compte, si Vous en avez un, et
            en visitant la section des paramètres du compte qui Vous permet de
            gérer Vos informations personnelles. Vous pouvez également Nous
            contacter pour demander l'accès, la correction ou la suppression de
            toute information personnelle que Vous Nous avez fournie.
          </p>
          <p className='text-black'>
            Veuillez noter, cependant, que Nous pourrions avoir besoin de
            conserver certaines informations lorsque nous avons une obligation
            légale ou une base légale pour le faire.
          </p>
        </>
      ),
    },
    {
      id: 'divulgation-donnees',
      title: 'Divulgation de Vos Données Personnelles',
      content: (
        <>
          <h3 className="font-semibold text-lg mt-4 mb-2 text-black">Transactions Commerciales</h3>
          <p className="mb-3 text-black">
            Si la Société est impliquée dans une fusion, une acquisition ou une
            vente d'actifs, Vos Données Personnelles peuvent être transférées.
            Nous fournirons un avis avant que Vos Données Personnelles ne soient
            transférées et ne soient soumises à une Politique de Confidentialité
            différente.
          </p>

          <h3 className="font-semibold text-lg mt-4 mb-2 text-black">Application de la loi</h3>
          <p className="mb-3 text-black">
            Dans certaines circonstances, la Société peut être tenue de divulguer
            Vos Données Personnelles si la loi l'exige ou en réponse à des
            demandes valides des autorités publiques (par exemple, un tribunal
            ou une agence gouvernementale).
          </p>

          <h3 className="font-semibold text-lg mt-4 mb-2 text-black">Autres exigences légales</h3>
          <p className="mb-3 text-black">
            La Société peut divulguer Vos Données Personnelles de bonne foi si
            une telle action est nécessaire pour :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-black">
            <li>Se conformer à une obligation légale</li>
            <li>Protéger et défendre les droits ou la propriété de la Société</li>
            <li>Prévenir ou enquêter sur d'éventuels actes répréhensibles liés au Service</li>
            <li>Protéger la sécurité personnelle des Utilisateurs du Service ou du public</li>
            <li>Se protéger contre la responsabilité légale</li>
          </ul>
        </>
      ),
    },
    {
      id: 'securite-donnees',
      title: 'Sécurité de Vos Données Personnelles',
      content: (
        <>
          <p className='text-black'>
            La sécurité de Vos Données Personnelles est importante pour Nous, mais
            rappelez-vous qu'aucune méthode de transmission sur Internet, ni
            méthode de stockage électronique n'est sécurisée à 100 %. Bien que
            Nous nous efforcions d'utiliser des moyens commercialement
            acceptables pour protéger Vos Données Personnelles, Nous ne pouvons
            garantir leur sécurité absolue.
          </p>
        </>
      ),
    },
    {
      id: 'confidentialite-enfants',
      title: 'Confidentialité des Enfants',
      content: (
        <>
          <p className="mb-3 text-black">
            Notre Service ne s'adresse à personne de moins de 13 ans. Nous ne
            collectons pas sciemment d'informations personnellement identifiables
            auprès de personnes de moins de 13 ans. Si Vous êtes un parent ou un
            tuteur et que Vous savez que Votre enfant Nous a fourni des Données
            Personnelles, veuillez Nous contacter. Si Nous prenons connaissance
            que Nous avons collecté des Données Personnelles auprès d'une
            personne de moins de 13 ans sans vérification du consentement
            parental, Nous prenons des mesures pour supprimer ces informations
            de Nos serveurs.
          </p>
          <p className='text-black'>
            Si Nous devons nous fier au consentement comme base légale pour le
            traitement de Vos informations et que Votre pays exige le
            consentement d'un parent, Nous pourrions exiger le consentement de
            Votre parent avant de collecter et d'utiliser ces informations.
          </p>
        </>
      ),
    },
    {
      id: 'liens-autres-sites',
      title: 'Liens vers d\'autres Sites Web',
      content: (
        <>
          <p className="mb-3 text-black">
            Notre Service peut contenir des liens vers d'autres sites web qui ne
            sont pas exploités par Nous. Si Vous cliquez sur un lien tiers, Vous
            serez dirigé vers le site de ce tiers. Nous Vous conseillons vivement
            d'examiner la Politique de Confidentialité de chaque site que Vous
            visitez.
          </p>
          <p className='text-black'>
            Nous n'avons aucun contrôle et n'assumons aucune responsabilité
            quant au contenu, aux politiques de confidentialité ou aux pratiques
            de tout site ou service tiers.
          </p>
        </>
      ),
    },
    {
      id: 'modifications-politique',
      title: 'Modifications de cette Politique de Confidentialité',
      content: (
        <>
          <p className="mb-3 text-black">
            Nous pouvons mettre à jour Notre Politique de Confidentialité de temps
            à autre. Nous Vous informerons de tout changement en publiant la
            nouvelle Politique de Confidentialité sur cette page.
          </p>
          <p className="mb-3 text-black">
            Nous Vous informerons par e-mail et/ou par un avis bien visible sur
            Notre Service, avant que le changement ne devienne effectif et
            mettrons à jour la date de "Dernière mise à jour" en haut de cette
            Politique de Confidentialité.
          </p>
          <p className='text-black'>
            Il Vous est conseillé de consulter cette Politique de
            Confidentialité périodiquement pour tout changement. Les modifications
            apportées à cette Politique de Confidentialité sont effectives lorsqu'elles
            sont publiées sur cette page.
          </p>
        </>
      ),
    },
    {
      id: 'nous-contacter',
      title: 'Nous contacter',
      content: (
        <>
          <p className="mb-3 text-black">
            Si vous avez des questions concernant cette Politique de
            Confidentialité, Vous pouvez Nous contacter :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-black">
            <li>Par e-mail : <a href="mailto:contact@universelle.ma" className="text-blue-600 hover:text-blue-800 underline">contact@universelle.ma</a></li>
            <li>En visitant cette page sur notre site web : <a href="https://universelle.ma/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://universelle.ma/</a></li>
            <li>Par téléphone : +212 808604195</li>
          </ul>
         
        </>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar for navigation */}
        <aside className="w-full md:w-1/4 sticky top-40 h-fit max-h-[80vh] overflow-y-auto pr-4 border-r md:border-b-0 border-gray-200 hidden md:block">
          <h3 className="text-xl font-bold mb-4 text-blackdark:text-gray-200">
            Navigation
          </h3>
          <nav className="space-y-2 ">
            {policySections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-black hover:text-luxe-blue transition-colors duration-200 py-1"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="w-full md:w-3/4 mt-16 md:mt-24 lg:mt-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* The main title should reflect the first section title or be a general page title */}
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-black ">
              Politique de Confidentialité
            </h1>
            <p className="text-black dark:text-black-400 mb-8">
              Dernière mise à jour : 24 Mai 2025
            </p>

            <div className="space-y-8">
              {policySections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold mb-3 text-black">
                    {section.title}
                  </h2>
                  <div className="text-black dark:text-gray-300 leading-relaxed">
                    {section.content}
                  </div>
                  {/* Only add separator if it's not the last section */}
                  {index < policySections.length - 1 && (
                    <Separator className="my-8" />
                  )}
                </section>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;