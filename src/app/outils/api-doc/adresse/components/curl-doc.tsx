'use client'
/* eslint no-irregular-whitespace: off */
import Link from 'next/link'
import Section from '@/components/Section'
import { Code, ApiEntryPoint } from './curl-doc.styles'

function CurlDoc() {
  return (
    <Section>
      <ApiEntryPoint id="search">
        <div className="description">
          <h2>/search/</h2>
          <p>Point d’entrée pour le géocodage.</p>
        </div>
        <div className="details">
          <p>Utiliser le paramètre <b>q</b> pour faire une recherche plein texte:</p>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&quot;</Code>
          <p>Avec <b>limit</b> on peut contrôler le nombre d’éléments retournés:</p>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&limit=15&quot;</Code>
          <p>Avec <b>autocomplete</b> on peut désactiver les traitements d’auto-complétion:</p>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&autocomplete=0&quot;</Code>
          <p>Avec <b>lat</b> et <b>lon</b> on peut donner une priorité géographique:</p>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&lat=48.789&lon=2.789&quot;</Code>
          <p>Les filtres <b>type</b>, <b>postcode</b> (code Postal) et <b>citycode</b> (code INSEE) permettent de restreindre la recherche:</p>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&postcode=44380&quot;</Code>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/search/?q=paris&type=street&quot;</Code>
          <p>Le retour est un geojson <i>FeatureCollection</i> respectant la spec <Link className="fr-link" href="https://github.com/yohanboniface/geocodejson-spec">GeoCodeJSON</Link>:</p>
          <Code>{`{
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
          </Code>
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
            <li><b>street</b> : nom de la voie</li>
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
      </ApiEntryPoint>
      <ApiEntryPoint id="reverse">
        <div className="description">
          <h2>/reverse/</h2>
          <p>Point d’entrée pour le géocodage inverse.</p>
        </div>
        <div className="details">
          <p>Les paramètres <b>lat</b> et <b>lon</b> sont obligatoires:</p>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/reverse/?lon=2.37&lat=48.357&quot;</Code>
          <p>Le paramètre <b>type</b> permet forcer le type de retour:</p>
          <Code>curl &quot;https://api-adresse.data.gouv.fr/reverse/?lon=2.37&lat=48.357&type=street&quot;</Code>
          <p>Même format de réponse que pour le point d’entrée <Link className="fr-link" href="#search"><b>/search/</b></Link>.</p>
        </div>
      </ApiEntryPoint>
      <ApiEntryPoint id="csv-search">

        <div className="description">
          <h2>/search/csv/</h2>
          <p>Point d’entrée pour le géocodage de masse à partir d’un fichier CSV.</p>
        </div>
        <div className="details">
          <p>Le fichier CSV, dont la taille ne doit pas excéder 50 Mo, doit être passé via le paramètre <b>data</b>. Veuillez noter l’arobase après <b>data=</b>.</p>
          <Code>curl -X POST -F data=@path/to/file.csv https://api-adresse.data.gouv.fr/search/csv/</Code>
          <p>Par défaut, toutes les colonnes sont concaténées pour constituer l’adresse qui sera géocodée. On peut définir les colonnes à utiliser via de multiples paramètres <b>columns</b>:</p>
          <Code>curl -X POST -F data=@path/to/file.csv -F columns=voie -F columns=ville https://api-adresse.data.gouv.fr/search/csv/</Code>
          <p>Il est possible de préciser le nom d’une colonne contenant le <b>code INSEE</b> ou le <b>code Postal</b> pour limiter les recherches, exemple :</p>
          <Code>curl -X POST -F data=@path/to/file.csv -F columns=voie -F columns=ville -F citycode=ma_colonne_code_insee https://api-adresse.data.gouv.fr/search/csv/</Code>
          <Code>curl -X POST -F data=@path/to/file.csv -F columns=voie -F columns=ville -F postcode=colonne_code_postal https://api-adresse.data.gouv.fr/search/csv/</Code>
          <p>On peut utiliser le fichier <Link className="fr-link" href="https://adresse.data.gouv.fr/exemples/search.csv">https://adresse.data.gouv.fr/exemples/search.csv</Link> comme exemple.</p>
          <Code>curl -X POST -F data=@search.csv -F columns=adresse -F columns=postcode https://api-adresse.data.gouv.fr/search/csv/</Code>
          <p>Enfin, en cas d’industrialisation du géocodage, il peut être pertinent de lister spécifiquement les champs attendus dans la réponse, pour limiter la taille du fichier obtenu, et donc accélérer le transfert et réduire l’empreinte carbone.</p>
          <p>Les champs disponibles sont :</p>
          <ul>
            <li><b>latitude</b></li>
            <li><b>longitude</b></li>
            <li><b>result_label</b></li>
            <li><b>result_score</b></li>
            <li><b>result_score_next</b></li>
            <li><b>result_type</b></li>
            <li><b>result_id</b></li>
            <li><b>result_housenumber</b></li>
            <li><b>result_name</b></li>
            <li><b>result_street</b></li>
            <li><b>result_postcode</b></li>
            <li><b>result_city</b></li>
            <li><b>result_context</b></li>
            <li><b>result_citycode</b></li>
            <li><b>result_oldcitycode</b></li>
            <li><b>result_oldcity</b></li>
            <li><b>result_district</b></li>
            <li><b>result_status</b></li>
          </ul>
          <Code>curl -X POST -F data=@search.csv -F columns=adresse -F columns=postcode -F result_columns=result_id -F result_columns=result_score https://api-adresse.data.gouv.fr/search/csv/</Code>
          <p>Cette requête donne le résultat suivant :</p>
          <Code>{`nom,adresse,postcode,city,result_id,result_score
École Claude Déruet,6 Rue Albert 1er,54600,Villers-lès-Nancy,54578_0040_00006,0.9625427272727272
École Gilberte Monne,6 Rue d'Aquitaine,54500,Vandœuvre-lès-Nancy,54547_0058_00006,0.9631954545454544
École maternelle Victor Hugo,31 Rue d'Arbois,54180,Heillecourt,54257_0008_00031,0.961191818181818
École maternelle Buffon,1 bis Rue de la Papeterie,54250,Champigneulles,54115_0109_00001_bis,0.8623961876832844`}
          </Code>

        </div>
      </ApiEntryPoint>
      <ApiEntryPoint id="csv-reverse">
        <div className="description">
          <h2>/reverse/csv/</h2>
          <p>Point d’entrée pour le géocodage inverse de masse à partir d’un fichier CSV.</p>
        </div>
        <div className="details">
          <p>Le fichier CSV, encodé en UTF-8 et limité actuellement à 6 Mo, doit être passé via le paramètre <b>data</b>. Il doit contenir les colonnes <b>latitude</b> (ou <em>lat</em>) et <b>longitude</b> (ou <em>lon</em> ou <em>lng</em>).</p>
          <Code>curl -X POST -F data=@path/to/file.csv https://api-adresse.data.gouv.fr/reverse/csv/</Code>
          <p>On peut utiliser le fichier <Link className="fr-link" href="https://adresse.data.gouv.fr/exemples/reverse.csv">https://adresse.data.gouv.fr/exemples/reverse.csv</Link> comme exemple.</p>
        </div>
      </ApiEntryPoint>
    </Section>
  )
}

export default CurlDoc
