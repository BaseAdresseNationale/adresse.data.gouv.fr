'use client'

import Section from "@/components/Section"
import TabActualite from "./tab-actualite"
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
            {filteredApps.map((item, i) => (
              <TabActualite
                key={i}
                item={item}
                data={filteredApps}
                index={i}
              />
            ))}
          </Grid>
        </Section>
      </>
    )
}
