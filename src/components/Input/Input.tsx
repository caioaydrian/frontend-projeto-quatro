import { useId, type InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  id: customId,
  required,
  className = "",
  disabled,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = customId || generatedId;

  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        id={inputId}
        required={required}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...rest}
      />

      {error ? (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={`${inputId}-helper`} className={styles.helper}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}

export default Input;
