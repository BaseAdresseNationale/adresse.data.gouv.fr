import Image from 'next/image'

import theme from '@/styles/theme'

function NoAddressWarning() {
  return (
    <div className='no-address-container'>
      <Image src='/images/icons/address-not-found.png' height={150} width={120} alt aria-hidden='true' />
      <p className='no-address-text'>Aucune adresse n’est connue pour cette commune</p>

      <style jsx>{`
        .no-address-container {
          text-align: center;
          background: ${theme.colors.white};
          color: ${theme.darkText};
          border-radius: 8px;
          padding: 2em;
          gap: 1em;
          margin: 3em 0;
        }

        .no-address-text {
          font-size: large;
          font-weight: bold;
          margin: 0;
          padding: 1em 0 .5em 0;
        }
      `}</style>
    </div>
  )
}

NoAddressWarning.propTypes = {}
export default NoAddressWarning
