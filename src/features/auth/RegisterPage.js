import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './auth.css'
import { Button } from '../../components/common/button'
import { InputBox } from '../../components/common/inputTextbox'
import logo from '../../assets/siteLogo.png'
import { apiErrorMessage } from '../../lib/errors'
import { PAGE_ROUTES } from '../../routes'
import { useRegisterMutation } from './authApi'

const ORANGE = '#FF914D'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('creator')
  const [register, { isLoading, error }] = useRegisterMutation()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ email, password, role }).unwrap()
      navigate(PAGE_ROUTES.HOME, { replace: true })
    } catch {
      /* error is rendered below */
    }
  }

  return (
    <div className="auth-wrapper">
      <img src={logo} alt="Ndorsify" className="auth-logo" />
      <h1>Create your account</h1>
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="auth-role">
          <Button
            type="button"
            color={ORANGE}
            primary={role === 'creator'}
            size="large"
            label="I'm a Creator"
            onClick={() => setRole('creator')}
          />
          <Button
            type="button"
            color={ORANGE}
            primary={role === 'brand'}
            size="large"
            label="I'm a Brand"
            onClick={() => setRole('brand')}
          />
        </div>
        <InputBox
          placeHolder="Email"
          size="xlarge"
          color="#C4C4C4"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputBox
          placeHolder="Password (min 8 characters)"
          size="xlarge"
          color="#C4C4C4"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="auth-error" role="alert">
            {apiErrorMessage(error)}
          </p>
        )}
        <Button
          type="submit"
          color={ORANGE}
          primary
          size="xlarge"
          label={isLoading ? 'Creating…' : 'Create account'}
        />
      </form>
      <p className="auth-links">
        Already have an account? <Link to={PAGE_ROUTES.LOGIN}>Sign in</Link>
      </p>
    </div>
  )
}
