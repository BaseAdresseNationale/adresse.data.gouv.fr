import React from 'react'
import Section from '../section'

import theme from '../../styles/theme'

function CurlDoc() {
  return (
    <Section>
      <div className='entrypoint' id='search'>
        <div className='row'>
          <div className='description'>
            <h2>/search/</h2>
            <p>Point d’entrée pour le géocodage.</p>
          </div>
          <div className='details'>
            <p>Utiliser le paramètre <b>q</b> pour faire une recherche plein texte:</p>
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&quot;</code></pre>
            <p>Avec <b>limit</b> on peut contrôler le nombre d’éléments retournés:</p>
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&limit=15&quot;</code></pre>
            <p>Avec <b>autocomplete</b> on peut désactiver les traitements d’auto-complétion:</p>
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&autocomplete=0&quot;</code></pre>
            <p>Avec <b>lat</b> et <b>lon</b> on peut donner une priorité géographique:</p>
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&lat=48.789&lon=2.789&quot;</code></pre>
            <p>Les filtres <b>type</b>, <b>postcode</b> (code Postal) et <b>citycode</b> (code INSEE) permettent de restreindre la recherche:</p>
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&postcode=44380&quot;</code></pre>
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=paris&type=street&quot;</code></pre>
            <p>Le retour est un geojson <i>FeatureCollection</i> respectant la spec <a href='https://github.com/yohanboniface/geocodejson-spec'>GeoCodeJSON</a>:</p>
            <pre>
              <code>{`{
     "type":"FeatureCollection",
     "version":"draft",
     "features":[
        {
           "type":"Feature",
           "geometry":{
              "type":"Point",
              "coordinates":[
                 2.290084,
                 49.897443
              ]
           },
           "properties":{
              "label":"8 Boulevard du Port 80000 Amiens",
              "score":0.49159121588068583,
              "housenumber":"8",
              "id":"80021_6590_00008",
              "type":"housenumber",
              "name":"8 Boulevard du Port",
              "postcode":"80000",
              "citycode":"80021",
              "x":648952.58,
              "y":6977867.25,
              "city":"Amiens",
              "context":"80, Somme, Hauts-de-France",
              "importance":0.6706612694243868,
              "street":"Boulevard du Port"
           }
        }
     ],
     "attribution":"BAN",
     "licence":"ODbL 1.0",
     "query":"8 bd du port",
     "limit":1
  }`}
              </code>
            </pre>
            <p>Les coordonnées GeoJSON sont exprimées en WGS-84 (EPSG 4326)</p>
            <p>Les attributs retournés sont :</p>
            <ul>
              <li><b>id</b> : identifiant de l’adresse (clef d’interopérabilité)</li>
              <li><b>type</b> : type de résultat trouvé</li>
              <ul>
                <li><b>housenumber</b> : numéro « à la plaque »</li>
                <li><b>street</b> : position « à la voie », placé approximativement au centre de celle-ci</li>
                <li><b>locality</b> : lieu-dit</li>
                <li><b>municipality</b> : numéro « à la commune »</li>
              </ul>
              <li><b>score</b> : valeur de 0 à 1 indiquant la pertinence du résultat</li>
              <li><b>housenumber</b> : numéro avec indice de répétition éventuel (bis, ter, A, B)</li>
              <li><b>name</b> : numéro éventuel et nom de voie ou lieu dit</li>
              <li><b>postcode</b> : code postal</li>
              <li><b>citycode</b> : code INSEE de la commune</li>
              <li><b>city</b> : nom de la commune</li>
              <li><b>district</b> : nom de l’arrondissement (Paris/Lyon/Marseille)</li>
              <li><b>oldcitycode</b> : code INSEE de la commune ancienne (le cas échéant)</li>
              <li><b>oldcity</b> : nom de la commune ancienne (le cas échéant)</li>
              <li><b>context</b> : n° de département, nom de département et de région</li>
              <li><b>label</b> : libellé complet de l’adresse</li>
              <li><b>x</b> : coordonnées géographique en projection légale</li>
              <li><b>y</b> : coordonnées géographique en projection légale</li>
              <li><b>importance</b> : indicateur d’importance (champ technique)</li>
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
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/reverse/?lon=2.37&lat=48.357&quot;</code></pre>
            <p>Le paramètre <b>type</b> permet forcer le type de retour:</p>
            <pre><code>curl &quot;https://api-adresse.data.gouv.fr/reverse/?lon=2.37&lat=48.357&type=street&quot;</code></pre>
            <p>Même format de réponse que pour le point d’entrée <a href='#search'><b>/search/</b></a>.</p>
          </div>
        </div>
      </div>
      <div className='entrypoint' id='csv-search'>
        <div className='row'>
          <div className='description'>
            <h2>/search/csv/</h2>
            <p>Point d’entrée pour le géocodage de masse à partir d’un fichier CSV.</p>
          </div>
          <div className='details'>
            <p>Le fichier CSV, dont la taille ne doit pas excéder 50 Mo, doit être passé via le paramètre <b>data</b>. Veuillez noter l’arobase après <b>data=</b>.</p>
            <pre><code>curl -X POST -F data=@path/to/file.csv https://api-adresse.data.gouv.fr/search/csv/</code></pre>
            <p>Par défaut, toutes les colonnes sont concaténées pour constituer l’adresse qui sera géocodée. On peut définir les colonnes à utiliser via de multiples paramètres <b>columns</b>:</p>
            <pre><code>curl -X POST -F data=@path/to/file.csv -F columns=voie -F columns=ville https://api-adresse.data.gouv.fr/search/csv/</code></pre>
            <p>Il est possible de préciser le nom d’une colonne contenant le <b>code INSEE</b> ou le <b>code Postal</b> pour limiter les recherches, exemple :</p>
            <pre><code>curl -X POST -F data=@path/to/file.csv -F columns=voie -F columns=ville -F citycode=ma_colonne_code_insee https://api-adresse.data.gouv.fr/search/csv/</code></pre>
            <pre><code>curl -X POST -F data=@path/to/file.csv -F columns=voie -F columns=ville -F postcode=colonne_code_postal https://api-adresse.data.gouv.fr/search/csv/</code></pre>
            <p>On peut utiliser le fichier <a href='https://adresse.data.gouv.fr/exemples/search.csv'>https://adresse.data.gouv.fr/exemples/search.csv</a> comme exemple.</p>
            <pre><code>curl -X POST -F data=@search.csv -F columns=adresse -F columns=postcode https://api-adresse.data.gouv.fr/search/csv/</code></pre>
            <p>Enfin, en cas d’industrialisation du géocodage, il peut être pertinent de lister spécifiquement les champs attendus dans la réponse, pour limiter la taille du fichier obtenu, et donc accélérer le transfert et réduire l’empreinte carbone.</p>
            <pre><code>curl -X POST -F data=@search.csv -F columns=adresse -F columns=postcode -F result_columns=result_id -F result_columns=score https://api-adresse.data.gouv.fr/search/csv/</code></pre>
          </div>
        </div>
      </div>
      <div className='entrypoint' id='csv-reverse'>
        <div className='row'>
          <div className='description'>
            <h2>/reverse/csv/</h2>
            <p>Point d’entrée pour le géocodage inverse de masse à partir d’un fichier CSV.</p>
          </div>
          <div className='details'>
            <p>Le fichier CSV, encodé en UTF-8 et limité actuellement à 6 Mo, doit être passé via le paramètre <b>data</b>. Il doit contenir les colonnes <b>latitude</b> (ou <em>lat</em>) et <b>longitude</b> (ou <em>lon</em> ou <em>lng</em>).</p>
            <pre><code>curl -X POST -F data=@path/to/file.csv https://api-adresse.data.gouv.fr/reverse/csv/</code></pre>
            <p>On peut utiliser le fichier <a href='https://adresse.data.gouv.fr/exemples/reverse.csv'>https://adresse.data.gouv.fr/exemples/reverse.csv</a> comme exemple.</p>
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
            background-color: ${theme.colors.almostBlack};
            color: ${theme.colors.white};
            padding: 40px;
            border: 1px solid ${theme.darkGrey};
            border-radius: ${theme.borderRadius};
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
            width: 100%;
          }
  
          a {
            color: ${theme.colors.lightBlue};
          }
  
          .details code {
            color: ${theme.darkText};
            width: 100%;
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
}

export default CurlDoc
