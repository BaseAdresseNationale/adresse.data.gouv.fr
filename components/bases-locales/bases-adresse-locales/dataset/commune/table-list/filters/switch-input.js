import React from 'react'
import PropTypes from 'prop-types'
import theme from '../../../../../../../styles/theme'

const SwitchInput = ({handleChange, label, isChecked}) => (
  <div className='switch-input-container'>
    <label className='switch'>
      <input type='checkbox' onChange={handleChange} defaultChecked={isChecked} />
      <span className='slider round' />
    </label>
    <label>{label}</label>
    <style jsx>{`
      .switch-input-container {
        display: flex;
        align-items: center;
        margin-top: 1em;
        justify-content: center;
      }

      .switch-input-container label {
        margin-left: 1em;
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
      }

      .switch input {display:none;}

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }

      input:checked + .slider {
        background-color: ${theme.primary};
      }

      input:focus + .slider {
        box-shadow: 0 0 1px ${theme.primary};
      }

      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }

      .slider.round {
        border-radius: 34px;
      }

      .slider.round:before {
        border-radius: 50%;
      }
      `}</style>
  </div>
)

SwitchInput.propTypes = {
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool
}

SwitchInput.defaultProps = {
  isChecked: false
}

export default SwitchInput
