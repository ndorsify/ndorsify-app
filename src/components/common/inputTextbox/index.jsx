import './inputBox.css'

/**
 * Defaults are parameter defaults — see the note in ../button/index.js.
 */
export const InputBox = ({
  size = 'medium',
  placeHolder = 'Input text Box',
  color,
  ...props
}) => {
  return (
    <input
      type="text"
      placeholder={placeHolder}
      className={['input-text', `input-text--${size}`].join(' ')}
      {...props}
    ></input>
  )
}
