import {
  DistrictLinkWrapper,
  DistrictName,
  DistrictLinkLabel,
} from './DistrictLink.styles'

interface District {
  nom: string
  code: string
}

interface DistrictLinkProps {
  children?: React.ReactNode
  district: District
}

function DistrictLink({ children, district }: DistrictLinkProps) {
  const href = `./commune/${district.code}`
  const titleLink = `Voir la page de la commune de ${district.nom} (COG ${district.code})`

  return (
    <DistrictLinkWrapper>
      <DistrictName>{children || district.nom}</DistrictName>

      <DistrictLinkLabel
        href={href}
        target="_test"
        title={titleLink}
      >
        Voir la page de la commune
      </DistrictLinkLabel>
    </DistrictLinkWrapper>
  )
}

export default DistrictLink
