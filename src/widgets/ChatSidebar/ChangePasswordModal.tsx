import { Dialog, Button, HStack, VStack, Input, Text, IconButton, InputGroup } from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { Field } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

type ChangePasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type ChangePasswordModalProps = {
  isOpen: boolean
  onConfirm: (currentPassword: string, newPassword: string) => Promise<void>
  onCancel: () => void
}

export const ChangePasswordModal = ({
  isOpen,
  onConfirm,
  onCancel
}: ChangePasswordModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ChangePasswordForm>({
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const newPassword = watch('newPassword')

  const onSubmit = useCallback(async (data: ChangePasswordForm) => {
    setIsLoading(true)
    try {
      await onConfirm(data.currentPassword, data.newPassword)
      reset()
    } catch (error) {
      console.error('Error changing password:', error)
    } finally {
      setIsLoading(false)
    }
  }, [onConfirm, reset])

  const handleCancel = () => {
    reset()
    onCancel()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen && !isLoading) {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isLoading, handleSubmit, onSubmit])

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleCancel()} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Сменить пароль</Dialog.Title>
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align="stretch">
                <Field.Root invalid={!!errors.currentPassword}>
                  <Field.Label>Текущий пароль</Field.Label>
                  <InputGroup
                    endElement={
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? "Скрыть пароль" : "Показать пароль"}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    }
                  >
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Введите текущий пароль"
                      {...register('currentPassword', {
                        required: 'Текущий пароль обязателен',
                        minLength: {
                          value: 6,
                          message: 'Текущий пароль должен содержать минимум 6 символов'
                        }
                      })}
                    />
                  </InputGroup>
                  {errors.currentPassword && (
                    <Text color="red.500" fontSize="sm">{errors.currentPassword.message}</Text>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.newPassword}>
                  <Field.Label>Новый пароль</Field.Label>
                  <InputGroup
                    endElement={
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Скрыть пароль" : "Показать пароль"}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    }
                  >
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Введите новый пароль"
                      {...register('newPassword', {
                        required: 'Новый пароль обязателен',
                        minLength: {
                          value: 8,
                          message: 'Новый пароль должен содержать минимум 8 символов'
                        },
                        validate: (value) => {
                          const hasUpperCase = /[A-Z]/.test(value)
                          const hasLowerCase = /[a-z]/.test(value)
                          const hasNumbers = /\d/.test(value)
                          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
                          
                          if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                            return 'Новый пароль должен содержать заглавные и строчные буквы, цифры и специальные символы'
                          }
                          return true
                        }
                      })}
                    />
                  </InputGroup>
                  {errors.newPassword && (
                    <Text color="red.500" fontSize="sm">{errors.newPassword.message}</Text>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.confirmPassword}>
                  <Field.Label>Повторите новый пароль</Field.Label>
                  <InputGroup
                    endElement={
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    }
                  >
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Повторите новый пароль"
                      {...register('confirmPassword', {
                        required: 'Подтверждение пароля обязательно',
                        validate: (value) => {
                          if (value !== newPassword) {
                            return 'Пароли не совпадают'
                          }
                          return true
                        }
                      })}
                    />
                  </InputGroup>
                  {errors.confirmPassword && (
                    <Text color="red.500" fontSize="sm">{errors.confirmPassword.message}</Text>
                  )}
                </Field.Root>
              </VStack>
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack gap={3}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
              >
                Сменить пароль
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}