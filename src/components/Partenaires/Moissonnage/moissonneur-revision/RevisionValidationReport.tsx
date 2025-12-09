'use client'

import { getLabel } from '@ban-team/validateur-bal'
import Link from 'next/link'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Badge from '@codegouvfr/react-dsfr/Badge'

import { ValidationMoissoneurType } from '@/types/api-moissonneur-bal.types'
import { getFileLink } from '@/lib/api-moissonneur-bal'

interface RevisionValidationReportProps {
  id: string
  fileId: string
  validation: ValidationMoissoneurType
}

export default function RevisionValidationReport({
  fileId,
  validation,
}: RevisionValidationReportProps) {
  return (
    <div>
      <div className="header" style={{ marginBottom: '1rem' }}>
        <p>
          Statut :{' '}
          {
            (validation.nbRowsWithErrors <= 0)
              ? (
                  <Badge severity="success">Valide</Badge>
                )
              : (
                  <Badge severity="error">Invalide</Badge>
                )
          }
        </p>
        <p>
          Nombre de lignes dans le fichier BAL : <b>{validation?.nbRows}</b>
        </p>
        <p>
          Nombre de lignes en erreurs : <b>{validation?.nbRowsWithErrors}</b>
        </p>
        <Link
          target="_blank"
          passHref
          href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/outils/validateur-bal?file=${getFileLink(fileId)}`}
        >
          Lien vers le validateur BAL
        </Link>
      </div>
      {validation.uniqueErrors.length > 0 && (
        <Alert
          severity="error"
          title={`Erreur(s) bloquante(s) : ${validation.uniqueErrors.length}`}
          description={(
            <ul>
              {validation?.uniqueErrors?.map((error, index) => (
                <li key={index}>{getLabel(error)}</li>
              ))}
            </ul>
          )}
        />
      )}
    </div>
  )
}
