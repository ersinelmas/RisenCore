import { useTranslation } from 'react-i18next';
import styles from './FixedLanguageSwitcher.module.css';

function FixedLanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const currentLang = i18n.language || 'en';
        const newLang = currentLang.startsWith('en') ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    const isEnglish = (i18n.language || 'en').startsWith('en');

    return (
        <button
            onClick={toggleLanguage}
            className={styles.languageSwitcher}
            title={isEnglish ? "Switch to Turkish" : "İngilizceye Geç"}
        >
            {isEnglish ? '🇹🇷 TR' : '🇬🇧 EN'}
        </button>
    );
}

export default FixedLanguageSwitcher;
