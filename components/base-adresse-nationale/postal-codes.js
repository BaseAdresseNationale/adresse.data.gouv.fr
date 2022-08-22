import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function PostalCodes({codes}) {
  return codes.length === 1 ? (
    <div>{codes[0]}</div>
  ) : (
    <div className='dropdown'>
      <div className='dropdown-action'>Codes</div>
      <ul className='dropdown-content'>
        {codes.map(code => <li key={code}>{code}</li>)}
      </ul>

      <style jsx>{`
          .dropdown-action {
            text-decoration: underline;
            cursor: pointer;
          }

          .dropdown {
            position: relative;
            display: inline-block;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            background-color: ${theme.backgroundDark};
            width: fit-content;
            list-style: none;
            text-align: center;
            color: ${theme.colors.white};
            padding: 10px;
            border-radius: 5px;
            left: 0;
            top: 10px;
            z-index: 1;
          }

          .dropdown-action:hover .dropdown-content {
            display: inline-block;
          }
        `}</style>
    </div>
  )
}

PostalCodes.propTypes = {
  codes: PropTypes.array.isRequired
}

export default PostalCodes
