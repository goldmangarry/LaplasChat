import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MagicCard } from "@/components/magicui/magic-card"
import { useTranslation, Trans } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '@/core/api/auth/hooks'
import { useUserStore } from '@/core/user'
import type { LoginFormData } from './types'
import loginBg from '@/assets/login-background.png'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>()

  const loginMutation = useLogin()

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        login({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          tokenType: response.token_type,
          expiresIn: response.expires_in,
        })
        navigate({ to: '/' })
      },
      onError: (error: any) => {
        console.error('Login failed:', error)
        if (error?.response?.status === 401) {
          setError('root', { 
            message: t('login.errors.invalidCredentials') 
          })
        } else {
          setError('root', { 
            message: t('login.errors.networkError') 
          })
        }
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <MagicCard className="overflow-hidden p-0 rounded-xl" gradientColor={"#D9D9D955"}>
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t('login.title')}</h1>
                <p className="text-muted-foreground text-balance">
                  {t('login.subtitle')}
                </p>
              </div>
              <div className="grid gap-3 relative">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  {...register('username', { required: true })}
                />
                {errors.username && (
                  <span className="text-sm text-red-500 absolute -bottom-5 left-0">{t('login.errors.emailRequired')}</span>
                )}
              </div>
              <div className="grid gap-3 relative">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <span className="text-sm text-red-500 absolute -bottom-5 left-0">{t('login.errors.passwordRequired')}</span>
                )}
              </div>
              {errors.root && (
                <div className="text-sm text-red-500 text-center">
                  {errors.root.message}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? t('login.loading') : t('login.loginButton')}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t('login.orContinueWith')}
                </span>
              </div>
              <div className="gap-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={() => {
                    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login/google`
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">{t('login.socialLogin.google')}</span>
                </Button>
              </div>
            </div>
          </form>
          <div 
            className="bg-muted relative hidden md:block bg-cover bg-center bg-no-repeat dark:brightness-[0.2] dark:grayscale"
            style={{ backgroundImage: `url(${loginBg})` }}
          />
        </CardContent>
      </MagicCard>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        <Trans
          i18nKey="login.termsAndPrivacy"
          components={{
            termsLink: <a href="#" />,
            privacyLink: <a href="#" />
          }}
          values={{
            termsText: t('login.termsOfService'),
            privacyText: t('login.privacyPolicy')
          }}
        />
      </div>
    </div>
  )
}