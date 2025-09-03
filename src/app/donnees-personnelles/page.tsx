import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'
import Section from '@/components/Section'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'
import type { DataType } from '@/lib/markdown'
import Breadcrumb from '@/layouts/Breadcrumb'
import { TextWrapper } from './page.styled'
import { Table } from '@codegouvfr/react-dsfr/Table'

export default async function Home() {
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('donnees-personnelles') || {}

  return (
    <Section pageTitle="Données Personnelles">
      <div className="on-this-page">
        <div className="text-wrapper">
          <div>
            <p>La plateforme Base Adresse Nationale (le « Portail BAN ») est un service public numérique qui a pour objectif d’informer les utilisateurs et de leur proposer un accès à la Base Adresse Nationale, qui référence l’intégralité des adresses du territoire français et les rend utilisables par et accessibles à tous.</p>
          </div>
          <div>
            <h3>QUI EST RESPONSABLE DES TRAITEMENTS DES DONNEES PERSONNELLES ?</h3>
            <p>En fonction des finalités des traitements de données personnelles identifiés ci-dessous, les responsables de traitement sont soit :</p>
            <p><strong>L’Institut national de l’information géographique et forestière (IGN)</strong>, représenté par son directeur général Monsieur Sébastien SORIANO,</p>
            <p>soit </p>
            <p><strong>L’Agence Nationale de la Cohésion des Territoires (ANCT)</strong>, représentée par son directeur général Monsieur Stanislas BOURRON.
              <br /><br />
              ( ci-après dénommés ensemble les « <strong>Responsables de traitements</strong> » ).
              <br /><br />
              Il est rappelé que le Portail BAN est susceptible de contenir des liens hypertextes renvoyant vers des sites tiers, comme précisé dans les Conditions Générales d’Utilisation. Les Responsables de traitements ne sont pas responsables des traitements de données personnelles qui seraient susceptibles d’être effectués par les éditeurs de ces sites tiers si les utilisateurs venaient à consulter ces sites. Aussi, les utilisateurs sont invités à prendre connaissance des dispositions relatives à la protection des données personnelles des sites tiers concernés qu’ils visitent et/ou tout autre site tiers vers lequel les utilisateurs pourraient être redirigés à partir notamment des sites concernés.
            </p>
          </div>
          <div>
            <h3>QUELLES SONT LES DONNÉES PERSONNELLES TRAITÉES ET A QUOI SERVENT-ELLES ? </h3>
            <h5>QUI PEUT AVOIR ACCÈS À CES DONNÉES ?</h5>
            <Table
              bordered
              caption="QUI PEUT AVOIR ACCÈS À CES DONNÉES ?"
              noCaption
              data={[
                [
                  'Gérer l’abonnement et l’envoi de la lettre d’information',
                  'ANCT',
                  'Nom, Prénom,Adresse couriel',
                  'Mission d’intérêt public relevant de la compétence de l’ANCT (article L. 1231-2 V 2° du code général des collectivités territoriales)',
                  'Jusqu’à ce que la personne concernée se désinscrive (lien de désinscription intégré aux newsletters)',
                  'NON',
                  'Les agents ANCT habilités',
                ],
                [
                  'Gérer l’organisation des webinaires et évènements.',
                  'L’ANCT traite les données pour les webinaires BAL et l’IGN les données pour les webinaires BAN',
                  'Nom, Prénom, Adresse courriel, Fonction, Organisme',
                  'Mission d’intérêt public relevant de la compétence de l’ANCT (article L. 1231-2 V 2° du code général des collectivités territoriales)',
                  'Anonymisation 6 mois après la fin du webinaire',
                  'NON',
                  'Les agents ANCT et IGN habilités',
                ],
                [
                  'Répondre aux messages envoyés via le formulaire de contact et l’adresse support.',
                  'L’ANCT répond sur le périmètre relatif à l’accompagnement des communes à la constitution de la BAL. L’IGN répond sur le périmètre relatif à la donnée BAN et sa réutilisation.',
                  'Nom, Prénom, Adresse couriel',
                  'Intérêt légitime',
                  '1 an à compter du dernier contact',
                  'NON',
                  'Les agents ANCT et IGN habilités',
                ],
                [
                  'Lever la limite pour l’utilisation du service de géocodage.',
                  'IGN',
                  'Nom, Prénom, Service, Adresse IP, Description de la mission',
                  'Mission d’intérêt public relevant de la compétence de l’IGN (article 2 7° du Décret du 27 octobre 2011)',
                  '1 an à compter du dernier contact',
                  'NON',
                  'Les agents IGN habilités',
                ],
                [
                  'Gérer les commentaires des communes sur les interventions des sociétés partenaires.',
                  'ANCT',
                  'Nom, prénom, Adresse courriel',
                  'Mission d’intérêt public relevant de la compétence de l’ANCT (article L. 1231-2 V 2° du code général des collectivités territoriales)',
                  'Supprimées après la modération',
                  'NON',
                  'Les agents ANCT habilités',
                ],
                [
                  'Sécuriser la connexion à l’espace d’administration de la page commune',
                  'IGN',
                  'Nom, Prénom, Adresse courriel professionnelle',
                  'Mission d’intérêt public relevant de la compétence de l’IGN (article 2 7° du Décret du 27 octobre 2011)',
                  '1 an à compter du dernier contact',
                  'NON',
                  'Les agents IGN habilités',
                ],
              ]}
              headers={[
                'Finalités de traitement',
                'Responsable de traitement',
                'Données traitées',
                'Bases légales de traitement',
                'Durée de conservation des données',
                'Transfert de données hors Union Européenne',
                'Destination des données',
              ]}
            />
          </div>
          <div>
            <p>
              <strong>QUI NOUS AIDE À TRAITER VOS DONNÉES À CARACTÈRE PERSONNEL ?</strong><br /><br />
              Certaines données sont envoyées à des sous-traitants, qui agissent pour le compte de l’IGN ou de l’ANCT respectivement, et selon leurs instructions.
            </p>
            <Table
              bordered
              caption="QUI NOUS AIDE À TRAITER VOS DONNÉES À CARACTÈRE PERSONNEL ?"
              noCaption
              data={[
                [
                  'OVH',
                  'Hébergement',
                  'France',
                  'https://us.ovhcloud.com/legal/data-processing-agreement/',
                ],
                [
                  'Brevo',
                  'Newsletter',
                  'France',
                  'https://www.brevo.com/legal/termsofuse/#data-processing-agreement-dpa',
                ],
                [
                  'Microsoft',
                  'Webinaires (Teams)',
                  'Union européenne',
                  'https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA?lang=13&year=2025',
                ],
                [
                  'DINUM/Démarches simplifiées',
                  'Formulaire de demande de levée de limite de l’API',
                  'France',
                  'https://doc.demarches-simplifiees.fr/cgu#_toc108111743',
                ],
                [
                  'DINUM/ProConnect',
                  'Authentification communes',
                  'France',
                  'https://www.proconnect.gouv.fr/cgu',
                ],
              ]}
              headers={[
                'Sous-traitant',
                'Traitement réalisé',
                'Pays destinataire',
                'Garanties',
              ]}
            />

          </div>
          <div>
            <h3>QUELS SONT VOS DROITS ?</h3>
            <p>Conformément à la réglementation en vigueur, vous bénéficiez d’un droit d’accès, de rectification, d’opposition et de suppression des informations qui vous concernent.</p>
            <p>Pour exercer vos droits ou pour toute question sur le traitement de vos données, vous pouvez nous écrire : </p>

            <p>- par mail aux adresses suivantes : dpo@ign.fr et dpo@anct.gouv.fr</p>
            <p>- ou par courrier postal aux adresses suivantes :</p>
            <p>Institut national de l’information géographique et forestière - Délégué à la protection des données (DPO)<br />
              73 avenue de Paris - 94165 Saint-Mandé
              <br />France
            </p>

            <p>ANCT - Délégué à la protection des données (DPO) <br />
              20 avenue de Ségur - TS 10717 75334 Paris Cedex 07 <br />
              France
            </p>
            <p>
              Puisque ce sont des droits personnels, nous ne traiterons votre demande que si nous sommes en mesure de vous identifier. Dans le cas contraire, nous pouvons être amenés à vous demander une preuve de votre identité.
              Les Responsables de traitements s’engagent à vous répondre dans un délai raisonnable qui ne dépasse pas 1 mois à compter de la réception de votre demande d’exercice de droits.
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés vous pouvez adresser une réclamation à la <a href="https://connexion.services.cnil.fr/login/" target="_blank">CNIL</a>.
            </p>
          </div>
          <div>
            <h3>A PROPOS DES COOKIES</h3>
            <p>
              Nous utilisons différents traceurs/cookies sur le Portail BAN pour mesurer l’audience et intégrer des services permettant d’améliorer l’interactivité du site.
            </p>
            <p>
              <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur" target="_blank">En savoir plus sur les cookies et leur fonctionnement</a>
            </p>
            <p>
              Les traceurs/cookies de navigation permettent aux services principaux du site de fonctionner de manière optimale.<strong>Vous pouvez techniquement les bloquer</strong> en utilisant les paramètres de votre navigateur mais votre expérience sur le site risque d’être dégradée.
            </p>
            <p>
              La Plateforme BAN utilise la solution Matomo en mode exempté, qui ne nécessite pas le recueil du consentement conformément aux recommandations de la CNIL.
              Par ailleurs, <strong>vous avez la possibilité de vous opposer à l’utilisation des traceurs de mesure d’audience</strong> strictement nécessaires au fonctionnement et aux opérations d’administration courante du site web et qui vous suivent de manière anonyme.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
