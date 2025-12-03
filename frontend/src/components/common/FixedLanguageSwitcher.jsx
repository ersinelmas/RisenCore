import { useTranslation } from 'react-i18next';
import styles from './FixedLanguageSwitcher.module.css';

function FixedLanguageSwitcher({ className = '' }) {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`${styles.languageSwitcher} ${className}`}
            aria-label="Change Language"
        >
            <span role="img" aria-label="globe">
                🌐
            </span>
            {i18n.language === 'en' ? 'TR' : 'EN'}
        </button>
    );
}

export default FixedLanguageSwitcher;
