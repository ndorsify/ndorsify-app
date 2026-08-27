import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { PAGE_ROUTES } from './routes'
import RequireAuth from './routes/RequireAuth'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import HomePage from './features/home/HomePage'
import OnboardingPage from './features/onboarding/OnboardingPage'
import ProfileEditPage from './features/profile/ProfileEditPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path={PAGE_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={PAGE_ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<RequireAuth />}>
          <Route path={PAGE_ROUTES.HOME} element={<HomePage />} />
          <Route path={PAGE_ROUTES.ONBOARDING} element={<OnboardingPage />} />
          <Route path={PAGE_ROUTES.PROFILE_EDIT} element={<ProfileEditPage />} />
        </Route>

        <Route path="*" element={<Navigate to={PAGE_ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
