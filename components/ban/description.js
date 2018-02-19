import Link from 'next/link'

import Section from '../section'

const Description = () => (
  <Section>
    <div className='prose'>
      <p>La Base Adresse Nationale est une base de données qui a pour but de référencer l’intégralité des adresses du territoire français.</p>
      <p>Elle est constituée par la collaboration entre:</p>
      <ul>
        <li>des acteurs nationaux tels que <a href='https://www.etalab.gouv.fr'>Etalab</a>, l’<a href='http://ign.fr/' title='Institut national de l’information géographique et forestière'>IGN</a>, la <a href='https://portail.dgfip.finances.gouv.fr' title='Direction générale des finances publiques'>DGFiP</a> et <a href='http://legroupe.laposte.fr/'>La Poste</a>,</li>
        <li>des acteurs locaux tels que les collectivités, les communes, les SDIS,</li>
        <li>des citoyens par exemple à travers le projet <a href='http://osm.org/'>OpenStreetMap</a> et l’association <a href='http://openstreetmap.fr/'>OpenStreetMap France</a>.</li>
      </ul>
      <p>Le projet est co-gouverné par <a href='http://www.modernisation.gouv.fr/laction-publique-se-transforme/en-ouvrant-les-donnees-publiques/administrateur-general-des-donnees-chief-data-officer-interview-henri-verdier'>l’Administrateur Général des Données</a> et le <a href='http://cnig.gouv.fr/'>Conseil National de l’Information Géographique</a>.</p>
    </div>
    <div className='prose'>
      <p><Link href='/faq'><a>Consultez la FAQ pour en savoir plus...</a></Link></p>
    </div>
    <style jsx>{`
      .prose {
        font-size: 1.1em;
      }

      .prose ul {
        list-style: circle;
      }
    `}</style>
  </Section>
)

export default Description
