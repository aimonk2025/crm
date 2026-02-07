import { ForgotPasswordForm } from '@/components/features/auth/forgot-password-form'

export const metadata = {
  title: 'Forgot Password | SimpleCRM',
  description: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password?
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your email and we'll send you a reset link
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
