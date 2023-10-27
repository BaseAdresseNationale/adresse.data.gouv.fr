import PropTypes from 'prop-types'

function HeroSection({
  backgroundColor = 'var(--blue-france-975-75)',
  children,
  imgSrc,
  imgAlt = '',
  imgWidth = '100%'
}) {
  return (
    <section className='hero-section' style={{background: backgroundColor}}>
      <div className='fr-container fr-py-5w'>
        <div className='fr-grid-row'>
          <div className='fr-col-md-7 improve-quality-card'>
            {children}
          </div>
          {
            imgSrc &&
            <div className='fr-col-md-5 image-wrapper'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className='fr-responsive-img' src={imgSrc} alt={imgAlt} width={imgWidth} />
            </div>
          }
        </div>
      </div>
    </section>
  )
}

HeroSection.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  imgWidth: PropTypes.string
}

export default HeroSection
