'use client'

import Tag from "@codegouvfr/react-dsfr/Tag"
import { DateBlock, Item, MonthLabel } from "../page.styles"
import Link from "next/link"

export interface Tab {
    item:any
    data:any
    index:any
}
function TabActualite({item, data, index}: Tab) {
    const label = new Date(item.date * 1000).toLocaleDateString("fr-FR", { month: "long"})
    const prevLabel = index > 0 ? 
        new Date(data[index - 1].date * 1000).toLocaleDateString("fr-FR", { month: "long" })
        : null

    const date = new Date(item.date * 1000)
    const day = date.toLocaleDateString("fr-FR", { day: "2-digit" })
    const month = date.toLocaleDateString("fr-FR", { month: "long" })
    const year = date.toLocaleDateString("fr-FR", { year: "numeric" })

    return(
        <div key={index}>
            {label !== prevLabel && (
                <MonthLabel>
                    {label}
                </MonthLabel>
            )}
            <div>
                <Item>
                    <DateBlock>
                        <span className="day">{day}</span>
                        <span className="month">{month}</span>
                        <span className="year">{year}</span>
                    </DateBlock>

                    <div>
                        <h3 className="fr-text--md fr-mb-1v" style={{ fontWeight: 700 }}>{item.titre}</h3>
                         <p className="fr-text--sm fr-mb-0" style={{ color: "#555" }}>{item.description}</p>
                    </div>

                    <div>
                        {item.tagsApplication && item.tagsApplication.split(', ').map((tag: string) => <Tag key={tag} className="fr-mb-1w">{tag}</Tag>)}
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
}

export default TabActualite