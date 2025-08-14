"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangePassword } from "@/core/api/auth/hooks"
import type { ChangePasswordModalProps, ChangePasswordFormData } from "./types"
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "./constants"

export function ChangePasswordModal({ 
  isOpen, 
  onClose
}: ChangePasswordModalProps) {
  const { t } = useTranslation()
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  
  const changePasswordMutation = useChangePassword()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    mode: "onChange"
  })

  const newPassword = watch("newPassword")

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate({
      current_password: data.currentPassword,
      new_password: data.newPassword,
    }, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('user.changePasswordModal.title')}</DialogTitle>
          <DialogDescription>
            {t('user.changePasswordModal.description')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              {t('user.changePasswordModal.currentPassword')}
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                {...register("currentPassword", {
                  required: t('user.changePasswordModal.validation.currentPasswordRequired'),
                  minLength: {
                    value: 1,
                    message: t('user.changePasswordModal.validation.currentPasswordRequired'),
                  },
                })}
                aria-invalid={!!errors.currentPassword}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {t('user.changePasswordModal.newPassword')}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword", {
                  required: t('user.changePasswordModal.validation.newPasswordRequired'),
                  minLength: {
                    value: PASSWORD_MIN_LENGTH,
                    message: t('user.changePasswordModal.validation.passwordMinLength', { min: PASSWORD_MIN_LENGTH }),
                  },
                  maxLength: {
                    value: PASSWORD_MAX_LENGTH,
                    message: t('user.changePasswordModal.validation.passwordMaxLength', { max: PASSWORD_MAX_LENGTH }),
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: t('user.changePasswordModal.validation.passwordComplexity'),
                  },
                })}
                aria-invalid={!!errors.newPassword}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('user.changePasswordModal.confirmPassword')}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: t('user.changePasswordModal.validation.confirmPasswordRequired'),
                  validate: (value) =>
                    value === newPassword || t('user.changePasswordModal.validation.passwordsDoNotMatch'),
                })}
                aria-invalid={!!errors.confirmPassword}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              className="mr-2"
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={changePasswordMutation.isPending}
            >
              {t('user.changePasswordModal.cancelButton')}
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending 
                ? t('user.changePasswordModal.changingPassword') 
                : t('user.changePasswordModal.changePasswordButton')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}