import React, {useState} from 'react'
import TableList from '../components/table-list'

const fruits = [
  {name: 'pomme', color: 'vert', size: 'small'},
  {name: 'pomme', color: 'jaune', size: 'medium'},
  {name: 'banane', color: 'jaune', size: 'small'},
  {name: 'orange', color: 'orange', size: 'medium'},
  {name: 'fraise', color: 'rouge', size: 'big'}
]

const cols = {
  name: {
    title: 'Nom du fruit',
    getValue: fruit => fruit.name,
    sortBy: 'alphabetical'
  },
  color: {
    title: 'Couleur du fruit',
    getValue: fruit => fruit.color,
    sortBy: 'alphabetical'
  },
  size: {
    title: 'Taille du fruit',
    getValue: fruit => fruit.size,
    sortBy: 'alphabetical'
  }
}

const Table = () => {
  const [selectedFruit, setSelectedFruit] = useState(null)

  return (
    <div>
      <TableList
        title='Tableau de fruit'
        subtitle={`Nombre de fruits ${fruits.length}`}
        list={fruits}
        textFilter={item => item.name}
        filters={{color: 'Couleur', size: 'Taille'}}
        cols={cols}
        selected={selectedFruit}
        handleSelect={setSelectedFruit}
      />
      {selectedFruit && (
        <div>
         Fruit : {selectedFruit.size} { selectedFruit.name } {selectedFruit.color}
        </div>
      )}
    </div>
  )
}

export default Table
