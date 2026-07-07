'use client'

import Section from "@/components/Section"
import Breadcrumb from "@/layouts/Breadcrumb"
import Tag from "@codegouvfr/react-dsfr/Tag"
import { camelCase } from "lodash"
import { useMemo, useState } from "react"
import { DateBlock, Grid, Item, MonthLabel } from "../page.styles"
import Link from "next/link"

export default function Actualites({ appsData, filterTags }: { appsData: Record<string, any>[]; filterTags: string[] }) {

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(2026)
    
  const appsDataCamel = useMemo(() => appsData
    .map(appData => 
      Object.fromEntries(
        Object
          .entries(appData)
          .filter(([key]) => key)
          .map(([key, value]) => [camelCase(key), value])
      )
    ), [appsData])
  .sort((a,b) => a.date - b.date)

  const filteredApps = useMemo(() => {
    if (selectedTags.length === 0) return appsDataCamel
    return appsDataCamel.filter(app => {
      const tags = app.tagsApplication
      const tagList = Array.isArray(tags)
      ? tags.map((tag: string) => tag.trim())
      : String(tags).split(',').map((tag: string) => tag.trim())

    return selectedTags.some(selected => tagList.includes(selected))
    })
  }, [appsDataCamel, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }
  // voir comment fait dans usage
  const years = [2026, 2025, 2024]

  return (
      <>
        <Breadcrumb
          currentPageLabel="Actualités"
          segments={[]}
        />

        <Section pageTitle="Nouveautés">
          <p>
            Suivez les évolutions récentes de la Base Adresse Nationale et des services adresse.data.gouv.fr.
          </p>
        </Section>

        <Section>
          <h4>
            Tags populaires
          </h4>
            <ul className="fr-tags-group">
            {filterTags.map((tag, index) => (
              <li key={index}>
                <button
                  className="fr-tag"
                  type="button"
                  aria-pressed={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <h4>
            Années
          </h4>
            <ul className="fr-tags-group">
            {years.map(year => (
              <li key={year}>
                <button
                  type="button"
                  className="fr-tag"
                  aria-current={selectedYear === year}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              </li>
              ))}
            </ul>
        </Section>

        <Section>
          <h4>
            {selectedYear}
          </h4>

        </Section>

        <Section>
          <Grid>
        {filteredApps.map((item, i) => {
          const label = new Date(item.date * 1000).toLocaleDateString("fr-FR", { month: "long"})
          const prevLabel = i > 0
            ? new Date(filteredApps[i - 1].date * 1000).toLocaleDateString("fr-FR", { month: "long" })
            : null

          return (
            <div key={i}>
              {label !== prevLabel && (
                <MonthLabel>
                  {label}
                </MonthLabel>
              )}
              <div>
                <Item>
                  <DateBlock>
                    <span className="day">{new Date(item.date * 1000).toLocaleDateString("fr-FR", { day: "2-digit" })}</span>
                    <span className="month">{new Date(item.date * 1000).toLocaleDateString("fr-FR", { month: "long" })}</span>
                    <span className="year">{new Date(item.date * 1000).toLocaleDateString("fr-FR", { year: "numeric" })}</span>
                  </DateBlock>
                  <div>
                    <h3 className="fr-text--md fr-mb-1v" style={{ fontWeight: 700 }}>{item.titre}</h3>
                    <p className="fr-text--sm fr-mb-0" style={{ color: "#555" }}>{item.description}</p>
                  </div>
                  <div>
                    {item.tagsApplication && 
                    item.tagsApplication.split(', ').map((tag: string) => <Tag key={tag} className="fr-mb-1w">{tag}</Tag>)}
                  </div>
                  <div>
                    <Link href="#" className="fr-link fr-link--icon-right fr-icon-arrow-right-line fr-mt-1w">
                      Lire l&apos;actualité
                    </Link>
                  </div>
                
                </Item>
                
                
                
              </div>
            </div>
          )
        })}
        </Grid>
      </Section>
      </>
    )
}
