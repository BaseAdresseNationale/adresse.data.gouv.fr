import theme from '../styles/theme'

const Loader = () => (
  <div className='loader'>
    <style jsx>{`
      .loader {
        margin-left: 10px;
        border: 4px solid ${theme.colors.white}
        border-top: 4px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 25px;
        height: 25px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

export default Loader
