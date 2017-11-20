import React from 'react'
import Papa from 'papaparse'

import theme from '../../styles/theme'

import Section from '../section'
import Head from '../head'

import ColumnsSelect from './columns-select'
import Holder from './holder'
import Table from './table'
import Geocoder from './geocoder'

class Csv extends React.Component {
  constructor() {
    super()
    this.state = {
      file: null,
      csv: null,
      columns: [],
      error: null
    }
  }

  resetState() {
    this.setState({
      file: null,
      columns: [],
      csv: null
    })
  }

  parseFile(file) {
    Papa.parse(file, {
      complete: res => {
        this.setState({csv: res, columns: []})
        window.location.href = '#preview'
      }
    })
  }

  onDrop(fileList) {
    const file = fileList[0]
    if (file.type !== 'text/csv') {
      this.setState({
        error: 'Ce fichier n’est pas un fichier csv.'
      }, this.resetState())
    } else if (file.size > 6000000) {
      this.setState({
        error: 'Ce fichier est trop volumineux.'
      }, this.resetState())
    } else {
      this.setState({
        file,
        error: null
      }, this.parseFile(file))
    }
  }

  addColumn(column) {
    const columns = [...this.state.columns]
    columns.push(column)
    this.setState({columns})
  }

  removeColumn(column) {
    const columns = [...this.state.columns.filter(col => col !== column)]
    this.setState({columns})
  }

  render() {
    const {file, csv, columns, error} = this.state

    return (
      <div>
        <Head title='Géocoder un fichier CSV' icon='/static/images/icons/csv.svg'>
          <p><strong>adresse.data.gouv.fr</strong> met en place des outils pour une prise en main rapide des données adresses ouvertes.</p>
        </Head>
        <Section>
          <div id='main' className='csvtogeocoder'>
            <div>
              <h2>1. Choisir un fichier</h2>
              <Holder file={file} handleDrop={fileList => this.onDrop(fileList)} />
              {error && <div className='error'>{error}</div>}
            </div>
            {csv ? (
              <div>
                <div id='preview'>
                  <h2>2. Aperçu du fichier et vérification de l’encodage</h2>
                  <Table headers={csv.data[0]} rows={csv.data.slice(1, 10)} />
                </div>
                <div>
                  <h2>3. Choisir les colonnes à utiliser pour construire les adresses</h2>
                  <ColumnsSelect
                    columns={csv.data[0]}
                    selectedColumns={columns}
                    onAdd={column => this.addColumn(column)}
                    onRemove={column => this.removeColumn(column)} />
                </div>
                <Geocoder file={file} columns={columns} />
              </div>
            ) : (
              <div className='disabled'>
                <h2>2. Aperçu du fichier et vérification de l’encodage</h2>
                <h2>3. Choisir les colonnes à utiliser pour construire les adresses</h2>
              </div>
            )
          }
          </div>
        </Section>
        <style jsx>{`
          .disabled {
            color: ${theme.colors.lightGrey}
          }

          .error {
            color: red;
          }
          `}</style>
      </div>
    )
  }
}

export default Csv
