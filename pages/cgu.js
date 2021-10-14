import Page from '@/layouts/main'
import Section from '@/components/section'

import theme from '@/styles/theme'

function Cgu() {
  return (
    <Page title='Mentions légales'>
      <Section>
        <div className='row'>
          <div>
            <h2>Conditions Générales d’Utilisation</h2>
            <p>Tout utilisateur de la plateforme reconnaît expressément souscrire sans réserve aux présentes conditions générales d’utilisation (CGU). L’utilisation de la plateforme suppose le respect total des lois, règlements et tous les autres textes juridiques en vigueur. Il conviendra de respecter l’ensemble de ces dispositions et règles en toutes circonstances. A défaut, l’utilisateur est conscient qu’il risque des sanctions civiles, pénales et/ou disciplinaires.</p>

            <h4>Disponibilité du site</h4>
            <p>
              L’éditeur s’engage à mettre en œuvre tout ce qui est possible techniquement pour sécuriser l’accès et l’utilisation du site adresse.data.gouv.fr. Elle est accessible 24 heures sur 24, 7 jours sur 7, sauf en cas de force majeure ou de survenance d’un événement hors du contrôle de l’éditeur et sous réserve d’éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement de la plateforme.
            </p>
            <p>
              L’éditeur ne garantit pas que la plateforme fonctionne de manière ininterrompue, sécurisée ou qu’elle soit exempte d’erreurs. Les interventions de maintenance pourront être effectuées sans que les utilisateurs de adresse.data.gouv.fr n’aient été préalablement avertis.
            </p>
            <p>
              L’éditeur ne peut être tenu pour responsable d’une éventuelle rupture de ce service ou d’un problème technique empêchant un utilisateur d’accéder au site adresse.data.gouv.fr.
            </p>
            <p>
              L’éditeur se réserve la possibilité de refuser l’accès aux services offerts par adresse.data.gouv.fr en cas d’usage abusif ou de violation de dispositions législatives ou réglementaires en vigueur.
            </p>

            <h4>Accès aux données personnelles</h4>
            <p>
              En application de la loi n°78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les utilisateurs de la plateforme data.gouv.fr disposent notamment d’un droit d’accès et de rectification auprès de l’éditeur de la plateforme.
            </p>
            <p>
              Ce droit s’exerce auprès de la Mission Etalab, direction interministérielle du numérique (DINUM), 20 avenue de Ségur, 75007 Paris.
            </p>
            <p>
              La plateforme data.gouv.fr a été déclarée à la Commission Nationale de l’Informatique et des Libertés sous le numéro : eRa0876341t.
            </p>

            <h4>Stockage des données soumises à l’API</h4>
            <p>
              Les données adresses soumises à l’API peuvent être conservées dans un but d’amélioration du service, que ce soit au niveau des algorithmes ou au niveau du contenu de la BAN.
            </p>
            <p>
              Pour les fichiers CSV soumis au géocodage, seules les colonnes signalées comme contenant les données adresses peuvent être conservées, aucun stockage des autres colonnes n’est effectué à l’issu du traitement.
            </p>

          </div>
          <div>
            <h2>Nous contacter</h2>
            <p><a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a></p>

            <h2>Mentions légales</h2>
            <h4>Editeur</h4>
            <p>
              Direction interministérielle du numérique (DINUM)<br />{}
              20, avenue de Ségur<br />{}
              75007 Paris<br />{}
              dinsic-sec-directeur [à] modernisation.gouv.fr
            </p>

            <p>Directeur de la publication : M. Nadi Bou Hanna, DINUM</p>

            <h4>Hébergeur</h4>
            <p>
              Société OVH<br />{}
              SAS au capital de 10 059 500 €<br />{}
              RCS Lille Métropole 424 761 419 00045<br />{}
              Code APE 6311Z<br />{}
              Siège social : 2 rue Kellermann - 59100 Roubaix - France.
            </p>
          </div>
        </div>

        <style jsx>{`
        .row > div:nth-child(2) {
          margin-left: 3em;
        }

        @media (max-width: ${theme.breakPoints.laptop}) {
          .row > div:nth-child(2) {
            margin-left: 0;
          }
        }
      `}</style>
      </Section>
    </Page>
  )
}

export default Cgu
