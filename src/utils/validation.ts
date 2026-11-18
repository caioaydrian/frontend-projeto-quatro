export function validateEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function cleanCPF(cpf: string): string {
  if (typeof cpf !== "string") return "";
  return cpf.replace(/\D/g, "");
}

export function validateCPF(cpf: string): boolean {
  const digits = cleanCPF(cpf);
  if (digits.length !== 11) return false;

  // Rejeita sequências com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(digits.charAt(i)) * (10 - i);
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10 || firstDigit === 11) firstDigit = 0;
  if (firstDigit !== Number(digits.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(digits.charAt(i)) * (11 - i);
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10 || secondDigit === 11) secondDigit = 0;
  if (secondDigit !== Number(digits.charAt(10))) return false;

  return true;
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
