'use client'

const TERRITOIRES_OPTIONS = [
  { value: '971', label: '971 – Guadeloupe' },
  { value: '972', label: '972 – Martinique' },
  { value: '973', label: '973 – Guyane' },
  { value: '974', label: '974 – La Réunion' },
  { value: '976', label: '976 – Mayotte' },
  { value: '975', label: '975 – Saint-Pierre-et-Miquelon' },
  { value: '977', label: '977 – Saint-Barthélemy' },
  { value: '978', label: '978 – Saint-Martin' },
  { value: '988', label: '988 – Nouvelle-Calédonie' },
  { value: '987', label: '987 – Polynésie française' },
  { value: '986', label: '986 – Wallis-et-Futuna' },
]

interface SelectDomTomProps {
  handleTerritorySelect: (code: string) => void
}

export function SelectDomTom({ handleTerritorySelect }: SelectDomTomProps) {
  return (
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 50,
          pointerEvents: 'auto',
          background: 'var(--background-default-grey)',
          borderRadius: 8,
          boxShadow: 'var(--overlap-shadow)',
          overflow: 'hidden',
        }}
      >
        <select
          style={{
            border: 'none',
            padding: '9px 36px 9px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-default-grey)',
            background: 'var(--background-default-grey)',
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            minWidth: 180,
          }}
          value=""
          onChange={(e) => {
            if (e.target.value) handleTerritorySelect(e.target.value)
            e.target.value = ''
          }}
        >
          <option value="">Naviguer vers…</option>
          <optgroup label="DOM-TOM">
            {TERRITOIRES_OPTIONS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </optgroup>
        </select>
      </div>
  )
}
