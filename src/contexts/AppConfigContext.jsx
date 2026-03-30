import React, { createContext, useContext, useState, useEffect } from 'react';

const AppConfigContext = createContext();

export const TRANSLATIONS = {
  de: {
    nav: {
      basis: 'Basis',
      schwerpunkt: 'Schwerpunkt',
      ergaenzung_econ: 'Erg. Econ',
      ergaenzung_mss: 'Erg. MSS',
      thesis: 'Thesis',
      simulator: 'Simulator',
      backup: 'Backup',
      settings: 'Einstellungen',
      areas: 'Bereiche',
      tools: 'Tools'
    },
    app: {
      title: 'Grade Tracker',
      subtitle: 'M.Sc. Economics',
      global_gpa: 'Gesamtschnitt',
    },
    dashboard: {
      ects: 'ECTS',
      average: 'Schnitt',
      completed: 'Abgeschlossen',
      empty: 'Keine Module in diesem Bereich.',
      passed: 'Bestanden',
      grade: 'Note',
      add_module: 'Modul hinzufügen',
      basis: 'Basisbereich',
      schwerpunkt: 'Schwerpunkt',
      ergaenzung_econ: 'Ergänzungsbereich Economics',
      ergaenzung_mss: 'Ergänzungsbereich Management & Social Sciences',
      thesis: 'Masterarbeit',
      select_specialization_title: 'Schwerpunkt wählen',
      select_specialization_hint: 'Bitte wähle eine Spezialisierung, um die Module in diesem Bereich freizuschalten.'
    },
    simulator: {
      title: 'Simulator',
      current: 'Aktuell',
      ects: 'ECTS',
      open: 'Offen',
      target: 'Zielnote',
      done: 'Alle 120 ECTS absolviert.',
      error: 'Zielnote mathematisch nicht erreichbar.',
      success: 'Zielnote wird durch reines Bestehen (4.0) erreicht.',
      path: 'Durchschnitt von {gReq} in den verbleibenden {rem} ECTS nötig.',
      optimal: 'Optimaler Pfad',
      module: 'Module (6 ECTS)',
      thesis: 'Masterarbeit (30 ECTS)'
    },
    backup: {
      title: 'Daten & Backup',
      description: 'Alle Daten liegen lokal im Browser. Erstelle regelmäßig Backups.',
      export: 'Exportieren',
      export_sub: 'Als .json herunterladen',
      import: 'Importieren',
      import_sub: 'Backup wiederherstellen',
      last_export: 'Letzter Export',
      never: 'Noch nie',
      storage: 'Speicher',
      ok_export: 'Backup wurde heruntergeladen.',
      ok_import: 'Import erfolgreich.',
      err_format: 'Ungültiges Format.'
    },
    onboarding: {
      title: 'Willkommen',
      subtitle: 'Wähle deinen Schwerpunkt für das M.Sc. Economics Programm.',
      spec: 'Schwerpunkt',
      skip: 'Überspringen',
      next: 'Weiter',
      privacy: '<strong>Datenschutz-Hinweis:</strong> Diese Applikation funktioniert zu 100% lokal. Es existiert keine externe Datenbank. Alle eingetragenen Noten und Module werden ausschließlich im Speicher deines aktuellen Browsers (LocalStorage) gesichert und verlassen dein Endgerät niemals.',
      install_button: 'App installieren',
      ios_install_step1: 'Tippe auf das Teilen-Symbol',
      ios_install_step2: "Wähle 'Zum Home-Bildschirm'",
      desktop_install_hint: 'Öffne diese App auf deinem Smartphone, um sie als App zu installieren.',
      setup_title: 'Einrichtung',
      setup_subtitle: 'Wähle deine bevorzugte Sprache und das Erscheinungsbild.',
      back: 'Zurück'
    },
    specs: {
      emda: 'Empirical Methods and Data Analysis',
      mep: 'Markets and Economic Policy',
      mdb: 'Market Design and Behavior',
      ecc: 'Energy and Climate Change'
    },
    modals: {
      add_title: 'Modul hinzufügen',
      edit_title: 'Modul bearbeiten',
      delete_title: 'Modul löschen?',
      delete_sub: 'Diese Aktion kann nicht rückgängig gemacht werden.',
      module: 'Modul',
      grade: 'Note',
      date: 'Datum',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      search: 'Suchen...',
      no_results: 'Keine Ergebnisse',
      fill_all: 'Bitte alle Felder ausfüllen.',
      fail: 'Aktion fehlgeschlagen.'
    },
    settings: {
      title: 'Einstellungen',
      theme: 'Erscheinungsbild',
      light: 'Hell',
      dark: 'Dunkel',
      system: 'System',
      language: 'Sprache',
      en: 'English',
      de: 'Deutsch',
      close: 'Schließen',
      reset_spec_btn: 'Schwerpunkt zurücksetzen',
      reset_spec_warning: 'Achtung: Alle Module und Noten im Schwerpunkt werden unwiderruflich entfernt. Andere Bereiche bleiben erhalten.',
      reset_cancel: 'Abbrechen',
      reset_confirm: 'Ja, unwiderruflich löschen'
    }
  },
  en: {
    nav: {
      basis: 'Core',
      schwerpunkt: 'Specialization',
      ergaenzung_econ: 'Elective Econ',
      ergaenzung_mss: 'Elective MSS',
      thesis: 'Thesis',
      simulator: 'Simulator',
      backup: 'Backup',
      settings: 'Settings',
      areas: 'Areas',
      tools: 'Tools'
    },
    app: {
      title: 'Grade Tracker',
      subtitle: 'M.Sc. Economics',
      global_gpa: 'Global GPA',
    },
    dashboard: {
      ects: 'ECTS',
      average: 'Average',
      completed: 'Completed',
      empty: 'No modules in this area.',
      passed: 'Passed',
      grade: 'Grade',
      add_module: 'Add Module',
      basis: 'Core Area',
      schwerpunkt: 'Specialization',
      ergaenzung_econ: 'Elective Economics',
      ergaenzung_mss: 'Elective Management & Social Sciences',
      thesis: 'Master Thesis',
      select_specialization_title: 'Select Specialization',
      select_specialization_hint: 'Please choose a specialization to unlock modules in this area.'
    },
    simulator: {
      title: 'Simulator',
      current: 'Current',
      ects: 'ECTS',
      open: 'Remaining',
      target: 'Target GPA',
      done: 'All 120 ECTS completed.',
      error: 'Target mathematically unreachable.',
      success: 'Target reached by merely passing (4.0).',
      path: 'Average of {gReq} in the remaining {rem} ECTS required.',
      optimal: 'Optimal Path',
      module: 'Modules (6 ECTS)',
      thesis: 'Master Thesis (30 ECTS)'
    },
    backup: {
      title: 'Data & Backup',
      description: 'All data is stored locally in your browser. Create backups regularly.',
      export: 'Export',
      export_sub: 'Download as .json',
      import: 'Import',
      import_sub: 'Restore backup',
      last_export: 'Last Export',
      never: 'Never',
      storage: 'Storage',
      ok_export: 'Backup downloaded successfully.',
      ok_import: 'Import successful.',
      err_format: 'Invalid format.'
    },
    onboarding: {
      title: 'Welcome',
      subtitle: 'Choose your specialization for the M.Sc. Economics program.',
      spec: 'Specialization',
      skip: 'Skip',
      next: 'Continue',
      privacy: '<strong>Privacy Notice:</strong> This application runs 100% locally. There is no external database. All entered grades and modules are exclusively stored in the memory of your current browser (LocalStorage) and never leave your device.',
      install_button: 'Install App',
      ios_install_step1: 'Tap the share icon',
      ios_install_step2: "Select 'Add to Home Screen'",
      desktop_install_hint: 'Open this app on your smartphone to install it as an app.',
      setup_title: 'Setup',
      setup_subtitle: 'Choose your preferred language and appearance.',
      back: 'Back'
    },
    specs: {
      emda: 'Empirical Methods and Data Analysis',
      mep: 'Markets and Economic Policy',
      mdb: 'Market Design and Behavior',
      ecc: 'Energy and Climate Change'
    },
    modals: {
      add_title: 'Add Module',
      edit_title: 'Edit Module',
      delete_title: 'Delete Module?',
      delete_sub: 'This action cannot be undone.',
      module: 'Module',
      grade: 'Grade',
      date: 'Date',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      search: 'Search...',
      no_results: 'No results',
      fill_all: 'Please fill in all fields.',
      fail: 'Action failed.'
    },
    settings: {
      title: 'Settings',
      theme: 'Appearance',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      language: 'Language',
      en: 'English',
      de: 'Deutsch',
      close: 'Close',
      reset_spec_btn: 'Reset Specialization',
      reset_spec_warning: 'Warning: All modules and grades for the specialization area will be permanently deleted. Other areas will remain unchanged.',
      reset_cancel: 'Cancel',
      reset_confirm: 'Yes, permanently delete'
    }
  }
};

export function useAppConfig() {
  return useContext(AppConfigContext);
}

export function AppConfigProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'de';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      let isDark = theme === 'dark';
      if (theme === 'system') {
        isDark = mediaQuery.matches;
      }
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') {
        localStorage.setItem('theme', theme);
    } else {
        localStorage.removeItem('theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (keyStr, placeholders = {}) => {
    const keys = keyStr.split('.');
    let result = TRANSLATIONS[language];
    for (const k of keys) {
      if (!result) return keyStr;
      result = result[k];
    }
    if (!result) return keyStr;
    
    if (typeof result === 'string') {
        return Object.keys(placeholders).reduce((str, pKey) => {
            return str.replace(`{${pKey}}`, placeholders[pKey]);
        }, result);
    }
    return result;
  };

  return (
    <AppConfigContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </AppConfigContext.Provider>
  );
}
