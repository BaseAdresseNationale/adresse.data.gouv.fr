import React from 'react'
import Link from 'next/link'

import Section from '../section'
import Question from './question'

const About = () => (
  <Section>
    <div className='faq-row'>
      <div className='theme'>
        <h3>Base Adresse Nationale</h3>

        <Question question='Qu’est-ce que la Base Adresse Nationale ?'>
          <p>La Base Adresse Nationale est une base de données de référence ayant vocation à réunir toutes les adresses géolocalisées du territoire national.</p>
          <p>Elle est co-produite par la Direction Interministérielle du Numérique (la DINSIC), par l’IGN, par La Poste, par la Direction Générale des Finances Publiques (DGFiP) et par l’association OpenStreetMap France, dans le cadre d’une convention.</p>
          <p>Elle fait partie du <a href='https://www.data.gouv.fr/fr/reference'>Service Public des Données de référence</a>.</p>
        </Question>

        <Question question='La Base Adresse Nationale est-elle gratuite ?'>
          <p>La Base Adresse Nationale est disponible sous <strong>licence spécifique</strong> ou sous <strong>licence ODbL</strong>, elle est donc gratuite.</p>
          <p>Néanmoins ces licences impliquent certaines restrictions à la réutilisation qui empêche son utilisation dans certains cas.</p>
          <p>En mars 2019, le Premier Ministre a annoncé le passage de la Base Adresse Nationale sous Licence Ouverte, au plus tard pour le 1er janvier 2020. Ces contraintes à la réutilisation ne seront donc plus en vigueur, et la base de donnée deviendra donc gratuite et librement réutilisable pour tous.</p>
          <p>NB : Il n’existe pas de versions payantes de la Base Adresse Nationale. Il existe cependant des produits alternatifs proposés par certains de nos partenaires.</p>
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

        <Question
          question='La Base Adresse Nationale contient-elle des données personnelles ?'
        >
          <p>Non, cette base ne fait que référencer l’existence et la localisation géographique d’une adresse. Aucune information personnelle ne figure dans cette base de données.</p>
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
          <p>L’<a href='https://editeur.adresse.data.gouv.fr'>éditeur de Base Adresse Locale</a> développé par la mission Etalab est un outil simple accessible à tous.</p>
          <p>Les collectivités avec beaucoup de ressources (communautés d’agglomération, communautés urbaines, métropole, voire départements) disposent bien souvent d’une gestion des adresses intégrées à leur SI ou d’outils spécifiques, il leur suffit alors de produire un fichier au format BAL 1.1 et de le publier.</p>
          <p>Plusieurs éditeurs logiciels travaillent au support du format d’échange BAL 1.1, ils seront référencés sur ce site une fois leurs travaux aboutis.</p>
        </Question>

        <Question question='Comment publier une Base Adresse Locale ?'>
          <p>Pour publier une Base Adresse Locale, vous devez la référencer sur <a href='https://www.data.gouv.fr/fr/'>data.gouv.fr</a>. Elle doit être publiée au format CSV BAL 1.1, dans une organisation certifiée, et avec un mot-clé “base-adresse-locale”.</p>
          <p>Conscients que cette méthode est trop complexe pour la plupart des collectivités, nous développons un module de publication simplifié, qui devrait être lancé courant avril 2019.</p>
        </Question>

        <Question question='Sous quelle licence publier une Base Adresse Locale ?'>
          <p>L’objectif d’une Base Adresse Locale étant que celle-ci soit <strong>utilisée le plus largement possible</strong>, la mission Etalab et l’AMF suggèrent activement de publier les Bases Adresses Locales sous <strong>Licence Ouverte</strong>.</p>
          <p>Par ailleurs seule la Licence Ouverte permet d’alimenter la Base Adresse Nationale, le cadastre, l’INSEE et les principales solutions cartographiques et GPS du marché.</p>
          <p>Si une forme de protectionnisme peut être pertinente sur certaines données publiques, elle est exclus sur les adresses qui sont une donnée fondamentale.</p>
        </Question>
      </div>

      <div className='theme'>
        <h3>API de géocodage</h3>

        <Question
          question='Quelle est la licence des données proposées par l’API de géocodage ?'
        >
          <p>Les données utilisées sont celle du jeu de données <Link href='/donnees-nationales'>Adresses ODbL</Link></p>
        </Question>

        <Question
          question='Quelle sont les limitations en vigueur sur l’API de géocodage ?'
        >
          <>
            <p>Les appels sont limités à :</p>
            <ul>
              <li>50 requêtes par seconde et par IP pour le géocodage simple ;</li>
              <li>2 requêtes simultanées par IP pour le géocodage de masse (maximum 6 Mo par envoi de fichier).</li>
            </ul>
          </>
        </Question>

        <Question
          question='Est-il possible de faire lever les limites de l’API ?'
        >
          <>
            <p>Oui, mais uniquement si vous êtes un service public ou chargé d’une mission de service public</p>
            <p>Dans le cas contraire, vous pouvez aussi héberger notre API de géocodage chez vous, en suivant <a href='https://github.com/etalab/addok-docker'>ces instructions</a>.</p>
          </>
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
)

export default About
