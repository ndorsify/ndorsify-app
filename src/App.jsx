import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { PAGE_ROUTES } from './routes'
import RequireAuth from './routes/RequireAuth'
import RequireRole from './routes/RequireRole'
import { selectIsAuthed } from './features/auth/authSlice'
import LoginPage from './features/auth/LoginPage'
import OAuthCallbackPage from './features/auth/OAuthCallbackPage'
import RegisterPage from './features/auth/RegisterPage'
import LandingPage from './features/home/LandingPage'
import HomePage from './features/home/HomePage'
import OnboardingPage from './features/onboarding/OnboardingPage'
import ProfileEditPage from './features/profile/ProfileEditPage'
import SocialCallbackPage from './features/profile/SocialCallbackPage'
import SettingsPage from './features/settings/SettingsPage'
import DiscoverPage from './features/discovery/DiscoverPage'
import CreatorProfilePage from './features/discovery/CreatorProfilePage'
import InboxPage from './features/messaging/InboxPage'
import ThreadPage from './features/messaging/ThreadPage'
import CampaignsPage from './features/campaigns/CampaignsPage'
import CampaignBuilderPage from './features/campaigns/CampaignBuilderPage'
import MarketplacePage from './features/campaigns/MarketplacePage'
import InvitationsPage from './features/campaigns/InvitationsPage'
import OfferPage from './features/campaigns/OfferPage'
import EarningsPage from './features/earnings/EarningsPage'
import CollaborationsPage from './features/collaborations/CollaborationsPage'
import DraftReviewPage from './features/collaborations/DraftReviewPage'
import CheckoutPage from './features/checkout/CheckoutPage'
import ContractPage from './features/contracts/ContractPage'
import ReportPage from './features/reports/ReportPage'

// `/` is the public landing for logged-out visitors; logged-in users are sent
// straight to their dashboard.
function RootRoute() {
  const authed = useSelector(selectIsAuthed)
  return authed ? (
    <Navigate to={PAGE_ROUTES.DASHBOARD} replace />
  ) : (
    <LandingPage />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path={PAGE_ROUTES.HOME} element={<RootRoute />} />
        <Route path={PAGE_ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path={PAGE_ROUTES.OAUTH_CALLBACK}
          element={<OAuthCallbackPage />}
        />
        <Route path={PAGE_ROUTES.REGISTER} element={<RegisterPage />} />
        {/* A provider redirect lands here after a full page load, so it can't
            sit behind RequireAuth — see SocialCallbackPage. */}
        <Route
          path={PAGE_ROUTES.SOCIAL_CALLBACK}
          element={<SocialCallbackPage />}
        />

        {/* Protected */}
        <Route element={<RequireAuth />}>
          <Route path={PAGE_ROUTES.DASHBOARD} element={<HomePage />} />
          <Route path={PAGE_ROUTES.ONBOARDING} element={<OnboardingPage />} />
          <Route
            path={PAGE_ROUTES.PROFILE_EDIT}
            element={<ProfileEditPage />}
          />
          <Route path={PAGE_ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={PAGE_ROUTES.DISCOVER} element={<DiscoverPage />} />
          <Route
            path={PAGE_ROUTES.CREATOR_PROFILE}
            element={<CreatorProfilePage />}
          />
          <Route path={PAGE_ROUTES.MESSAGES} element={<InboxPage />} />
          <Route path={PAGE_ROUTES.MESSAGE_THREAD} element={<ThreadPage />} />
          <Route path={PAGE_ROUTES.CONTRACT} element={<ContractPage />} />
          <Route
            path={PAGE_ROUTES.DRAFT_REVIEW}
            element={<DraftReviewPage />}
          />
          <Route
            path={PAGE_ROUTES.COLLABORATIONS}
            element={<CollaborationsPage />}
          />

          {/* Brand-only */}
          <Route element={<RequireRole role="brand" />}>
            <Route path={PAGE_ROUTES.CAMPAIGNS} element={<CampaignsPage />} />
            <Route
              path={PAGE_ROUTES.CAMPAIGN_NEW}
              element={<CampaignBuilderPage />}
            />
            <Route
              path={PAGE_ROUTES.CAMPAIGN_FUND}
              element={<CheckoutPage />}
            />
            <Route
              path={PAGE_ROUTES.CAMPAIGN_REPORT}
              element={<ReportPage />}
            />
          </Route>

          {/* Creator-only */}
          <Route element={<RequireRole role="creator" />}>
            <Route
              path={PAGE_ROUTES.MARKETPLACE}
              element={<MarketplacePage />}
            />
            <Route
              path={PAGE_ROUTES.INVITATIONS}
              element={<InvitationsPage />}
            />
            <Route
              path={PAGE_ROUTES.INVITATION_DETAIL}
              element={<OfferPage />}
            />
            <Route path={PAGE_ROUTES.EARNINGS} element={<EarningsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={PAGE_ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
