'use client'

import React, { useState } from 'react'
import Papa from 'papaparse'
import detectEncoding from '@/lib/detect-encoding'

import Section from '@/components/Section/Section'
import Button from '@codegouvfr/react-dsfr/Button'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Step from './components/step'
import ColumnsSelect from './components/columns-select'
import Filter from './components/filter'
import Holder from './components/holder'
import Table from './components/table'
import Geocoder from './components/geocoder'
import Loader from '@/components/Loader/index'
import { TextWrapper } from './page.styles'

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

  const handleFileDrop = (fileList: File[]) => {
    const file = fileList[0]
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
    setFilter('')
    setAdvancedPanel(!advancedPanel)
  }

  const handleFilter = (column: string) => {
    setFilter(column)
  }

  const columns = csv ? csv.data[0] : []
  return (
    <>
      {/* <Breadcrumb
        currentPageLabel="Géocodeur"
        segments={[
          {
            label: 'Outils & APIs',
            linkProps: {
              href: '/outils',
            },
          },
        ]}
      /> */}
      <Section pageTitle="Géocoder un fichier CSV">
        <TextWrapper>
          <div id="main" className="csvtogeocoder">
            <div>
              <h2>1. Choisir un fichier</h2>

              <Holder
                file={file}
                placeholder={`Glissez un fichier ici (max ${MAX_SIZE / (1024 * 1024)} Mo), ou cliquez pour choisir`}
                isLoading={loading}
                onDrop={handleFileDrop}
              />

              {loading && (
                <div className="loading">
                  <h4>Analyse du fichier en cours…</h4>
                  <Loader />
                </div>
              )}

              {error && <div className="error">{error.message}</div>}
            </div>

            <div>
              <div id="preview">
                <Step title="2. Aperçu du fichier et vérification de l’encodage">
                  {csv && <Table headers={csv.data[0]} rows={csv.data.slice(1, 10)} />}
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
                    <Button onClick={toggleAdvancedPanel} style={{ fontSize: '1em', padding: '0.4em 1em' }}>
                      {advancedPanel ? <p>Minus Icon - </p> : <p>Plus Icon </p>} Paramètres avancés
                    </Button>

                    {advancedPanel && (
                      <Filter
                        selected={filter}
                        columns={columns}
                        onSelect={handleFilter}
                      />
                    )}
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
