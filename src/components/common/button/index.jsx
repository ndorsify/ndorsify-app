import './button.css'

/**
 * Primary UI component for user interaction.
 *
 * Defaults are parameter defaults: React 19 ignores `defaultProps` on function
 * components, and `propTypes` with it, so both were dropped rather than left
 * looking like they still validate anything.
 */
export const Button = ({
  primary = false,
  color = null,
  size = 'medium',
  label,
  icon,
  ...props
}) => {
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
