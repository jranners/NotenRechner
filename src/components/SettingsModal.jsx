import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useStore } from '../StoreContext';

export default function SettingsModal({ isOpen, onClose, setActiveTab }) {
  const { theme, setTheme, language, setLanguage, t } = useAppConfig();
  const { resetSpecialization } = useStore();
  const [showResetWarning, setShowResetWarning] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-end md:justify-center font-sans">
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-t-2xl md:rounded-2xl border border-zinc-200 dark:border-white/5 p-6 pb-8 z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('settings.title')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              {t('settings.theme')}
            </label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
              {['light', 'dark', 'system'].map((th) => (
                <button
                  key={th}
                  onClick={() => setTheme(th)}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                    theme === th 
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {t(`settings.${th}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              {t('settings.language')}
            </label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
              {['de', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                    language === lang 
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {t(`settings.${lang}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/5">
          {!showResetWarning ? (
            <button 
              onClick={() => setShowResetWarning(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 hover:bg-red-100 dark:hover:bg-red-400/20 active:scale-[0.98] transition-all"
            >
              {t('settings.reset_spec_btn')}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed bg-red-50 dark:bg-red-400/10 p-3 rounded-lg border border-red-100 dark:border-red-400/20">
                {t('settings.reset_spec_warning')}
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <button 
                  onClick={() => setShowResetWarning(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
                >
                  {t('settings.reset_cancel')}
                </button>
                <button 
                  onClick={() => {
                    resetSpecialization();
                    setShowResetWarning(false);
                    onClose();
                    if (setActiveTab) setActiveTab('schwerpunkt');
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  {t('settings.reset_confirm')}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
