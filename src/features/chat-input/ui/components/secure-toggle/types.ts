export type SecureToggleProps = {
  isSecure: boolean;
  onToggle: (secure: boolean) => void;
  disabled?: boolean;
};