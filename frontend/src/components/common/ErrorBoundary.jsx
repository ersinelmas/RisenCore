import { Component } from "react";
import { withTranslation } from "react-i18next";
import styles from "./ErrorBoundary.module.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const {
      children,
      t,
      titleKey = "common.errorTitle",
      messageKey = "common.errorMessage",
      retryLabelKey = "common.retry",
    } = this.props;

    if (this.state.hasError) {
      return (
        <div className={styles.container} role="alert">
          <div className={styles.icon} aria-hidden>
            ⚠️
          </div>
          <div className={styles.texts}>
            <h2 className={styles.title}>{t(titleKey)}</h2>
            <p className={styles.message}>{t(messageKey)}</p>
          </div>
          {this.props.onReset && (
            <button className={styles.retryButton} onClick={this.handleReset}>
              {t(retryLabelKey)}
            </button>
          )}
        </div>
      );
    }

    return children;
  }
}

const TranslatedErrorBoundary = withTranslation()(ErrorBoundary);

export default TranslatedErrorBoundary;
