import { useNavigate } from 'react-router-dom'

import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { PAGE_ROUTES } from '../../routes'
import { useGetCreatorQuestionsQuery } from './onboardingApi'

const ORANGE = '#FF914D'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetCreatorQuestionsQuery()
  const categories = data || {}

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>Welcome — let's get you set up</h1>
        <p className="subtle">
          A few prompts to shape the profile you'll complete next.
        </p>

        {isLoading && <p>Loading questions…</p>}
        {isError && (
          <p className="form-error">Couldn't load onboarding questions.</p>
        )}

        {Object.entries(categories).map(([category, questions]) => (
          <section key={category} style={{ marginBottom: 24 }}>
            <h3 style={{ color: 'var(--ink)', margin: '0 0 8px' }}>{category}</h3>
            {(questions || []).map((q, i) => (
              <div className="field" key={`${category}-${i}`}>
                <label>{q.question}</label>
                <input placeholder={q.dataType || 'Your answer'} />
              </div>
            ))}
          </section>
        ))}

        <Button
          color={ORANGE}
          primary
          size="large"
          label="Continue to profile"
          onClick={() => navigate(PAGE_ROUTES.PROFILE_EDIT)}
        />
      </div>
    </>
  )
}
