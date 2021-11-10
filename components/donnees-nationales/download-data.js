import Card from '../card'

function DownloadData() {
  return (
    <div className='card-container'>
      <Card
        title='Format CSV'
        href='https://adresse.data.gouv.fr/data/ban/adresses/latest/csv'
        list={['1 position par adresse']}
        links={[{title: 'Schéma des données', href: 'https://github.com/etalab/adresse.data.gouv.fr/blob/master/public/schemas/adresses-csv.md'}]}
      >
        Fichier d’usage général recommandé dans la majorité des cas
      </Card>

      <Card
        title='Format Addok'
        href='https://adresse.data.gouv.fr/data/ban/adresses/latest/addok'
        list={['1 position par adresse']}
      >
        Fichier spécifique pour le géocodeur Addok
      </Card>

      <Card
        title='Format JSON expert'
        list={['Plusieurs positions par adresse', 'Plusieurs sources par adresse']}
      >
        Fichier contenant l’intégralité des données et métadonnées contenues dans la plateforme
      </Card>

      <style jsx>{`
        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
      `}</style>
    </div>
  )
}

export default DownloadData
