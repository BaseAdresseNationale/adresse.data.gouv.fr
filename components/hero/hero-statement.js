import {Fragment} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {fr} from '@codegouvfr/react-dsfr'

import themeBadge from './themeBadge.json'

function HeroStatement({type, badgeLabels, title, body, links, img}) {
  return (
    <>
      <div className={`statement-card ${type}`}>
        <div className='advert-card-tag'>
          {badgeLabels.map(badgeLabel => (
            <Fragment key={`${title}--${badgeLabel}`}>
              <b className={fr.cx('fr-badge', themeBadge[badgeLabel])}>
                {badgeLabel}
              </b>{' '}
            </Fragment>
          ))}

        </div>
        <div className='statement-card-header'>
          {img && <div className='statement-card-img'>{img}</div>}
          <h4>{title}</h4>
        </div>

        <div className='statement-card-body'>
          {body}
        </div>
        <ul className='statement-card-footer-link'>
          {links.map(({text, href, ...otherProps}) => (
            <li key={`${title}--${text}--${href}`}>
              <Link
                href={href}
                legacyBehavior
              >
                <a
                  className='fr-link fr-link--icon-right fr-icon-arrow-right-line'
                  {...otherProps}
                  rel='noreferrer'
                >{text}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .statement-card {
          flex: 1;
          background-color: rgba(90,90,190,.5);
          background-color: var(--info-425-625);
          color: var(--grey-1000-50);
          font-size: 0.8rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .statement-card.actuality {
          background-color: var(--purple-glycine-main-494);
        }
        .statement-card .fr-link {
          color: var(--grey-1000-50);
        }
        .statement-card h4 {
          font-size: 1rem;
          line-height: 1.75em;
          margin: 0 0 0.5rem;
          color: var(--grey-1000-50);
        }
        .statement-card p {
          font-size: .9rem;
        }
        .statement-card-header {
          display: flex;
          gap: 1rem;
          margin: 0.5rem 0 0;
        }
        .statement-card-body {
          flex: 1;
        }
        .statement-card-img svg {
          max-width: 3.5rem;
        }
        .statement-card-footer-link {
          display: flex;
          flex-direction: column;
          align-items: end;
          justify-content: flex-start;
          list-style: none;
          text-align: right;
          margin: 0.5em 0 0;
        }
    `}</style>
    </>
  )
}

HeroStatement.propTypes = {
  type: PropTypes.string,
  badgeLabels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  body: PropTypes.node,
  links: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    target: PropTypes.string,
  })),
  img: PropTypes.node
}

export default HeroStatement
