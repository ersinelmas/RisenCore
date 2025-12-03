import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../services/authService";
import styles from "./LoginPage.module.css";
import AuthLayout from "../components/auth/AuthLayout";
import { useTranslation } from "react-i18next";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authService.register({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      toast.success(t("auth.registerSuccess"));
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || t("auth.registerFailed");
      toast.error(errorMessage);
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{t("auth.createAccount")}</h1>
        <p className={styles.subtitle}>{t("auth.startStructuring")}</p>

        <form onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName" className={styles.label}>
              {t("auth.firstName")}
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName" className={styles.label}>
              {t("auth.lastName")}
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              {t("auth.username")}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              {t("auth.email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              {t("auth.password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
            </button>
          </div>
        </form>

        <p className={styles.linkText}>
          {t("auth.alreadyHaveAccount")} <Link to="/login">{t("auth.signIn")}</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
