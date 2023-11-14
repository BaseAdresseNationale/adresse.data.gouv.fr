/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types'
import {fr} from '@codegouvfr/react-dsfr'

function Star({isFill, isHalf}) {
  const className = isFill ? 'ri-star-s-fill' : (isHalf ? 'ri-star-half-s-line' : 'ri-star-s-line')
  return <i className={fr.cx(className)} style={{opacity: isFill ? 1 : 0.3}} />
}

Star.propTypes = {
  isFill: PropTypes.bool,
  isHalf: PropTypes.bool,
}

function StarLine({score = 0, color, className}) {
  const fullScore = 5
  const minScore = Math.floor(score)
  const halfScore = (score - minScore) >= 0.25 && (score - minScore) < 0.75 ? 1 : 0
  const intagerScore = (minScore + 0.75) < score ? minScore + 1 : minScore
  const emptyScore = fullScore - intagerScore - halfScore
  return (
    <>
      <span className={`star-wrapper ${className || ''}`}>
        {(Array.from({length: intagerScore})).map((_, i) => <Star key={i} isFill />)}
        {(Array.from({length: halfScore})).map((_, i) => <Star key={i} isHalf />)}
        {(Array.from({length: emptyScore})).map((_, i) => <Star key={i} />)}
      </span>
      <style jsx>{`
        .star-wrapper {
          display: inline-flex;
          flex-direction: row;
          flex-wrap: nowrap;
          font-size: 1.5rem;
          margin: 0 0.2rem;
          ${color ? `color: ${color};` : ''}
        }
      `}</style>
    </>
  )
}

StarLine.propTypes = {
  score: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
}

export default StarLine
