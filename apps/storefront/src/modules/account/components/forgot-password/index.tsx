import { requestPasswordReset } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ForgotPassword = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(requestPasswordReset, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="forgot-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Reset your password</h1>
      {message?.state === "sent" ? (
        <p
          className="w-full text-center text-base-regular text-ui-fg-base bg-ui-bg-subtle border border-ui-border-base rounded-rounded p-4"
          data-testid="forgot-password-sent"
        >
          If an account exists for <strong>{message.email}</strong>, we&apos;ve
          sent it a link to reset the password.
        </p>
      ) : (
        <>
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Enter your email and we&apos;ll send you a link to choose a new
            password.
          </p>
          <form className="w-full" action={formAction}>
            <Input
              label="Email"
              name="email"
              type="email"
              title="Enter a valid email address."
              autoComplete="email"
              required
              data-testid="email-input"
            />
            <ErrorMessage
              error={message?.state === "error" ? message.error : null}
              data-testid="forgot-password-error-message"
            />
            <SubmitButton
              data-testid="send-reset-link-button"
              className="w-full mt-6"
            >
              Send reset link
            </SubmitButton>
          </form>
        </>
      )}
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
          data-testid="back-to-sign-in-button"
        >
          Back to sign in
        </button>
      </span>
    </div>
  )
}

export default ForgotPassword
