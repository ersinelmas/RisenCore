import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        // i18n.language might be 'en-US' or 'tr-TR', so check startsWith
        const currentLang = i18n.language || 'en';
        const newLang = currentLang.startsWith('en') ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    const isEnglish = (i18n.language || 'en').startsWith('en');

    return (
        <button
            onClick={toggleLanguage}
            className={styles.switcher}
            title={isEnglish ? "Switch to Turkish" : "İngilizceye Geç"}
        >
            {isEnglish ? '🇹🇷 Türkçe' : '🇬🇧 English'}
        </button>
    );
}

export default LanguageSwitcher;
