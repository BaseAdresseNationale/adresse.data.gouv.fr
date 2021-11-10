import {useState} from 'react'
import Image from 'next/image'
import {ChevronDown, ChevronRight} from 'react-feather'

import theme from '@/styles/theme'

import Container from '@/components/container'
import CircleLink from './circle-link'

function SocialMedia() {
  const [isShown, setIsShown] = useState(false)
  const handleNewsletter = () => {
    setIsShown(!isShown)
  }

  return (
    <>
      <div className='socials'>
        <CircleLink
          href='https://blog.geo.data.gouv.fr/'
          icon={<Image src='/images/logos/blog.svg' height={88} width={88} />}
        >
          En lisant notre blog
        </CircleLink>

        <CircleLink
          href='https://twitter.com/adressedatagouv?lang=fr'
          icon={<Image src='/images/logos/twitter.svg' height={88} width={88} />}
        >
          Sur notre fil Twitter
        </CircleLink>

        <div onClick={handleNewsletter} className='newsletter'>
          <Image src='/images/logos/newsletter.svg' height={88} width={88} />
          <div className='dropdown'>
            {isShown ? <ChevronDown /> : <ChevronRight />}
            En s’inscrivant à l’infolettre
          </div>
        </div>
      </div>

      {isShown && (
        <Container>
          <iframe height='660' width='100%' src='https://8d772127.sibforms.com/serve/MUIEALrUjwg3nxBK1Ebb_ndriJHjVhfoNqqr55eXe4id-Y3eYMbnHY6fabW8qNi5S55CjKgwWuwYbpWbQamoes1zxUi4vYJGeXwkygSrYFFz0Yg644JK8Bb2VY1Q23vp4b22CmKNIWbjSccP3x1RTOsdV3EjJkWc_o-mXUxWg9Hjx8gbmzkyUeSgKAinMeoI33kqpDssnQxeeorN' />
        </Container>
      )}

      <style jsx>{`
        .socials {
          margin: 5em 0 1em 0;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 2em;
        }

        .newsletter {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          height: fit-content;
          cursor: pointer;
          text-align: center;
          gap: 10px;
          padding: 1em;
          text-decoration: underline;
        }

        .newsletter:hover {
          background: ${theme.colors.lighterGrey};
        }

        iframe {
          border: none;
        }

        .dropdown {
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  )
}

export default SocialMedia
