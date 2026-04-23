<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already partially set up (provider, pageview tracking, login/register identify calls, and `checkout_initiated`). This integration extended event coverage to 7 additional business-critical actions across authentication, onboarding, and engagement flows. Environment variables were confirmed and updated in `.env.local`. A PostHog dashboard with 5 insights was created to monitor key metrics.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_registered` | User completes signup form (pre-existing) | `src/app/auth/register/page.tsx` |
| `user_logged_in` | User logs in successfully (pre-existing) | `src/app/auth/login/page.tsx` |
| `checkout_initiated` | User clicks to proceed to payment (pre-existing) | `src/components/shared/checkout.tsx` |
| `role_selected` | User selects member or organization workspace | `src/app/select-role/page.tsx` |
| `plan_created` | Organization admin creates a subscription plan during onboarding | `src/app/organization/onboarding/create-plan/page.tsx` |
| `staff_invited` | Organization admin sends staff invitation emails | `src/components/organization/InviteStaffModal.tsx` |
| `invoice_downloaded` | User downloads an invoice as PDF | `src/app/organization/invoices/[id]/pay/page.tsx` |
| `referral_waitlist_joined` | Member signs up for the referral program waitlist | `src/components/member/pages/memberReferralsPage.tsx` |
| `password_reset_requested` | User requests a password reset code | `src/app/auth/forgot-password/page.tsx` |
| `password_reset_completed` | User successfully resets their password | `src/app/auth/forgot-password/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/394601/dashboard/1504117
- **User Registration Funnel** (registered → role selected → checkout initiated): https://us.posthog.com/project/394601/insights/joGDUoFT
- **Checkout Initiations by Mode** (member vs organization breakdown): https://us.posthog.com/project/394601/insights/UHSLIdx7
- **New Signups & Logins Over Time** (daily acquisition trend): https://us.posthog.com/project/394601/insights/PptIisqh
- **Organization Onboarding Activity** (plans created, staff invited, invoices downloaded): https://us.posthog.com/project/394601/insights/3W3gChrh
- **Password Reset Completion Rate** (reset requested → completed funnel): https://us.posthog.com/project/394601/insights/1QHZR8HK

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
