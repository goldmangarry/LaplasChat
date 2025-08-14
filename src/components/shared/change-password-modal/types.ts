export type ChangePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
}

export type ChangePasswordFormData = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}