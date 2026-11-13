import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const combinedClassName = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={combinedClassName} disabled={disabled || isLoading} {...rest}>
      {isLoading ? "Processando..." : children}
    </button>
  );
}

export default Button;
