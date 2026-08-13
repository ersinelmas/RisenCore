import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
import styles from './LanguageSwitcher.module.css';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    // i18n.language might be 'en-US' or 'tr-TR', so check startsWith
    const isEnglish = (i18n.language || 'en').startsWith('en');
    const currentLang = isEnglish ? 'en' : 'tr';
    const targetLang = isEnglish ? 'tr' : 'en';

    const toggleLanguage = () => {
        i18n.changeLanguage(targetLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className={styles.switcher}
            title={isEnglish ? "Switch to Turkish" : "İngilizceye Geç"}
        >
            <FiGlobe /> <span>{currentLang.toUpperCase()}</span>
        </button>
    );
}

export default LanguageSwitcher;
