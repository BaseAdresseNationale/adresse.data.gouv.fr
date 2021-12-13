import PropTypes from 'prop-types'
import {X} from 'react-feather'
import theme from '@/styles/theme'

function ValidationInfos({handleClose}) {
  return (
    <div className='selected-issue'>
      <div className='dialog'>
        <div className='flex-container'>
          <h3>Informations sur la validation : </h3>
          <X size={40} style={{cursor: 'pointer'}} onClick={handleClose} />
        </div>
        <div className='scroll'>
          <div className='title'>Validation de la Base Adresse Locale</div>
          <ul>
            <li>Le nom de Base Adresse Locale est obligatoire</li>
            <li>Une adresse mail est obligatoire</li>
            <li>La Base Adresses Locale doit comporter une commune</li>
            <li>Une adresse doit avoir <code>numero</code>, <code>nomVoie</code> et <code>nomVoie</code> doit être valide</li>
          </ul>
          <div className='sub-title'>Validation du fichier</div>
          <ul>
            <li>Le fichier doit être encodé en UTF-8</li>
            <li>Les lignes doivent être délimitées par des points-virgules <code>;</code></li>
            <li>Les sauts de ligne doivent correspondre à <code>/n</code> ou <code>/r/n2</code></li>
          </ul>
          <div className='sub-title'>date de dernière mise à jour</div>
          <ul>
            <li>La date doit avoir un format <code>yyyy-MM-dd</code></li>
            <li>La date doit être valide (<code>parseISO</code>)</li>
          </ul>

          <div className='sub-title'>cle_interop</div>
          <ul>
            <li>La clé d’interopérabilité est obligatoire</li>
            <li>La clé d’interopérabilité doit contenir son numéro</li>
            <li>La clé d’interopérabilité doit être en minuscules</li>
            <li>La structure de la clé doit comporter au moins deux underscores / au moins trois segments</li>
            <li>La partie numéro de la clé d’interopérabilité doit contenir 5 caractères</li>
          </ul>

          <div className='title'>Numéro :</div>
          <div className='sub-title'>numero</div>
          <ul>
            <li>La valeur du champ numéro doit être un nombre entier</li>
            <li>La valeur du champ numéro ne doit pas être préfixée par des zéros, sauf si le numéro est <code>0</code></li>
            <li>Le numéro doit faire cinq caractères</li>
            <li>Le numéro doit être rattaché un une voie</li>
            <li>Le numéro ne peut pas être supérieur à 5000</li>
          </ul>

          <div className='sub-title'>suffixe</div>
          <ul>
            <li>La valeur du champ suffixe doit commencer par un caractère alphanumérique.</li>
            <li>La valeur du champ suffixe est trop longue</li>
          </ul>

          <div className='sub-title'>positions</div>
          <ul>
            <li>La position doit comporter une des valeurs suivantes :
              <ul>
                <li><code>délivrance postale</code></li>
                <li><code>entrée</code></li>
                <li><code>bâtiment</code></li>
                <li><code>cage d’escalier</code></li>
                <li><code>logement</code></li>
                <li><code>parcelle</code></li>
                <li><code>segment</code></li>
                <li><code>service technique</code></li>
              </ul>
            </li>
            <li><code>x</code>, <code>y</code>, <code>lon</code> et lat doivent être un nombre entier ou à virgule séparé par <code>.</code></li>
          </ul>

          <div className='sub-title'>parcelles</div>
          <ul>
            <li>Ne doit pas contenir de pipe <code>|</code> en début ou en fin de chaine</li>
            <li>Ne peut pas être vide</li>
            <li>Ce champs doit contenir 14 ou 15 caractères</li>
          </ul>

          <div className='title'>Voie :</div>
          <div className='sub-title'>voie_nom</div>
          <ul>
            <li>Le nom de la voie doit comprendre entre 4 et 200 caractères</li>
            <li>Le nom de la voie ne peut pas être en majuscule</li>
            <li>Le nom de la voie ne peux pas contenir un caractère tiret bas <code>_</code></li>
            <li>Le nom de voie doit commencer par une lettre</li>
          </ul>

          <div className='title'>Lieux-dits :</div>
          <ul>
            <li>Les lieux-dits doivent avoir un numéro supérieur à <code>5000</code></li>
          </ul>

          <div className='title'>Commune :</div>
          <div className='sub-title'>commune_insee</div>
          <ul>
            <li>Le code INSEE de la commune n’est pas un code valide de commune actuelle.</li>
            <li>Le code doit être présent dans la base de communes actuelles</li>
          </ul>

          <div className='sub-title'>commune_deleguee_insee</div>
          <ul>
            <li>Le code doit être présent dans le base de communes anciennes</li>
            <li>Le code INSEE de la commune n’est pas un code valide de commune ancienne (déléguée, associées ou périmée)</li>
          </ul>

        </div>
      </div>
      <style jsx>{`
        .selected-issue {
          background-color: rgba(0,0,0,0.2);
          padding: 2em;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
        }

        .dialog {
          background-color: #fff;
          margin: auto;
          padding: 2em;
          height: 100%;
          max-width: 1400px;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }

        .flex-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .title {
          margin: 1em 0;
          font-size: 1.2em;
          font-weight: bolder;
        }

        .sub-title {
          margin: .5em;
          font-size: 1em;
          font-weight: bolder;
          border-bottom: 1px solid grey;
        }

        .scroll {
          max-height: 85%;
          overflow: auto;
          padding: 1em;
          border: 1px solid grey;
        }

        @media (max-width: ${theme.breakPoints.tablet}) {
          .dialog {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  )
}

ValidationInfos.propTypes = {
  handleClose: PropTypes.func.isRequired
}

export default ValidationInfos
