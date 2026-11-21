import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useAuth } from "../../contexts/useAuth";
import { getUserById, updateUser } from "../../services/users";
import {
  cleanCPF,
  formatCPF,
  validateCPF,
  validatePasswordLevel,
} from "../../utils/validation";
import { Button, Input } from "../../components";
import styles from "./Profile.module.css";

interface FieldErrors {
  name?: string;
  cpf?: string;
  password?: string;
  confirmPassword?: string;
}

export function Profile() {
  const { user, updateCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        setApiError(null);
        const data = await getUserById(user.id);
        if (isMounted) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            cpf: formatCPF(data.cpf || ""),
            role: data.role || "client",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        if (isMounted) {
          setApiError(err instanceof Error ? err.message : "Failed to load profile information.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const passwordStrength = formData.password ? validatePasswordLevel(formData.password) : null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatCPF(value) : value,
    }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    }

    const rawCpf = cleanCPF(formData.cpf);
    if (!rawCpf) {
      errors.cpf = "CPF is required.";
    } else if (!validateCPF(formData.cpf)) {
      errors.cpf = "Please enter a valid CPF.";
    }

    const passwordCheck = validatePasswordLevel(formData.password);
    if (!formData.password) {
      errors.password = "Password is required to confirm profile changes.";
    } else if (!passwordCheck.isValid) {
      errors.password = passwordCheck.message || "Password is too weak.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!user?.id) {
      setApiError("User is not authenticated.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const rawCpf = cleanCPF(formData.cpf);

      const response = await updateUser(user.id, {
        name: formData.name.trim(),
        cpf: rawCpf,
        password: formData.password,
        role: formData.role,
      });

      const updatedUserData = response.user || {
        ...user,
        name: formData.name.trim(),
        cpf: rawCpf,
      };

      setSuccessMessage(response.message || "Profile updated successfully.");
      updateCurrentUser(updatedUserData);

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingContainer}>Loading profile details...</div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span aria-hidden="true" />
            <span>Account</span>
          </div>
          <h1 className={styles.title}>
            User <em>Profile</em>
          </h1>
          <p className={styles.subtitle}>
            Update your personal account credentials and details.
          </p>
        </div>

        {apiError && (
          <div className={styles.alertError} role="alert">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className={styles.alertSuccess} role="status">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.staticField}>
            <span className={styles.staticLabel}>Role</span>
            <span className={styles.badge}>{formData.role}</span>
          </div>

          <div className={styles.staticField}>
            <label htmlFor="profile-email" className={styles.staticLabel}>
              Email Address (Cannot be modified)
            </label>
            <input
              id="profile-email"
              type="text"
              className={styles.staticValue}
              value={formData.email}
              readOnly
              disabled
            />
          </div>

          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={fieldErrors.name}
            placeholder="Jane Doe"
            required
            disabled={isSubmitting}
          />

          <Input
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            error={fieldErrors.cpf}
            placeholder="000.000.000-00"
            required
            disabled={isSubmitting}
          />

          <Input
            label="New / Current Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            placeholder="••••••••"
            required
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          {formData.password && passwordStrength && (
            <div className={styles.passwordMeter}>
              <div className={styles.meterBars}>
                <div
                  className={`${styles.bar} ${
                    passwordStrength.level === "Weak"
                      ? styles.barActiveWeak
                      : passwordStrength.level === "Medium"
                      ? styles.barActiveMedium
                      : styles.barActiveStrong
                  }`}
                />
                <div
                  className={`${styles.bar} ${
                    passwordStrength.level === "Medium"
                      ? styles.barActiveMedium
                      : passwordStrength.level === "Strong"
                      ? styles.barActiveStrong
                      : ""
                  }`}
                />
                <div
                  className={`${styles.bar} ${
                    passwordStrength.level === "Strong" ? styles.barActiveStrong : ""
                  }`}
                />
              </div>
              <span
                className={`${styles.meterText} ${
                  passwordStrength.level === "Weak"
                    ? styles.meterWeak
                    : passwordStrength.level === "Medium"
                    ? styles.meterMedium
                    : styles.meterStrong
                }`}
              >
                Strength: {passwordStrength.level}
              </span>
            </div>
          )}

          <p className={styles.passwordHelp}>
            Must be at least 8 characters and include 3 of the following: uppercase, lowercase,
            number, or special character.
          </p>

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
            placeholder="••••••••"
            required
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
