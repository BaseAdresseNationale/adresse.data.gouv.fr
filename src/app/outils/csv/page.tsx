'use client'

import React, { useState } from 'react'
import Papa from 'papaparse'
import detectEncoding from '@/lib/detect-encoding'
import Section from '@/components/Section/Section'
import Geocoder from './components/geocoder'
import { TextWrapper } from './page.styles'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import Select from '@codegouvfr/react-dsfr/Select'
import Step from './components/step'
import ColumnsSelect from './components/columns-select'
import DropZoneInput from '@/components/DropZoneInput'
import Table from '@codegouvfr/react-dsfr/Table'

const allowedTypes = new Set([
  'text/plain',
  'text/csv',
  'text/x-csv',
  'application/vnd.ms-excel',
  'application/csv',
  'application/x-csv',
  'text/comma-separated-values',
  'text/x-comma-separated-value',
  'text/tab-separated-values',
])

const allowedExtensions = new Set([
  'csv',
  'tsv',
  'txt',
])

const MAX_SIZE = 50 * 1024 * 1024

function getFileExtension(fileName: string) {
  const dotPosition = fileName.lastIndexOf('.')
  if (dotPosition > 0 && dotPosition < fileName.length - 1) {
    return fileName.slice(dotPosition + 1).toLowerCase()
  }

  return null
}

export default function Csv() {
  const [file, setFile] = useState<File | null>(null)
  const [csv, setCsv] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [advancedPanel, setAdvancedPanel] = useState(false)
  const [filter, setFilter] = useState<string>('')
  const [value, setValue] = useState('')
  const [error, setError] = useState<Error | null>(null)

  const resetState = () => {
    setFile(null)
    setSelectedColumns([])
    setCsv(null)
  }

  const parseFile = async (file: File) => {
    setLoading(true)
    try {
      const encoding = await detectEncoding(file)
      Papa.parse(file, {
        skipEmptyLines: true,
        encoding,
        preview: 20,
        complete: (res: Record<string, any>) => {
          setCsv(res)
          setSelectedColumns([])
          setLoading(false)
          window.location.href = '#preview'
        },
        error: () => {
          setError(Error('Impossible de lire ce fichier.'))
          setLoading(false)
        },
      })
    }
    catch {
      setError(Error('Impossible de lire ce fichier.'))
      setLoading(false)
    }
  }

  const handleFileDrop = (file?: File) => {
    if (!file) {
      throw new Error('No file selected')
    }
    const fileExtension = getFileExtension(file.name)
    if (file.type && !allowedTypes.has(file.type)) {
      setError(Error(`Ce type de fichier n’est pas supporté : ${file.type}.`))
      resetState()
    }
    else if (fileExtension && !allowedExtensions.has(fileExtension)) {
      setError(Error(`Cette extension de fichier n’est pas supportée : ${fileExtension}.`))
      resetState()
    }
    else if (file.size === 0) {
      setError(Error('Ce fichier est vide.'))
      resetState()
    }
    else if (file.size > MAX_SIZE) {
      setError(Error('Ce fichier est trop volumineux.'))
      resetState()
    }
    else {
      setFile(file)
      setError(null)
      parseFile(file)
    }
  }

  const handleAddColumn = (column: string) => {
    setSelectedColumns([...selectedColumns, column])
  }

  const handleRemoveColumn = (column: string) => {
    setSelectedColumns(selectedColumns.filter(
      col => col !== column
    ))
  }

  const toggleAdvancedPanel = () => {
    setAdvancedPanel(!advancedPanel)
  }

  const handleFilter = (column: string) => {
    setFilter(column)
    setValue(column)
  }

  const columns = csv ? csv.data[0] : []

  return (
    <>
      <Section pageTitle="Géocoder un fichier CSV">
        <TextWrapper>
          <div id="main" className="csvtogeocoder">
            <div>
              <h2>1. Choisir un fichier</h2>
              <DropZoneInput
                onChange={handleFileDrop}
                label="Glisser un fichier ici, ou cliquez pour choisir"
                hint="Taille maximale: 50 Mo. Format accepté: CSV."
                maxSize={MAX_SIZE * 1024 * 1024}
              >
              </DropZoneInput>
              {file
              && (
                <div className="file-details">
                  <div className="file-infos">
                    <div className="name">Nom du fichier : {file.name}</div>
                    <div className="size">Taille : {((file.size / 10 ** 6) <= 1) ? (file.size) + ' octets' : (file.size / 10 ** 6) + ' Mo'}</div>
                  </div>
                </div>
              )}

              {error && <div className="error">{error.message}</div>}
            </div>

            <div>
              <div id="preview">
                <Step title="2. Aperçu du fichier et vérification de l’encodage">
                  {csv && <Table headers={csv.data[0]} data={csv.data.slice(1, 10)} />}
                </Step>
              </div>

              <Step title="3. Choisir les colonnes à utiliser pour construire les adresses">
                {csv && (
                  <ColumnsSelect
                    columns={csv.data[0]}
                    selectedColumns={selectedColumns}
                    onAdd={handleAddColumn}
                    onRemove={handleRemoveColumn}
                  />
                )}
              </Step>

              {csv && (
                <>
                  <div className="filters">
                    <Accordion label="Paramètres avancés" onExpandedChange={toggleAdvancedPanel} expanded={advancedPanel}>
                      {advancedPanel && (
                        <Select
                          label="Code INSEE"
                          nativeSelectProps={{
                            onChange: event => handleFilter(event.target.value),
                            value,
                          }}
                        >
                          (<option value="">Aucun</option>
                          {columns.map((value: string) => (<option value={value} key={value}>{value}</option>))})
                        </Select>
                      )}
                    </Accordion>
                  </div>
                  {file
                  && (
                    <Geocoder
                      // This key should be somehow unique: this means that we
                      // will get a new state in Geocoder whenever file changes.
                      key={`${file.name}-${file.size}`}
                      file={file}
                      columns={selectedColumns}
                      filter={filter === null ? undefined : filter}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </TextWrapper>
      </Section>
    </>

  )
}
