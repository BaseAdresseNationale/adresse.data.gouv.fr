import Tile from '@codegouvfr/react-dsfr/Tile'

import BadgeCategory from '@/components/BadgeCategory'
import Section from '@/components/Section'
import CardWrapper from '@/components/CardWrapper'
import type { ColorTheme } from '@/theme'

interface TilesData {
  picto: string
  title: string
  description?: string
  detail?: string
  link: {
    href: string
    target?: string
  }
  tags?: string[]
}

interface SectionTilesListProps {
  title?: string
  id?: string
  data: TilesData[]
  theme?: ColorTheme
  tileTitleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  isSmallTiles?: boolean
  withoutLinkIcon?: boolean
}

function SectionTilesList({
  title,
  id,
  data,
  theme,
  tileTitleAs = 'h3',
  isSmallTiles,
  withoutLinkIcon,
}: SectionTilesListProps) {
  return (
    <Section title={title} id={id} theme={theme}>
      <CardWrapper isSmallCard={isSmallTiles}>
        {data.map((item, index) => (
          <Tile
            key={index}
            imageSvg={false}
            start={item.tags?.map(
              (tag, i) => <BadgeCategory key={i}>{tag}</BadgeCategory>
            )}
            title={item.title}
            desc={item.description}
            detail={item.detail}
            imageUrl={item.picto}
            linkProps={item.link}
            orientation="vertical"
            titleAs={tileTitleAs}
            small={isSmallTiles}
            noIcon={withoutLinkIcon}
          />
        ))}
      </CardWrapper>
    </Section>
  )
}

export default SectionTilesList
