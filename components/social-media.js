import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {ChevronDown, ChevronRight} from 'react-feather'

import Container from '@/components/container'

function SocialMedia() {
  const [isShown, setIsShown] = useState(false)
  const handleNewsletter = () => {
    setIsShown(!isShown)
  }

  return (
    <>
      <div className='socials'>
        <Link href='/blog'>
          <a aria-label='Consulter notre blog'>
            <Image src='/images/logos/blog.svg' height={88} width={88} alt='Blog' />
            <div>En lisant notre blog</div>
          </a>
        </Link>

        <a href='https://twitter.com/adressedatagouv?lang=fr' aria-label='Visiter notre compte Twitter'>
          <Image src='/images/logos/twitter.svg' height={88} width={88} alt='Twitter' />
          <div>Sur notre fil Twitter</div>
        </a>

        <button
          onClick={handleNewsletter}
          className='newsletter'
          aria-label='S’inscrire à l’infolettre'
          type='button'
        >
          <Image src='/images/logos/newsletter.svg' height={88} width={88} alt='Newsletter' />
          <div className='dropdown'>
            {isShown ? <ChevronDown /> : <ChevronRight />}
            En s’inscrivant à l’infolettre
          </div>
        </button>
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
            border: none;
            background: none;
          }

          a, .newsletter {
            width: 280px;
            color: #0053b3;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            gap: 10px;
            padding: 1em;
            text-decoration: underline;
            font-weight: bold;
            font-size: 16px;
          }

          .newsletter:hover {
            background: #EBEFF3;
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
