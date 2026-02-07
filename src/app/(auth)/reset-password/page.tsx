import { ResetPasswordForm } from '@/components/features/auth/reset-password-form'

export const metadata = {
  title: 'Reset Password | SimpleCRM',
  description: 'Set your new password',
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your new password below
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  )
}
