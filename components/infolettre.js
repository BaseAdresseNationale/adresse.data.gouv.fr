import React, {useState} from 'react'

import Section from './section'
import Button from './button'

function Infolettre() {
  const [isShown, setIsShown] = useState(false)

  return (
    <Section title='Infolettre adresse.data.gouv.fr' subtitle='Inscrivez-vous pour suivre nos actualités' background='color'>
      <div className='newsletter'>
        {isShown ? (
          <iframe height='660' width='100%' src='https://8d772127.sibforms.com/serve/MUIEALrUjwg3nxBK1Ebb_ndriJHjVhfoNqqr55eXe4id-Y3eYMbnHY6fabW8qNi5S55CjKgwWuwYbpWbQamoes1zxUi4vYJGeXwkygSrYFFz0Yg644JK8Bb2VY1Q23vp4b22CmKNIWbjSccP3x1RTOsdV3EjJkWc_o-mXUxWg9Hjx8gbmzkyUeSgKAinMeoI33kqpDssnQxeeorN' />
        ) : (
          <Button type='button' isOutlined onClick={() => setIsShown(!isShown)}>M’inscrire</Button>
        )}
      </div>

      <style jsx>{`
        .newsletter {
          display: flex;
          justify-content: center;
          margin: 1em 0;
        }

        iframe {
          border: none;
        }
        `}</style>
    </Section>
  )
}

export default Infolettre
