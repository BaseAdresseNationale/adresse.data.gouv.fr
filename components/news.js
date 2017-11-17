import Section from './section'
import Head from './head'

const News = () => (
  <div>
    <Head title='Actualités' icon='/static/images/icons/news.svg'>
      <div>
        <p>Les événements, actualités autour des données et des services liés à l’Adresse.</p>
      </div>
    </Head>
    <Section>
      <div>
        <h2>Les dernières informations</h2>
        <h3>1er janvier 2017 : 443 millions de requêtes en 2016</h3>
        <p>Au cours de l’année 2016, le service de géocodage <em>adresse.data.gouv.fr</em> a été utilisé <strong>443 millions de fois</strong>.<br />
         La taux de disponibilité du service a été de <strong>99,9998%</strong> (11 minutes d’indisponibilité sur l’année).</p>

        <h3>15 avril 2016: première bougie pour adresse.data.gouv.fr</h3>
        <p>Un an et plus de 200 millions de requêtes traitées par l’API de géocodage depuis son ouverture !</p>

        <h3>1er janvier 2016: 47 millions de géocodages !</h3>
        <p>Depuis l’ouverture de ce site mi-avril 2015 et de l’API de géocodage, ce sont plus de 47 millions d’adresses qui ont été géocodées !</p>

        <h3>QBAN(O): Un plugin BAN pour géocoder vos données depuis QGis</h3>
        <p><a href='https://plugins.qgis.org/plugins/QBano/'>QBAN(O)</a> permet de géolocaliser vos adresses issues d’un fichier excel ou CSV.<br />
         Il se sert de la BAN (Base Adresse Nationale) mais peut être utilisé avec la BANO (Base Adresse Nationale Ouverte).</p>

        <h3>15 avril 2015 : Lancement officiel de la Base Adresse Nationale</h3>
        <iframe frameBorder='0' width='480' height='270' src='//www.dailymotion.com/embed/video/x2nab4x' allowFullScreen /><br /><a href='http://www.dailymotion.com/video/x2nab4x_lancement-de-la-base-adresse-nationale-collaborative-mercredi-15-avril-2015_tech' target='_blank' rel='noopener noreferrer'>Lancement de la Base Adresse Nationale…</a> <i>par <a href='http://www.dailymotion.com/SGMAP' target='_blank' rel='noopener noreferrer'>SGMAP</a></i>
      </div>
    </Section>
  </div>
)

export default News
