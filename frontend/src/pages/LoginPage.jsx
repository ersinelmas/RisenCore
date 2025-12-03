import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./LoginPage.module.css";
import AuthLayout from "../components/auth/AuthLayout";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success(t("auth.loginSuccess"));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        t("auth.loginFailed");
      toast.error(errorMessage);
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{t("auth.welcomeBack")}</h1>
        <p className={styles.subtitle}>
          {t("auth.enterCredentials")}
        </p>

        <form onSubmit={handleLogin}>
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
              autoComplete="username"
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
              className={styles.input}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? t("auth.signingIn") : t("auth.signIn")}
            </button>
          </div>
        </form>

        <p className={styles.linkText}>
          {t("auth.dontHaveAccount")} <Link to="/register">{t("auth.createOne")}</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
