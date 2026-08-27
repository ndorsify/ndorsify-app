import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import './auth.css'
import { Button } from '../../components/common/button'
import { InputBox } from '../../components/common/inputTextbox'
import logo from '../../assets/siteLogo.png'
import { apiErrorMessage } from '../../lib/errors'
import { PAGE_ROUTES } from '../../routes'
import { useLoginMutation } from './authApi'

const ORANGE = '#FF914D'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || PAGE_ROUTES.HOME

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { isLoading, error }] = useLoginMutation()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password }).unwrap()
      navigate(from, { replace: true })
    } catch {
      /* error is rendered below */
    }
  }

  return (
    <div className="auth-wrapper">
      <img src={logo} alt="Ndorsify" className="auth-logo" />
      <h1>Sign in</h1>
      <form className="auth-form" onSubmit={onSubmit}>
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
          placeHolder="Password"
          size="xlarge"
          color="#C4C4C4"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="auth-error" role="alert">
            {apiErrorMessage(error, 'Invalid email or password.')}
          </p>
        )}
        <Button
          type="submit"
          color={ORANGE}
          primary
          size="xlarge"
          label={isLoading ? 'Signing in…' : 'Sign In'}
        />
      </form>
      <p className="auth-links">
        New to Ndorsify? <Link to={PAGE_ROUTES.REGISTER}>Create an account</Link>
      </p>
    </div>
  )
}
