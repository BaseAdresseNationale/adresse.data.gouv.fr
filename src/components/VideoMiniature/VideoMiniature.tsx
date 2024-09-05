import ResponsiveImage from '../ResponsiveImage'
import { StyledWrapper } from './VideoMiniature.styles'

interface VideoMiniatureProps {
  title: string
  image: string
  link: {
    href: string
    target: string
  }
}

export default function VideoMiniature({ title, image, link }: VideoMiniatureProps) {
  return (
    <StyledWrapper href={link.href} target={link.target}>
      <ResponsiveImage src={image} alt={title} />
      <h3>{title}</h3>
    </StyledWrapper>
  )
}
