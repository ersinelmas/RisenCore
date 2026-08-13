import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
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
            <FiGlobe aria-hidden />
            {i18n.language === 'en' ? 'EN' : 'TR'}
        </button>
    );
}

export default FixedLanguageSwitcher;
