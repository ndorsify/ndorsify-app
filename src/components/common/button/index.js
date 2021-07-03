import React from 'react'
import PropTypes from 'prop-types'
import './button.css'

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, color, size, label, icon, ...props }) => {
  //const mode = primary ? "button--primary" : "button--secondary";
  //const borderCustom = border ? "border-without-bgColor" : "borderLess";
  return (
    <button
      type="button"
      className={['button', `button--${size}`].join(' ')}
      style={
        color && primary
          ? { backgroundColor: color, color: 'white' }
          : {
              border: `1px solid ${color}`,
              color: `${color}`,
              backgroundColor: 'transparent'
            }
      }
      {...props}
    >
      {icon && <img src={icon} alt="icon" />}
      {label}
    </button>
  )
}

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  color: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func
  /**
   * Optional Tooltip handler
   */
}

Button.defaultProps = {
  color: null,
  primary: false,
  size: 'medium',
  onClick: undefined
}
