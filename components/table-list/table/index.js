import React from 'react'
import PropTypes from 'prop-types'

class Table extends React.Component {
  static propTypes = {
    isWrap: PropTypes.bool.isRequired,
    onWrap: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    hasDisabledWrap: PropTypes.bool
  }

  static defaultProps = {
    hasDisabledWrap: false
  }

  render() {
    const {isWrap, hasDisabledWrap, onWrap, children} = this.props

    return (
      <div className='table-container'>
        <table className={isWrap && !hasDisabledWrap && 'wrapped'}>
          {children}
        </table>

        {!hasDisabledWrap &&
          <div className='wrap' onClick={onWrap}>
            {isWrap ? 'Tout afficher' : 'Réduire'}
          </div>}

        <style jsx>{`
          .table-container {
            margin: 1em 0;
          }

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

export default Table
