export function validateEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function cleanCPF(cpf: string): string {
  if (typeof cpf !== "string") return "";
  return cpf.replace(/\D/g, "");
}

export interface PasswordLevelResult {
  isValid: boolean;
  level: "Weak" | "Medium" | "Strong";
  message?: string;
}

export function validatePasswordLevel(password: string): PasswordLevelResult {
  if (typeof password !== "string" || password.length < 8) {
    return {
      isValid: false,
      level: "Weak",
      message: "Password must have at least 8 characters.",
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (criteriaCount < 3) {
    return {
      isValid: false,
      level: "Weak",
      message:
        "Password must meet at least 3 of: uppercase, lowercase, number, or special character.",
    };
  }

  const level = criteriaCount === 4 ? "Strong" : "Medium";

  return {
    isValid: true,
    level,
  };
}

export function formatCPF(value: string): string {
  const digits = cleanCPF(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}
