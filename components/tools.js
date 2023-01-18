import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'
import Container from './container'

export function ToolCard({title, href, description, icon}) {
  return (
    <Link href={href} legacyBehavior>
      <a className='api-container'>
        <div className='title'>
          <div className='circle'>{icon}</div>
          <div>{title}</div>
        </div>
        <p>{description}</p>

        <style jsx>{`
          .api-container {
            background: ${theme.colors.white};
            border-radius: ${theme.borderRadius};
            border: solid 1px ${theme.border};
            text-decoration: none;
            color: ${theme.darkText};
            display: grid;
            grid-template-rows: 50px 1fr;
            padding: 1em;
            gap: 1em;
            box-shadow: 0px 5px 8px 1px ${theme.boxShadow};
          }

          .title {
            font-weight: 700;
            font-size: 17px;
            display: grid;
            grid-template-columns: 40px 1fr;
            align-items: center;
            gap: 10px;
          }

          .circle {
            height: 40px;
            width: 40px;
            background: ${theme.primary};
            color: ${theme.colors.white};
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          p {
            margin: 0;
            line-height: 30px;
            border-top: solid 3px ${theme.primary};
            padding: 1em 0;
            font-style: italic;
          }
        `}</style>
      </a>
    </Link>
  );
}

ToolCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  icon: PropTypes.object.isRequired,
  href: PropTypes.string.isRequired
}

export function Tools({items}) {
  return (
    <Container>
      <div className='apis-container'>
        {items.map(item => <ToolCard key={item.title} {...item} />)}

        <style jsx>{`
        .apis-container {
          margin: 4em 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 2em;
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

