import PropTypes from 'prop-types'

const Address = ({address}) => {
  console.log(address)
  return (
    <div />
  )
}

Address.propTypes = {
  address: PropTypes.object.isRequired
}

export default Address
