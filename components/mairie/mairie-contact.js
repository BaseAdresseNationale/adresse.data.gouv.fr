import PropTypes from 'prop-types'
import {Mail, Phone} from 'react-feather'

function MairieContact({email, phone}) {
  console.log(email)
  return (
    <div className='contact-infos'>
      <div className='contact-info'>
        <Mail size={18} style={{marginRight: '10px'}} />
        {email ? <a href={`mailto:${email}`}>{email}</a> : 'Non renseigné'}
      </div>
      <div className='contact-info'>
        <Phone size={18} style={{marginRight: '10px'}} />
        {phone ? <a href={`tel:+33${phone}`}>{phone}</a> : 'Non renseigné'}
      </div>

      <style jsx>{`
        .contact-infos {
          display: flex;
          flex-direction: column;
          padding-bottom: .5em;
          gap: 5px;
        }

        .contact-info {
          display: flex;
          font-size: ${email?.length > 35 ? '14px' : '16px'};
        }
      `}</style>
    </div>
  )
}

MairieContact.defaultProps = {
  email: null,
  phone: null
}

MairieContact.propTypes = {
  email: PropTypes.string,
  phone: PropTypes.string
}

export default MairieContact
