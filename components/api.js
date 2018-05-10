/* eslint react/no-unescaped-entities: off */
import theme from '../styles/theme'

import Section from './section'

const Api = () => (
  <Section>
    <p>Pour plus de clarté, les exemples de commande utilisent le package <a href='https://pypi.python.org/pypi/httpie'>httpie</a>.</p>

    <div className='entrypoint' id='search'>
      <div className='row'>
        <div className='description'>
          <h2>/search/</h2>
          <p>Point d’entrée pour le géocodage.</p>
        </div>
        <div className='details'>
          <p>Utiliser le paramètre <b>q</b> pour faire une recherche plein texte:</p>
          <pre><code>http 'https://api-adresse.data.gouv.fr/search/?q=8 bd du port'</code></pre>
          <p>Avec <b>limit</b> on peut contrôler le nombre d’éléments retournés:</p>
          <pre><code>http 'https://api-adresse.data.gouv.fr/search/?q=8 bd du port&amp;limit=15'</code></pre>
          <p>Avec <b>autocomplete</b> on peut désactiver les traitements d’auto-complétion:</p>
          <pre><code>http 'https://api-adresse.data.gouv.fr/search/?q=8 bd du port&amp;autocomplete=0'</code></pre>
          <p>Avec <b>lat</b> et <b>lon</b> on peut donner une priorité géographique:</p>
          <pre><code>http 'https://api-adresse.data.gouv.fr/search/?q=8 bd du port&amp;lat=48.789&amp;lon=2.789'</code></pre>
          <p>Les filtres <b>type</b>, <b>postcode</b> (code Postal) et <b>citycode</b> (code INSEE) permettent de restreindre la recherche:</p>
          <pre><code>http 'https://api-adresse.data.gouv.fr/search/?q=8 bd du port&amp;postcode=44380'</code></pre>
          <pre><code>http 'https://api-adresse.data.gouv.fr/search/?q=paris&amp;type=street'</code></pre>
          <p>Le retour est un geojson <i>FeatureCollection</i> respectant la spec <a href='https://github.com/yohanboniface/geocodejson-spec'>GeoCodeJSON</a>:</p>
          <pre><code>{`
          	'attribution': 'BAN',
          	'licence': 'ODbL 1.0',
          	'query': '8 bd du port',
          	'type': 'FeatureCollection',
          	'version': 'draft',
          	'features': [
          		{
          			'properties':
          			{
          				'context': '80, Somme, Picardie',
          				'housenumber': '8',
          				'label': '8 Boulevard du Port 80000 Amiens',
          				'postcode': '80000',
          				'citycode': '80021',
          				'id': 'ADRNIVX_0000000260875032',
          				'score': 0.3351181818181818,
          				'name': '8 Boulevard du Port',
          				'city': 'Amiens',
          				'type': 'housenumber'
          			},
          			'geometry':
          			{
          				'type': 'Point',
          				'coordinates': [2.29009, 49.897446]
          			},
          			'type': 'Feature'
          		},
          		{
          			'properties':
          			{
          				'context': '34, H\u00e9rault, Languedoc-Roussillon',
          				'housenumber': '8',
          				'label': '8 Boulevard du Port 34140 M\u00e8ze',
          				'postcode': '34140',
          				'citycode': '34157',
          				'id': 'ADRNIVX_0000000284423783',
          				'score': 0.3287575757575757,
          				'name': '8 Boulevard du Port',
          				'city': 'M\u00e8ze',
          				'type': 'housenumber'
          			},
          			'geometry':
          			{
          				'type': 'Point',
          				'coordinates': [3.605875, 43.425232]
          			},
          			'type': 'Feature'
          		}
          	]
          `}</code></pre>
          <p>Les attributs retournés sont&nbsp;:</p>
          <ul>
            <li><em>id</em>&nbsp;: identifiant de l’adresse (non stable: actuellement identifiant IGN)</li>
            <li><em>type</em>&nbsp;: type de résultat trouvé</li>
            <ul>
              <li><em>housenumber</em>&nbsp;: numéro "à la plaque"</li>
              <li><em>street</em>&nbsp;: position "à la voie", placé approximativement au centre de celle-ci</li>
              <li><em>locality</em>&nbsp;: lieu-dit</li>
              <li><em>municipality</em>&nbsp;: numéro "à la commune"</li>
            </ul>
            <li><em>score</em>&nbsp;: valeur de 0 à 1 indiquant la pertinence du résultat</li>
            <li><em>housenumber</em>&nbsp;: numéro avec indice de répétition éventuel (bis, ter, A, B)</li>
            <li><em>name</em>&nbsp;: numéro éventuel et nom de voie ou lieu dit</li>
            <li><em>postcode</em>&nbsp;: code postal</li>
            <li><em>citycode</em>&nbsp;: code INSEE de la commune</li>
            <li><em>city</em>&nbsp;: nom de la commune</li>
            <li><em>context</em>&nbsp;: n° de département, nom de département et de région</li>
            <li><em>label</em>&nbsp;: libellé complet de l’adresse</li>
          </ul>
        </div>
      </div>
    </div>
    <div className='entrypoint' id='reverse'>
      <div className='row'>
        <div className='description'>
          <h2>/reverse/</h2>
          <p>Point d’entrée pour le géocodage inverse.</p>
        </div>
        <div className='details'>
          <p>Les paramètres <b>lat</b> et <b>lon</b> sont obligatoires:</p>
          <pre><code>http 'https://api-adresse.data.gouv.fr/reverse/?lon=2.37&amp;lat=48.357'</code></pre>
          <p>Le paramètre <b>type</b> permet forcer le type de retour:</p>
          <pre><code>http 'https://api-adresse.data.gouv.fr/reverse/?lon=2.37&amp;lat=48.357&amp;type=street'</code></pre>
          <p>Même format de réponse que pour le point d’entrée <a href='#search'><b>/search/</b></a>.</p>
        </div>
      </div>
    </div>
    <div className='entrypoint' id='csv'>
      <div className='row'>
        <div className='description'>
          <h2>/search/csv/</h2>
          <p>Point d’entrée pour le géocodage de masse à partir d’un fichier CSV.</p>
        </div>
        <div className='details'>
          <p>Le fichier csv, encodé en UTF-8 et limité actuellement à 8Mo, doit être passé via le paramètre <b>data</b>:</p>
          <pre><code>http --timeout 600 -f POST https://api-adresse.data.gouv.fr/search/csv/ data@path/to/file.csv</code></pre>
          <p>Par défaut, toutes les colonnes sont concaténées pour constituer l’adresse qui sera géocodée. On peut définir les colonnes à utiliser via de multiples paramètres <b>columns</b>:</p>
          <pre><code>http -f POST https://api-adresse.data.gouv.fr/search/csv/ columns='voie' columns='ville' data@path/to/file.csv</code></pre>
          <p>Il est possible de préciser le nom d’une colonne contenant le code INSEE ou le code Postal pour limiter les recherches, exemple :</p>
          <pre><code>http -f POST https://api-adresse.data.gouv.fr/search/csv/ columns='voie' columns='ville' citycode='ma_colonne_code_insee' data@path/to/file.csv</code></pre>
          <pre><code>http -f POST https://api-adresse.data.gouv.fr/search/csv/ columns='voie' columns='ville' postcode='colonne_code_postal’ data@path/to/file.csv</code></pre>
        </div>
      </div>
    </div>
    <div className='entrypoint' id='csv'>
      <div className='row'>
        <div className='description'>
          <h2>/reverse/csv/</h2>
          <p>Point d’entrée pour le géocodage inverse de masse à partir d’un fichier CSV.</p>
        </div>
        <div className='details'>
          <p>Le fichier csv, encodé en UTF-8 et limité actuellement à 8Mo, doit être passé via le paramètre <b>data</b>. Il doit contenir les colonnes <b>latitude</b> (ou <em>lat</em>) et <b>longitude</b> (ou <em>lon</em> ou <em>lng</em>).</p>
          <pre><code>http --timeout 600 -f POST https://api-adresse.data.gouv.fr/reverse/csv/ data@path/to/file.csv</code></pre>
        </div>
      </div>
    </div>

    <style jsx>{`
      .entrypoint + .entrypoint {
        border-top: 1px solid ${theme.borderLighter};
      }

      .row {
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        padding: 40px 0;
      }

      .details {
        background-color: ${theme.colors.darkGrey};
        color: ${theme.colors.white};
        padding: 40px;
        border: 1px solid ${theme.borderLighter};
        border-radius: ${theme.borderRadius};
        box-shadow: 0 1px 4px 0 ${theme.boxShadow};
        width: 100%;
      }

      .details code {
        color: ${theme.darkText};
      }

      .prose {
        font-size: 1.1em;
      }

      .prose ul {
        list-style: circle;
      }

      @media (min-width: 900px) {
        .row {
          flex-flow: row;
        }

        .details {
          width: 70%;
        }

        .description {
          width: 25%;
        }
      }
      `}</style>
  </Section>
)

export default Api
