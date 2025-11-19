import {Language} from '@/contexts/LanguageContext';

export const translations = {
    en: {
        // Header
        title: 'AI Text Summarizer',
        subtitle: 'Paste your text or upload an image and get instant AI-powered analysis',
        pasteImageTip: '💡 Tip: You can paste images directly with Ctrl+V (Cmd+V on Mac)',
        
        // Input modes
        textMode: 'Text',
        imageMode: 'Image',
        documentMode: 'Document',
        youtubeMode: 'YouTube',
        
        // Text input
        yourText: 'Your Text',
        textPlaceholder: 'Paste or type your text here (up to 5,000 characters)...',
        
        // Image input
        uploadOrPasteImage: 'Upload or Paste Image',
        chooseImage: 'Choose Image',
        uploadImageDesc: 'Upload an image with text (max 5MB)',
        uploadedImage: 'Uploaded Image',
        extractedText: 'Extracted Text:',
        
        // Document input
        uploadDocument: 'Upload Document',
        clickToUpload: 'Click to upload document',
        documentFormats: 'PDF, DOCX, DOC, or TXT (max 10MB)',
        uploadedDocument: 'Uploaded Document',
        comingSoon: 'Coming Soon!',
        documentComingSoonDesc: 'Document text extraction is currently under development. This feature will support PDF, Word, and plain text documents.',
        
        // YouTube input
        youtubeUrl: 'YouTube Video URL',
        youtubeComingSoonDesc: 'YouTube transcript extraction is currently under development. This feature will allow you to extract and analyze text from video transcripts automatically.',
        
        // Actions
        analyze: 'Analyze',
        analyzing: 'Analyzing...',
        
        // Analysis Settings
        analysisSettings: 'Analysis Settings',
        summaryLength: 'Summary Length',
        analysisStyle: 'Analysis Style',
        
        // Summary Length Options
        short: 'Short',
        medium: 'Medium',
        long: 'Long',
        shortDescription: 'Concise overview',
        mediumDescription: 'Balanced detail',
        longDescription: 'Comprehensive analysis',
        
        // Analysis Style Options
        academic: 'Academic',
        casual: 'Casual',
        technical: 'Technical',
        academicDescription: 'Formal, scholarly',
        casualDescription: 'Conversational, friendly',
        technicalDescription: 'Professional, precise',
        
        // History
        analysisHistory: 'History',
        view: 'View',
        clearHistory: 'Clear All',
        noHistory: 'No analysis history yet',
        noHistoryDesc: 'Your analyses will appear here after you run them',
        
        // Sidebar
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        
        // Tips
        tipCtrlEnter: 'Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to analyze',
        tipCtrlV: 'Tip: Press Ctrl+V (Cmd+V on Mac) to paste an image from clipboard',
        
        // Drag and Drop
        dragDropImage: 'Drag & drop your image here',
        dropImageHere: 'Drop your image here!',
        dragDropDocument: 'Drag & drop or click to upload',
        dropDocumentHere: 'Drop your document here!',
        or: 'or',
        
        // Results
        summary: 'Summary',
        keyPoints: 'Key Points',
        simpleExplanation: 'Simple Explanation',
        readingTimeStats: 'Reading Time & Stats',
        estimatedReadingTime: 'Estimated reading time',
        totalWordCount: 'Total word count',
        minute: 'minute',
        minutes: 'minutes',
        word: 'word',
        words: 'words',
        
        // Copy actions
        copy: 'Copy',
        copied: 'copied to clipboard!',
        
        // Errors
        error: 'Error',
        noTextInImage: 'No text was found in the uploaded image. Please upload an image containing text.',
        
        // Language names
        languages: {
            en: 'English',
            es: 'Español',
            de: 'Deutsch',
            fr: 'Français',
            pl: 'Polski',
        },
    },
    es: {
        // Header
        title: 'Resumen de Texto con IA',
        subtitle: 'Pegue su texto o suba una imagen y obtenga análisis instantáneo con IA',
        pasteImageTip: '💡 Consejo: Puede pegar imágenes directamente con Ctrl+V (Cmd+V en Mac)',
        
        // Input modes
        textMode: 'Texto',
        imageMode: 'Imagen',
        documentMode: 'Documento',
        youtubeMode: 'YouTube',
        
        // Text input
        yourText: 'Su Texto',
        textPlaceholder: 'Pegue o escriba su texto aquí (hasta 5,000 caracteres)...',
        
        // Image input
        uploadOrPasteImage: 'Subir o Pegar Imagen',
        chooseImage: 'Elegir Imagen',
        uploadImageDesc: 'Suba una imagen con texto (máx. 5MB)',
        uploadedImage: 'Imagen Subida',
        extractedText: 'Texto Extraído:',
        
        // Document input
        uploadDocument: 'Subir Documento',
        clickToUpload: 'Haga clic para subir documento',
        documentFormats: 'PDF, DOCX, DOC o TXT (máx. 10MB)',
        uploadedDocument: 'Documento Subido',
        comingSoon: '¡Próximamente!',
        documentComingSoonDesc: 'La extracción de texto de documentos está en desarrollo. Esta función admitirá PDF, Word y documentos de texto sin formato.',
        
        // YouTube input
        youtubeUrl: 'URL del Video de YouTube',
        youtubeComingSoonDesc: 'La extracción de transcripciones de YouTube está en desarrollo. Esta función le permitirá extraer y analizar texto de transcripciones de video automáticamente.',
        
        // Actions
        analyze: 'Analizar',
        analyzing: 'Analizando...',
        
        // Analysis Settings
        analysisSettings: 'Configuración de Análisis',
        summaryLength: 'Longitud del Resumen',
        analysisStyle: 'Estilo de Análisis',
        
        // Summary Length Options
        short: 'Corto',
        medium: 'Medio',
        long: 'Largo',
        shortDescription: 'Resumen conciso',
        mediumDescription: 'Detalle equilibrado',
        longDescription: 'Análisis completo',
        
        // Analysis Style Options
        academic: 'Académico',
        casual: 'Casual',
        technical: 'Técnico',
        academicDescription: 'Formal, erudito',
        casualDescription: 'Conversacional, amigable',
        technicalDescription: 'Profesional, preciso',
        
        // History
        analysisHistory: 'Historial',
        view: 'Ver',
        clearHistory: 'Limpiar Todo',
        noHistory: 'Aún no hay historial de análisis',
        noHistoryDesc: 'Tus análisis aparecerán aquí después de ejecutarlos',
        
        // Sidebar
        settings: 'Configuración',
        language: 'Idioma',
        theme: 'Tema',
        
        // Tips
        tipCtrlEnter: 'Consejo: Presione Ctrl+Enter (Cmd+Enter en Mac) para analizar',
        tipCtrlV: 'Consejo: Presione Ctrl+V (Cmd+V en Mac) para pegar una imagen desde el portapapeles',
        
        // Drag and Drop
        dragDropImage: 'Arrastra y suelta tu imagen aquí',
        dropImageHere: '¡Suelta tu imagen aquí!',
        dragDropDocument: 'Arrastra y suelta o haz clic para subir',
        dropDocumentHere: '¡Suelta tu documento aquí!',
        or: 'o',
        
        // Results
        summary: 'Resumen',
        keyPoints: 'Puntos Clave',
        simpleExplanation: 'Explicación Simple',
        readingTimeStats: 'Tiempo de Lectura y Estadísticas',
        estimatedReadingTime: 'Tiempo estimado de lectura',
        totalWordCount: 'Recuento total de palabras',
        minute: 'minuto',
        minutes: 'minutos',
        word: 'palabra',
        words: 'palabras',
        
        // Copy actions
        copy: 'Copiar',
        copied: 'copiado al portapapeles!',
        
        // Errors
        error: 'Error',
        noTextInImage: 'No se encontró texto en la imagen subida. Por favor suba una imagen que contenga texto.',
        
        // Language names
        languages: {
            en: 'English',
            es: 'Español',
            de: 'Deutsch',
            fr: 'Français',
            pl: 'Polski',
        },
    },
    de: {
        // Header
        title: 'KI-Textzusammenfassung',
        subtitle: 'Fügen Sie Ihren Text ein oder laden Sie ein Bild hoch und erhalten Sie sofortige KI-gestützte Analyse',
        pasteImageTip: '💡 Tipp: Sie können Bilder direkt mit Strg+V (Cmd+V auf Mac) einfügen',
        
        // Input modes
        textMode: 'Text',
        imageMode: 'Bild',
        documentMode: 'Dokument',
        youtubeMode: 'YouTube',
        
        // Text input
        yourText: 'Ihr Text',
        textPlaceholder: 'Text hier einfügen oder eingeben (bis zu 5.000 Zeichen)...',
        
        // Image input
        uploadOrPasteImage: 'Bild Hochladen oder Einfügen',
        chooseImage: 'Bild Wählen',
        uploadImageDesc: 'Bild mit Text hochladen (max. 5MB)',
        uploadedImage: 'Hochgeladenes Bild',
        extractedText: 'Extrahierter Text:',
        
        // Document input
        uploadDocument: 'Dokument Hochladen',
        clickToUpload: 'Zum Hochladen klicken',
        documentFormats: 'PDF, DOCX, DOC oder TXT (max. 10MB)',
        uploadedDocument: 'Hochgeladenes Dokument',
        comingSoon: 'Demnächst!',
        documentComingSoonDesc: 'Die Dokumenttextextraktion befindet sich derzeit in Entwicklung. Diese Funktion wird PDF-, Word- und Nur-Text-Dokumente unterstützen.',
        
        // YouTube input
        youtubeUrl: 'YouTube-Video-URL',
        youtubeComingSoonDesc: 'Die YouTube-Transkriptextraktion befindet sich derzeit in Entwicklung. Diese Funktion ermöglicht es Ihnen, Text aus Videotranskripten automatisch zu extrahieren und zu analysieren.',
        
        // Actions
        analyze: 'Analysieren',
        analyzing: 'Analysiere...',
        
        // Analysis Settings
        analysisSettings: 'Analyseeinstellungen',
        summaryLength: 'Zusammenfassungslänge',
        analysisStyle: 'Analysestil',
        
        // Summary Length Options
        short: 'Kurz',
        medium: 'Mittel',
        long: 'Lang',
        shortDescription: 'Kurze Übersicht',
        mediumDescription: 'Ausgewogenes Detail',
        longDescription: 'Umfassende Analyse',
        
        // Analysis Style Options
        academic: 'Akademisch',
        casual: 'Lässig',
        technical: 'Technisch',
        academicDescription: 'Formal, wissenschaftlich',
        casualDescription: 'Gesprächig, freundlich',
        technicalDescription: 'Professionell, präzise',
        
        // History
        analysisHistory: 'Verlauf',
        view: 'Ansehen',
        clearHistory: 'Alle löschen',
        noHistory: 'Noch kein Analyseverlauf',
        noHistoryDesc: 'Ihre Analysen werden hier angezeigt, nachdem Sie sie ausgeführt haben',
        
        // Sidebar
        settings: 'Einstellungen',
        language: 'Sprache',
        theme: 'Design',
        
        // Tips
        tipCtrlEnter: 'Tipp: Drücken Sie Strg+Enter (Cmd+Enter auf Mac) zum Analysieren',
        tipCtrlV: 'Tipp: Drücken Sie Strg+V (Cmd+V auf Mac), um ein Bild aus der Zwischenablage einzufügen',
        
        // Drag and Drop
        dragDropImage: 'Bild hierher ziehen und ablegen',
        dropImageHere: 'Bild hier ablegen!',
        dragDropDocument: 'Ziehen und ablegen oder klicken zum Hochladen',
        dropDocumentHere: 'Dokument hier ablegen!',
        or: 'oder',
        
        // Results
        summary: 'Zusammenfassung',
        keyPoints: 'Hauptpunkte',
        simpleExplanation: 'Einfache Erklärung',
        readingTimeStats: 'Lesezeit & Statistiken',
        estimatedReadingTime: 'Geschätzte Lesezeit',
        totalWordCount: 'Gesamtwortanzahl',
        minute: 'Minute',
        minutes: 'Minuten',
        word: 'Wort',
        words: 'Wörter',
        
        // Copy actions
        copy: 'Kopieren',
        copied: 'in die Zwischenablage kopiert!',
        
        // Errors
        error: 'Fehler',
        noTextInImage: 'Im hochgeladenen Bild wurde kein Text gefunden. Bitte laden Sie ein Bild mit Text hoch.',
        
        // Language names
        languages: {
            en: 'English',
            es: 'Español',
            de: 'Deutsch',
            fr: 'Français',
            pl: 'Polski',
        },
    },
    fr: {
        // Header
        title: 'Résumé de Texte IA',
        subtitle: 'Collez votre texte ou téléchargez une image et obtenez une analyse instantanée par IA',
        pasteImageTip: '💡 Astuce: Vous pouvez coller des images directement avec Ctrl+V (Cmd+V sur Mac)',
        
        // Input modes
        textMode: 'Texte',
        imageMode: 'Image',
        documentMode: 'Document',
        youtubeMode: 'YouTube',
        
        // Text input
        yourText: 'Votre Texte',
        textPlaceholder: 'Collez ou tapez votre texte ici (jusqu\'à 5 000 caractères)...',
        
        // Image input
        uploadOrPasteImage: 'Télécharger ou Coller une Image',
        chooseImage: 'Choisir une Image',
        uploadImageDesc: 'Téléchargez une image avec du texte (max. 5 Mo)',
        uploadedImage: 'Image Téléchargée',
        extractedText: 'Texte Extrait:',
        
        // Document input
        uploadDocument: 'Télécharger un Document',
        clickToUpload: 'Cliquez pour télécharger un document',
        documentFormats: 'PDF, DOCX, DOC ou TXT (max. 10 Mo)',
        uploadedDocument: 'Document Téléchargé',
        comingSoon: 'Bientôt Disponible!',
        documentComingSoonDesc: 'L\'extraction de texte de documents est actuellement en développement. Cette fonctionnalité prendra en charge les documents PDF, Word et texte brut.',
        
        // YouTube input
        youtubeUrl: 'URL de la Vidéo YouTube',
        youtubeComingSoonDesc: 'L\'extraction de transcriptions YouTube est actuellement en développement. Cette fonctionnalité vous permettra d\'extraire et d\'analyser automatiquement le texte des transcriptions vidéo.',
        
        // Actions
        analyze: 'Analyser',
        analyzing: 'Analyse en cours...',
        
        // Analysis Settings
        analysisSettings: 'Paramètres d\'Analyse',
        summaryLength: 'Longueur du Résumé',
        analysisStyle: 'Style d\'Analyse',
        
        // Summary Length Options
        short: 'Court',
        medium: 'Moyen',
        long: 'Long',
        shortDescription: 'Aperçu concis',
        mediumDescription: 'Détail équilibré',
        longDescription: 'Analyse complète',
        
        // Analysis Style Options
        academic: 'Académique',
        casual: 'Décontracté',
        technical: 'Technique',
        academicDescription: 'Formel, savant',
        casualDescription: 'Conversationnel, amical',
        technicalDescription: 'Professionnel, précis',
        
        // History
        analysisHistory: 'Historique',
        view: 'Voir',
        clearHistory: 'Tout effacer',
        noHistory: 'Aucun historique d\'analyse pour le moment',
        noHistoryDesc: 'Vos analyses apparaîtront ici après les avoir exécutées',
        
        // Sidebar
        settings: 'Paramètres',
        language: 'Langue',
        theme: 'Thème',
        
        // Tips
        tipCtrlEnter: 'Astuce: Appuyez sur Ctrl+Entrée (Cmd+Entrée sur Mac) pour analyser',
        tipCtrlV: 'Astuce: Appuyez sur Ctrl+V (Cmd+V sur Mac) pour coller une image du presse-papiers',
        
        // Drag and Drop
        dragDropImage: 'Glissez et déposez votre image ici',
        dropImageHere: 'Déposez votre image ici !',
        dragDropDocument: 'Glissez et déposez ou cliquez pour télécharger',
        dropDocumentHere: 'Déposez votre document ici !',
        or: 'ou',
        
        // Results
        summary: 'Résumé',
        keyPoints: 'Points Clés',
        simpleExplanation: 'Explication Simple',
        readingTimeStats: 'Temps de Lecture & Statistiques',
        estimatedReadingTime: 'Temps de lecture estimé',
        totalWordCount: 'Nombre total de mots',
        minute: 'minute',
        minutes: 'minutes',
        word: 'mot',
        words: 'mots',
        
        // Copy actions
        copy: 'Copier',
        copied: 'copié dans le presse-papiers!',
        
        // Errors
        error: 'Erreur',
        noTextInImage: 'Aucun texte n\'a été trouvé dans l\'image téléchargée. Veuillez télécharger une image contenant du texte.',
        
        // Language names
        languages: {
            en: 'English',
            es: 'Español',
            de: 'Deutsch',
            fr: 'Français',
            pl: 'Polski',
        },
    },
    pl: {
        // Header
        title: 'Podsumowanie Tekstu AI',
        subtitle: 'Wklej tekst lub prześlij obraz i uzyskaj natychmiastową analizę AI',
        pasteImageTip: '💡 Wskazówka: Możesz wklejać obrazy bezpośrednio za pomocą Ctrl+V (Cmd+V na Mac)',
        
        // Input modes
        textMode: 'Tekst',
        imageMode: 'Obraz',
        documentMode: 'Dokument',
        youtubeMode: 'YouTube',
        
        // Text input
        yourText: 'Twój Tekst',
        textPlaceholder: 'Wklej lub wpisz tekst tutaj (do 5000 znaków)...',
        
        // Image input
        uploadOrPasteImage: 'Prześlij lub Wklej Obraz',
        chooseImage: 'Wybierz Obraz',
        uploadImageDesc: 'Prześlij obraz z tekstem (maks. 5MB)',
        uploadedImage: 'Przesłany Obraz',
        extractedText: 'Wyodrębniony Tekst:',
        
        // Document input
        uploadDocument: 'Prześlij Dokument',
        clickToUpload: 'Kliknij, aby przesłać dokument',
        documentFormats: 'PDF, DOCX, DOC lub TXT (maks. 10MB)',
        uploadedDocument: 'Przesłany Dokument',
        comingSoon: 'Wkrótce!',
        documentComingSoonDesc: 'Ekstrakcja tekstu z dokumentów jest obecnie w fazie rozwoju. Ta funkcja będzie obsługiwać dokumenty PDF, Word i zwykły tekst.',
        
        // YouTube input
        youtubeUrl: 'URL Wideo YouTube',
        youtubeComingSoonDesc: 'Ekstrakcja transkrypcji YouTube jest obecnie w fazie rozwoju. Ta funkcja pozwoli automatycznie wyodrębniać i analizować tekst z transkrypcji wideo.',
        
        // Actions
        analyze: 'Analizuj',
        analyzing: 'Analizowanie...',
        
        // Analysis Settings
        analysisSettings: 'Ustawienia Analizy',
        summaryLength: 'Długość Podsumowania',
        analysisStyle: 'Styl Analizy',
        
        // Summary Length Options
        short: 'Krótki',
        medium: 'Średni',
        long: 'Długi',
        shortDescription: 'Zwięzły przegląd',
        mediumDescription: 'Zrównoważony szczegół',
        longDescription: 'Kompleksowa analiza',
        
        // Analysis Style Options
        academic: 'Akademicki',
        casual: 'Swobodny',
        technical: 'Techniczny',
        academicDescription: 'Formalny, naukowy',
        casualDescription: 'Konwersacyjny, przyjazny',
        technicalDescription: 'Profesjonalny, precyzyjny',
        
        // History
        analysisHistory: 'Historia',
        view: 'Zobacz',
        clearHistory: 'Wyczyść Wszystko',
        noHistory: 'Brak historii analiz',
        noHistoryDesc: 'Twoje analizy pojawią się tutaj po ich wykonaniu',
        
        // Sidebar
        settings: 'Ustawienia',
        language: 'Język',
        theme: 'Motyw',
        
        // Tips
        tipCtrlEnter: 'Wskazówka: Naciśnij Ctrl+Enter (Cmd+Enter na Mac), aby analizować',
        tipCtrlV: 'Wskazówka: Naciśnij Ctrl+V (Cmd+V na Mac), aby wkleić obraz ze schowka',
        
        // Drag and Drop
        dragDropImage: 'Przeciągnij i upuść obraz tutaj',
        dropImageHere: 'Upuść obraz tutaj!',
        dragDropDocument: 'Przeciągnij i upuść lub kliknij, aby przesłać',
        dropDocumentHere: 'Upuść dokument tutaj!',
        or: 'lub',
        
        // Results
        summary: 'Podsumowanie',
        keyPoints: 'Kluczowe Punkty',
        simpleExplanation: 'Proste Wyjaśnienie',
        readingTimeStats: 'Czas Czytania i Statystyki',
        estimatedReadingTime: 'Szacowany czas czytania',
        totalWordCount: 'Całkowita liczba słów',
        minute: 'minuta',
        minutes: 'minuty',
        word: 'słowo',
        words: 'słowa',
        
        // Copy actions
        copy: 'Kopiuj',
        copied: 'skopiowano do schowka!',
        
        // Errors
        error: 'Błąd',
        noTextInImage: 'Nie znaleziono tekstu w przesłanym obrazie. Proszę przesłać obraz zawierający tekst.',
        
        // Language names
        languages: {
            en: 'English',
            es: 'Español',
            de: 'Deutsch',
            fr: 'Français',
            pl: 'Polski',
        },
    },
} as const;

export type TranslationKeys = typeof translations.en;

