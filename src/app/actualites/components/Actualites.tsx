'use client'

import Section from "@/components/Section"
import Breadcrumb from "@/layouts/Breadcrumb"
import Tag from "@codegouvfr/react-dsfr/Tag"
import { camelCase } from "lodash"
import { useMemo } from "react"

export default function Actualites({ appsData }: { appsData: Record<string, any>[] }) {
    
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

    console.log(appsData)


  return (
      <>
        <Breadcrumb
          currentPageLabel="Actualités"
          segments={[]}
        />

        <Section pageTitle="Les actualités">
          <p>
            Voici toutes les actualités ci-dessous. Le design va bientôt changer et des filtre par trimestre vont apparaître !
          </p>
        </Section>

        <Section>
        {appsDataCamel.map((item, i) => {
          const label = new Date(item.date * 1000).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
          const prevLabel = i > 0
            ? new Date(appsDataCamel[i - 1].date * 1000).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
            : null

          return (
            <div key={i}>
              {label !== prevLabel && (
                <h4
                  style={{
                    paddingTop: "1rem",
                    marginTop: "2rem",
                    textTransform: "capitalize",
                  }}
                >
                  {label}
                </h4>
              )}
              <div style={{ padding: ".75rem 0", borderBottom: "1px solid #e5e5e5" }}>
                {item.tagsApplication && 
                item.tagsApplication.split(', ').map((tag: string) => <Tag key={tag} className="fr-mb-1w">{tag}</Tag>)}
                <h3 className="fr-text--md fr-mb-1v" style={{ fontWeight: 700 }}>{item.titre}</h3>
                <p className="fr-text--sm fr-mb-0" style={{ color: "#555" }}>{item.description}</p>
              </div>
            </div>
          )
        })}
      </Section>
      </>
    )
}
