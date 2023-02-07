import {Fragment} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {fr} from '@codegouvfr/react-dsfr'

import themeBadge from './themeBadge.json'

function HeroTile({badgeLabels, title, description, link: {href, ...linkProps}, img}) {
  return (
    <div className={fr.cx('fr-tile fr-enlarge-link', 'fr-tile--horizontal', 'hero-tile')}>
      <div className='fr-tile__body hero-tile-body'>
        <div>
          {badgeLabels.map(badgeLabel => (
            <Fragment key={`${title}--${badgeLabel}`}>
              <b className={fr.cx('fr-badge', themeBadge[badgeLabel])}>
                {badgeLabel}
              </b>{' '}
            </Fragment>
          ))}
        </div>
        <h3 className='fr-tile__title'>
          <Link href={href} legacyBehavior><a className='fr-tile__link' {...linkProps} rel='noreferrer'>{title}</a></Link>
        </h3>
        <p className='fr-tile__desc'>{description}</p>
      </div>
      <div className='fr-tile__img hero-tile-img'>
        {img || (<svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clipPath='url(#clip0_10803_204366)'>
            <path d='M24.9409 44C13.8949 44 4.94092 35.046 4.94092 24C4.94092 12.954 13.8949 4 24.9409 4C35.9869 4 44.9409 12.954 44.9409 24C44.9409 35.046 35.9869 44 24.9409 44ZM24.9409 40C29.1844 40 33.254 38.3143 36.2546 35.3137C39.2552 32.3131 40.9409 28.2435 40.9409 24C40.9409 19.7565 39.2552 15.6869 36.2546 12.6863C33.254 9.68571 29.1844 8 24.9409 8C20.6975 8 16.6278 9.68571 13.6272 12.6863C10.6266 15.6869 8.94092 19.7565 8.94092 24C8.94092 28.2435 10.6266 32.3131 13.6272 35.3137C16.6278 38.3143 20.6975 40 24.9409 40ZM22.9409 30H26.9409V34H22.9409V30ZM26.9409 26.71V28H22.9409V25C22.9409 24.4696 23.1516 23.9609 23.5267 23.5858C23.9018 23.2107 24.4105 23 24.9409 23C25.5091 23 26.0655 22.8386 26.5456 22.5347C27.0256 22.2307 27.4094 21.7967 27.6525 21.2832C27.8955 20.7696 27.9877 20.1976 27.9183 19.6337C27.8489 19.0698 27.6208 18.5372 27.2606 18.0978C26.9003 17.6585 26.4227 17.3305 25.8834 17.1519C25.344 16.9734 24.765 16.9517 24.2138 17.0894C23.6625 17.2271 23.1617 17.5185 22.7697 17.9296C22.3776 18.3408 22.1103 18.8549 21.9989 19.412L18.0749 18.626C18.3182 17.4102 18.8799 16.2807 19.7028 15.3532C20.5256 14.4256 21.58 13.7332 22.7581 13.3466C23.9362 12.9601 25.1959 12.8934 26.4083 13.1532C27.6207 13.4131 28.7423 13.9902 29.6586 14.8256C30.5748 15.6611 31.2528 16.7248 31.6231 17.9081C31.9935 19.0914 32.043 20.3519 31.7666 21.5606C31.4902 22.7693 30.8978 23.883 30.05 24.7877C29.2021 25.6925 28.1292 26.3558 26.9409 26.71Z' fill='#0063CB' />
          </g>
          <defs>
            <clipPath id='clip0_10803_204366'>
              <rect width='48' height='48' fill='white' transform='translate(0.940918)' />
            </clipPath>
          </defs>
        </svg>)}

      </div>

      <style jsx>{`
        .hero-tile {
          align-items: flex-start;
          flex: 1;
        }
        .hero-tile-body{
          margin: 1.5rem;
        }
        .hero-tile-img{
          margin: 1.5rem 0 1.5rem 1.5rem;
          color: var(--info-425-625);
        }
        .hero-tile-img > svg {
          width: 65px;
          height: 65px;
          align-self: flex-start;
        }
      `}</style>
    </div>
  )
}

HeroTile.propTypes = {
  badgeLabels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.shape({
    href: PropTypes.string.isRequired,
    target: PropTypes.string,
  }),
  img: PropTypes.node
}

export default HeroTile
