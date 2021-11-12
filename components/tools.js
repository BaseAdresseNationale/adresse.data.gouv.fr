import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'
import Container from './container'

export function ToolCard({title, description, links}) {
  return (
    <div className='api-container'>
      <div className='description-container'>
        <div>{title}</div>
        <p>{description}</p>
      </div>
      <ul>
        {links.map(link => {
          return (
            <li key={link.title}>
              <Link href={link.href}>
                <a>
                  {link.title}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>

      <style jsx>{`
        .api-container {
          background: ${theme.colors.white};
          border-radius: ${theme.borderRadius};
          border: solid 1px ${theme.border};
          padding: 1.5em;
          display: grid;
          grid-template-rows: 1fr 100px;
          gap: 1.5em;
        }

        .description-container {
          border-bottom: solid 3px ${theme.primary};
          padding-bottom: 1em;
          text-align: center;
          color: ${theme.darkText};
        }

        .description-container div {
          font-weight: bold;
        }

        .description-container p {
          text-align: left;
          font-size: 15px;
        }

        ul {
          display: flex;
          flex-direction: column;
          font-weight: bold;
          color: ${theme.primary};
          gap: 10px;
        }

        a {
          color: ${theme.darkText};
        }
    `}</style>
    </div>
  )
}

ToolCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  links: PropTypes.array.isRequired
}

export function Tools({items}) {
  return (
    <Container>
      <div className='apis-container'>
        {items.map(item => <ToolCard key={item.name} {...item} />)}

        <style jsx>{`
        .apis-container {
          margin: 4em 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 4em;
          padding: 2em 0;
        }
      `}</style>
      </div>
    </Container>
  )
}

Tools.propTypes = {
  items: PropTypes.array.isRequired
}

