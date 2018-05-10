import React from 'react'
import PropTypes from 'prop-types'

class Table extends React.Component {
  render() {
    const {wrap, disabledWrap, onWrap, children} = this.props

    return (
      <div>
        <table className={wrap && !disabledWrap && 'wrapped'}>
          {children}
        </table>

        {!disabledWrap &&
          <div className='wrap' onClick={onWrap}>
            {wrap ? 'Tout afficher' : 'Réduire'}
          </div>}

        <style jsx>{`
          table {
            border-collapse: collapse;
            width: 100%;
          }

          table.wrapped:after {
            position: absolute;
            bottom: 35px;
            height: 3%;
            width: 100%;
            content: "";
            background: linear-gradient(to top,
               rgba(255,255,255, 1) 20%,
               rgba(255,255,255, 0) 80%
            );
          }

          .wrap {
            width: 100%;
            text-align: center;
            margin-top: 1em;
            text-decoration: underline;
          }

          .wrap:hover {
            cursor: pointer;
            text-decoration: none;
          }

          @media (max-width: 460px) {
            table {
              font-size: x-small;
            }
          }

          @media (max-width: 400px) {
            table.wrapped:after {
              width: 90%;
            }
          }
          `}</style>
      </div>

    )
  }
}

Table.propTypes = {
  wrap: PropTypes.bool.isRequired,
  onWrap: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabledWrap: PropTypes.bool
}

Table.defaultProps = {
  disabledWrap: false
}

export default Table
