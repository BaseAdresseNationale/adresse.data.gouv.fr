import React from 'react'
import Papa from 'papaparse'

import detectEncoding from '../../lib/detect-encoding'

import Section from '../section'

import Step from './step'
import ColumnsSelect from './columns-select'
import CodeInsee from './code-insee'
import Holder from './holder'
import Table from './table'
import Geocoder from './geocoder'

const allowedTypes = [
  'text/plain',
  'text/csv',
  'text/x-csv',
  'application/vnd.ms-excel',
  'application/csv',
  'application/x-csv',
  'text/comma-separated-values',
  'text/x-comma-separated-value',
  'text/tab-separated-values'
]

const allowedExtensions = [
  'csv',
  'tsv',
  'txt'
]

const MAX_SIZE = '6000000'

function getFileExtension(fileName) {
  const dotPosition = fileName.lastIndexOf('.')
  if (dotPosition > 0 && dotPosition < fileName.length - 1) {
    return fileName.substr(dotPosition + 1).toLowerCase()
  }
  return null
}

class Csv extends React.Component {
  constructor() {
    super()
    this.state = {
      file: null,
      csv: null,
      columns: [],
      codeInsee: null,
      error: null,
      encoding: null
    }

    this.handleFileDrop = this.handleFileDrop.bind(this)
    this.parseFile = this.parseFile.bind(this)
    this.handleAddColumn = this.handleAddColumn.bind(this)
    this.handleRemoveColumn = this.handleRemoveColumn.bind(this)
    this.handleCodeInsee = this.handleCodeInsee.bind(this)
  }

  resetState() {
    this.setState({
      file: null,
      columns: [],
      csv: null,
      encoding: null
    })
  }

  parseFile(file) {
    detectEncoding(file)
      .then(({encoding}) => {
        this.setState({encoding})
        Papa.parse(file, {
          skipEmptyLines: true,
          encoding,
          preview: 20,
          complete: res => {
            this.setState({csv: res, columns: []})
            window.location.href = '#preview'
          },
          error: () => this.setState({error: 'Impossible de lire ce fichier.'})
        })
      })
      .catch(() => this.setState({error: 'Impossible de lire ce fichier.'}))
  }

  handleFileDrop(fileList) {
    const file = fileList[0]
    const fileExtension = getFileExtension(file.name)
    if (file.type && !allowedTypes.includes(file.type)) {
      this.setState({
        error: `Ce type de fichier n’est pas supporté : ${file.type}.`
      }, this.resetState())
    } else if (fileExtension && !allowedExtensions.includes(fileExtension)) {
      this.setState({
        error: `Cette extension de fichier n’est pas supportée : ${fileExtension}.`
      }, this.resetState())
    } else if (file.size > MAX_SIZE) {
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

  handleAddColumn(column) {
    const columns = [...this.state.columns]
    columns.push(column)
    this.setState({columns})
  }

  handleRemoveColumn(column) {
    const columns = [...this.state.columns.filter(col => col !== column)]
    this.setState({columns})
  }

  handleCodeInsee(column) {
    this.setState({codeInsee: column})
  }

  render() {
    const {file, csv, columns, codeInsee, error, encoding} = this.state

    return (
      <Section>
        <div id='main' className='csvtogeocoder'>
          <div>
            <h2>1. Choisir un fichier</h2>
            <Holder file={file} placeholder={`Glissez un fichier ici (max ${MAX_SIZE / 1000000} Mo), ou cliquez pour choisir`} onDrop={this.handleFileDrop} />
            {error && <div className='error'>{error}</div>}
          </div>

          <div>
            <div id='preview'>
              <Step title='2. Aperçu du fichier et vérification de l’encodage'>
                {csv && <Table headers={csv.data[0]} rows={csv.data.slice(1, 10)} />}
              </Step>
            </div>

            <Step title='3. Choisir les colonnes à utiliser pour construire les adresses'>
              {csv && <ColumnsSelect
                columns={csv.data[0]}
                selectedColumns={columns}
                onAdd={this.handleAddColumn}
                onRemove={this.handleRemoveColumn} />}
            </Step>

            <Step title='4. Choisir la colonne correspondand au code INSEE'>
              {columns.length > 0 &&
                <CodeInsee
                  selected={codeInsee}
                  columns={columns}
                  onSelect={this.handleCodeInsee} />}
            </Step>

            <Step title=''>
              {columns.length > 0 &&
                <Geocoder
                  file={file}
                  encoding={encoding}
                  columns={columns}
                  codeInsee={codeInsee} />}
            </Step>
          </div>
        </div>

        <style jsx>{`
          .error {
            color: red;
          }
        `}</style>
      </Section>
    )
  }
}

export default Csv
