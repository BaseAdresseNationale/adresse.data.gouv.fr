'use client'

import { DateBlock, Item, MonthLabel, StyledTag, TagsWrapper } from "../page.styles"
import Link from "next/link"

export interface ActuRecord {
  date: string
  titre: string
  description: string
  auteur: string
  lien: string
  tagsApplication: string
}

export interface Tab {
    item:ActuRecord
    data:ActuRecord[]
    index:number
}

function TabActualite({item, data, index}: Tab) {
    const label = new Date(Number(item.date) * 1000).toLocaleDateString("fr-FR", { month: "long"})
    const prevLabel = index > 0 ? 
        new Date(Number(data[index - 1].date) * 1000).toLocaleDateString("fr-FR", { month: "long" })
        : null

    const date = new Date(Number(item.date) * 1000)
    const day = date.toLocaleDateString("fr-FR", { day: "2-digit" })
    const month = date.toLocaleDateString("fr-FR", { month: "long" })
    const year = date.toLocaleDateString("fr-FR", { year: "numeric" })

    return(
        <div>
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

                    <TagsWrapper>
                        {item.tagsApplication &&
                            item.tagsApplication.split(', ').map((tag: string) => (
                            <StyledTag key={tag}>{tag}</StyledTag>
                            ))}
                    </TagsWrapper>

                    <div>
                        {
                            item.lien &&
                            <Link href={item.lien} target={item.lien.startsWith('http') ? '_blank' : undefined} className="fr-link fr-link--icon-right fr-icon-arrow-right-line fr-mt-1w">
                                En savoir plus
                            </Link>
                        }
                    </div>                   
                </Item>

            </div>
        </div>
    )
}

export default TabActualite