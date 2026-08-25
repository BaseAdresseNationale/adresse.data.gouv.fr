'use client'

import React, { useEffect, useState } from 'react'
import Loader from '@/components/Loader'


interface MonthCount {
  month: string
  count: number
}

interface CertificateStats {
  total: number
  byMonth: MonthCount[]
}

const MONTH_LABELS = ['Total', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

export function CertificateStatsSummary({ codeCommune }: { codeCommune?: string }) {
  const [stats, setStats] = useState<CertificateStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [year, setYear] = useState<number>(() => new Date().getFullYear())

  useEffect(() => {
    if (!codeCommune) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/certificat/stats/${codeCommune}/${year}`, { credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<CertificateStats>
      })
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Erreur de chargement des statistiques')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [codeCommune, year])

  if (!codeCommune) return null

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }} aria-busy="true">
        <Loader size={20} />
        <span className="fr-hint-text fr-mb-0">Chargement des statistiques…</span>
      </div>
    )
  }

  if (error || !stats) {
    return <p className="fr-hint-text fr-mb-0">Statistiques indisponibles</p>
  }

  const maxCount = Math.max(1, ...stats.byMonth.map(m => m.count))
  console.log(stats)

  return (
    <div className="fr-mt-2w" style={{ maxWidth: '32rem' }}>
      <p className="sec-card__value fr-mb-2w">
        <strong>{stats.total.toLocaleString('fr-FR')}</strong> certificat{stats.total > 1 ? 's ' : ' '} émis depuis l&apos;activation
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span className="fr-hint-text fr-mb-0">Statistiques sur l&apos;année {year}</span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            type="button"
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line fr-btn--icon-left"
            aria-label="Année précédente"
            onClick={() => setYear(y => y - 1)}
          />
          <button
            type="button"
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-s-line fr-btn--icon-left"
            aria-label="Année suivante"
            disabled={year >= new Date().getFullYear()}
            onClick={() => setYear(y => y + 1)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '5rem' }}>
        { stats.byMonth.map(({ month, count }) => {

          const heightPercent = count > 0 ? Math.max(6, Math.round((Math.sqrt(count) / Math.sqrt(maxCount)) * 100)) : 0

          return (
            <div
              key={month}
              style={{
                display: 'flex',
                flexDirection: 'column',  
                alignItems: 'center',
                flex: 1,
                height: '100%',  
              }}
            >
              <span className="fr-hint-text fr-mb-0" style={{ fontSize: '0.6rem', minHeight: '0.9rem' }}>
                {count > 0 ? count : ''}
              </span>

              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    minHeight: count > 0 ? '4px' : 0,
                    background: 'var(--background-action-high-blue-france)',
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              </div>

              <span className="fr-hint-text fr-mb-0" style={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
                {month == 'all' ? MONTH_LABELS[0] : MONTH_LABELS[parseInt(month)]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}