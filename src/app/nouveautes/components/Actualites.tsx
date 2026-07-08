'use client'

import Section from "@/components/Section"
import TabActualite, { ActuRecord } from "./tab-actualite"
import Breadcrumb from "@/layouts/Breadcrumb"
import { camelCase } from "lodash"
import { useMemo, useState } from "react"
import { Grid, MonthButton, MonthsNav } from "../page.styles"

export default function Actualites({ appsData, filterTags }: { appsData: Record<string, any>[]; filterTags: string[]; }) {

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    
  const appsDataCamel = useMemo(() => appsData
    .map(appData => 
      Object.fromEntries(
        Object
          .entries(appData)
          .filter(([key]) => key)
          .map(([key, value]) => [camelCase(key), value])
      )
    ) as ActuRecord[], [appsData])
  .sort((a,b) => Number(a.date) - Number(b.date))

  const years = useMemo(() => {
    const extractedYears = appsDataCamel.map(app => 
      new Date(Number(app.date) * 1000).getFullYear()
    )
    return Array.from(new Set(extractedYears)).sort((a, b) => b - a)
  }, [appsDataCamel])


  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const [selectedYear, setSelectedYear] = useState<number | null>(years[0])

  const filteredApps = useMemo(() => {
    return appsDataCamel.filter(app => {
      if(selectedTags.length > 0) {
        const tags = app.tagsApplication
        const tagList = Array.isArray(tags)
          ? tags.map((tag: string) => tag.trim())
          : String(tags).split(',').map((tag: string) => tag.trim())
        const mathcesTags = selectedTags.some(selected => tagList.includes(selected))
        if (!mathcesTags) return false
      }
      const date = new Date(Number(app.date) * 1000)

      if (selectedMonth !== null && date.getMonth() !== selectedMonth) {
        return false
      }

      if (selectedYear !== null && date.getFullYear() !== selectedYear) {
        return false
      }

      return true
    })
  }, [appsDataCamel, selectedTags, selectedMonth, selectedYear])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

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

          <h4>
            Années
          </h4>
            <ul className="fr-tags-group">
            {years.map(year => (
              <li key={year}>
                <button
                  type="button"
                  className="fr-tag"
                  aria-pressed={selectedYear === year}
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
          <MonthsNav>
            {months.map((month, index) => (
              <MonthButton 
                key={month} 
                type="button"
                $active={selectedMonth === index}
                onClick={() => setSelectedMonth(selectedMonth === index ? null : index)}>
                {month}
              </MonthButton>
             ))}
          </MonthsNav>
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
