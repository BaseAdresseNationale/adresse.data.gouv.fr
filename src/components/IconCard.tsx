import Image from 'next/image'

export interface IconCardProps {
  title: string
  imageSrc: string
  text: string
}

export default function IconCard({ title, imageSrc, text }: IconCardProps) {
  return (
    <div className="fr-illu fr-col-12 fr-col-md-4 align-center">
      <Image src={imageSrc} alt="icone carte" width={72} height={72} />
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  )
}
