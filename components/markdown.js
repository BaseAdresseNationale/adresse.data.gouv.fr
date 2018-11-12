import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'

const Markdown = ({markdown}) => {
  const md = marked(markdown)

  return (
    <div className='wrapper'>
      {/* eslint-disable react/no-danger */}
      <div dangerouslySetInnerHTML={{__html: md}} />
      {/* eslint-enable react/no-danger */}

      <style jsx>{`
        .wrapper {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }

        .wrapperglobal(pre) {
          white-space: pre-wrap;
          font-family: inherit;
        }

        wrapper:global(code) {
          font-family: inherit;
        }

        wrapper:global(:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired
}

export default Markdown
