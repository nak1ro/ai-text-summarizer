import {useLanguage} from '@/contexts/LanguageContext';
import {translations, TranslationKeys} from '@/lib/translations';

export function useTranslation() {
    const {language} = useLanguage();
    
    const t = translations[language];
    
    return {t, language};
}

