import React from 'react'
import FaQuestion from 'react-icons/lib/fa/question'
import Link from 'next/link'

import Page from '../layouts/main'
import Head from '../components/head'
import Section from '../components/section'
import Question from '../components/faq/question'

const title = 'Foire aux questions'
const description = 'Questions les plus fréquemment posées.'

export default () => (
  <Page title={title} description={description}>
    <Head title={title} icon={<FaQuestion />} />
    <Section>
      <div className='faq-row'>
        <div className='theme'>
          <h3>Base Adresse Nationale</h3>

          <Question question='Qu’est-ce que la Base Adresse Nationale ?'>
            <p>La Base Adresse Nationale est une <strong>base de données</strong> ayant vocation à réunir <strong>l’ensemble des adresses géolocalisées du territoire national</strong>.</p>
            <p>Elle est <strong>co-produite</strong> par la Direction Interministérielle du Numérique (DINSIC) et l’IGN, avec la participation des collectivités locales, de la Direction Générale des Finances Publiques (DGFiP) et de l’INSEE.</p>
            <p>Elle fait partie du <a href='https://www.data.gouv.fr/fr/reference'>Service Public des Données de référence</a>.</p>
          </Question>

          <Question question='La Base Adresse Nationale est-elle gratuite ?'>
            <p>Jusqu’au 31 décembre 2019, la Base Adresse Nationale est disponible sous <strong>licence spécifique</strong> ou sous <strong>licence ODbL</strong>. Elle est donc dans les deux cas gratuite.</p>
            <p>Néanmoins ces licences impliquent certaines restrictions à la réutilisation des données qui peuvent interdire certains usages.</p>
            <p><strong>À partir du 1er janvier 2020, la Base Adresse Nationale sera disponible sous <a href='https://www.etalab.gouv.fr/licence-ouverte-open-licence'>Licence Ouverte</a> exclusivement, suite à <a href='https://www.ccomptes.fr/sites/default/files/2019-03/20190311-refere-S2018-3287-valorisation-donnees-IGN-Meteo-France-Cerema-rep-PM.pdf'>une décision du Premier ministre</a>.</strong></p>
          </Question>

          <Question question='À quelle fréquence la Base Adresse Nationale est-elle mise à jour ?'>
            <p>Les fichiers contenant les adresses de la Base Adresse Nationale sont diffusés de façon <strong>hebdomadaire</strong>.</p>
            <p>Ils suivent le processus de production indicatif suivant :</p>
            <ul>
              <li>Chaque lundi, l’IGN réalise un export des données de la base de gestion qu’il opère et le transmet à la DINSIC. La DINSIC met en ligne ce fichier sans modification sous le nom <strong>produit gratuit issu de la BAN</strong>.</li>
              <li>Chaque mardi, la DINSIC consolide les <strong>Bases Adresses Locales</strong> disponibles en un fichier national appelé <a href='https://www.data.gouv.fr/fr/datasets/adresses-locales/'>Adresses locales</a>.</li>
              <li>Chaque mercredi, la DINSIC produit et diffuse les fichiers <strong>Adresses ODbL</strong> et <strong>Adresses LO</strong> qui sont issus du <strong>produit gratuit issu de la BAN</strong>, des <strong>Bases Adresses Locales</strong>, des <a href='https://www.data.gouv.fr/fr/datasets/adresses-extraites-du-cadastre/'>adresses extraites du cadastre</a> et du <a href='https://www.data.gouv.fr/fr/datasets/le-marche-du-haut-et-tres-haut-debit-fixe-deploiements/'>fichier de suivi des déploiements du très haut débit fixe</a>. Les services qui les utilisent sont mis à jour dans les minutes qui suivent (géocodeur, API Adresse…).</li>
            </ul>
          </Question>

          <Question question='Pourquoi contribuer à la Base Adresse Nationale ?'>
            <p>En tant que base de données de référence, la Base Adresse Nationale a vocation à être utilisée par un nombre croissant d’acteurs, et en particulier dans le service public.</p>
            <p>Contribuer en tant que collectivité me garantit notamment que mes administrés bénéficieront des meilleures conditions en terme :</p>
            <ul>
              <li>de secours aux personnes,</li>
              <li>de livraison du courrier et des colis,</li>
              <li>de déploiement des réseaux,</li>
              <li>d’évolution des services publics de proximité (carte scolaire, santé…).</li>
            </ul>
            <p>Y contribuer en tant qu’utilisateur des données ou en tant que citoyen me permet d’améliorer la qualité du service qui m’est rendu, ou que je propose.</p>
          </Question>

          <Question
            question='Comment contribuer à la Base Adresse Nationale ?'
          >
            <p>Les modes de contribution sont décrits sur <Link href='/contribuer'><a>cette page</a></Link>.</p>
          </Question>

          <Question question='Mon adresse n’est pas dans la Base Adresse Nationale ! Que dois-je faire ?'>
            <p>La gestion des adresses est une <strong>compétence communale</strong>. Votre premier réflexe est de vous adresser à votre mairie, qui est en mesure de créer ou de mettre à jour votre adresse grâce aux outils mis à sa disposition.</p>
            <p><strong>Attention : il se peut que votre commune ne sache pas que cette gestion est de son ressort. N’hésitez pas à lui indiquer ce site et à nous mettre en relation.</strong></p>
          </Question>

          <Question
            question='La Base Adresse Nationale contient-elle des données à caractère personnel ?'
          >
            <p>Non, cette base ne fait que référencer l’existence et la localisation géographique d’une adresse. Aucune donnée à caractère personnel n’y figure.</p>
          </Question>
        </div>

        <div className='theme'>
          <h3>Bases Adresse Locales</h3>

          <Question question='Qu’est-ce qu’une Base Adresse Locale ?'>
            <p>Une <strong>Base Adresse Locale</strong> est un fichier géré par une collectivité locale (habituellement une commune ou un EPCI) et contenant toutes les adresses géolocalisées de celle-ci.</p>
            <p>Elle est publiée <strong>sous sa responsabilité</strong>, ce qui lui confère un caractère <strong>officiel</strong>.</p>
          </Question>

          <Question question='Pourquoi mettre en place une Base Adresse Locale ?'>
            <p>La création des voies et des adresses est <strong>une compétence de la commune</strong>, via le conseil municipal.</p>
            <p>Mettre en place une Base Adresse Locale, qui contient toutes les adresses de la commune, est l’expression de cette compétence, et est désormais permise grâce à un écosystème d’outils simples à prendre en main.</p>
            <p>L’existence d’une Base Adresse Locale <strong>publiée et à jour</strong> garantit une meilleure prise en compte des adresses dans les différents systèmes d’information des acteurs, qu’ils soient privés ou publics.</p>
            <p>Elle permet aussi une clarification des responsabilités en terme de mise à jour et d’exactitude des adresses, et permet d’accélérer les corrections d’erreurs.</p>
          </Question>

          <Question question='Avec quels outils peut-on créer ou gérer une Base Adresse Locale ?'>
            <p>L’<a href='https://editeur.adresse.data.gouv.fr'>éditeur de Base Adresse Locale</a> développé par la mission Etalab est un outil simple, gratuit et accessible à tous.</p>
            <p>Pour les usages les plus courants, tels que la création de voies ou de numéros, et les modifications de noms de rues, nul besoin de compétences techniques expertes sur cet outil. Des tutoriels sont à disposition pour guider les communes.</p>
            <p>Les communautés d’agglomération, communautés urbaines, métropole, voire départements disposent bien souvent d’une gestion des adresses intégrées à leur système d’information ou d’outils spécifiques. Il leur suffit alors de produire un fichier au <Link href='/bases-locales'>format BAL 1.1</Link> et de le publier.</p>
            <p>Plusieurs éditeurs logiciels travaillent au support du format d’échange BAL 1.1, ils seront référencés sur ce site à l’issue de leurs travaux.</p>
          </Question>

          <Question question='Comment publier une Base Adresse Locale ?'>
            <p>Pour publier une Base Adresse Locale, vous devez la référencer sur <a href='https://www.data.gouv.fr/fr/'>data.gouv.fr</a>. Elle doit être publiée au format CSV BAL 1.1, dans une organisation certifiée, et avec un mot-clé “base-adresse-locale”.</p>
            <p>Conscients que cette méthode est trop complexe pour la plupart des collectivités, nous développons un module de publication simplifié qui sera disponible d’ici la fin de l’année. La fonctionnalité de publication est d’ores-et-déjà disponible pour les utilisateurs de notre éditeur de Base Adresse Locale.</p>
          </Question>

          <Question question='Sous quelle licence publier une Base Adresse Locale ?'>
            <p>La <strong>DINSIC</strong> et l’<strong>Association des maires de France (AMF)</strong> suggèrent activement de publier les Bases Adresses Locales sous <a href='https://www.etalab.gouv.fr/licence-ouverte-open-licence'>Licence Ouverte</a>, licence qui garantit leur utilisation la plus large.</p>
            <p>Par ailleurs seule la <a href='https://www.etalab.gouv.fr/licence-ouverte-open-licence'>Licence Ouverte</a> permet d’alimenter la Base Adresse Nationale, le cadastre, l’INSEE et les principales solutions cartographiques et GPS du marché.</p>
            <p>Si une forme de protectionnisme peut être pertinente sur certaines données publiques, elle est exclue sur les adresses qui constituent une donnée fondamentale.</p>
          </Question>
        </div>

        <style jsx>{`
          .theme {
            margin: 1em 0;
          }

          .faq-row {
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </div>
    </Section>
  </Page>
)
