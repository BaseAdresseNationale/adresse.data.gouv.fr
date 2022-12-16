import {forwardRef} from 'react'
import PropTypes from 'prop-types'

const TargetLockIcon = forwardRef(({color = 'currentColor', size = 24, ...rest}, ref) => {
  return (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      style={{fill: color}}
      {...rest}
    >{ /* Source SVG : https://boxicons.com/ */}
      <circle cx='12' cy='12' r='3' />
      <path d='M13 4.069V2h-2v2.069A8.008 8.008 0 0 0 4.069 11H2v2h2.069A8.007 8.007 0 0 0 11 19.931V22h2v-2.069A8.007 8.007 0 0 0 19.931 13H22v-2h-2.069A8.008 8.008 0 0 0 13 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z' />
    </svg>
  )
})

TargetLockIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
}
TargetLockIcon.displayName = 'TargetLock'

export default TargetLockIcon
