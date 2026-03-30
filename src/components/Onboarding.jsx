import React, { useState, useEffect } from 'react';
import { Share } from 'lucide-react';
import { useStore } from '../StoreContext';
import { useAppConfig } from '../contexts/AppConfigContext';

const OPTIONS = [
  { id: 'emda', labelKey: 'specs.emda' },
  { id: 'mep', labelKey: 'specs.mep' },
  { id: 'mdb', labelKey: 'specs.mdb' },
  { id: 'ecc', labelKey: 'specs.ecc' }
];

export default function Onboarding() {
  const { setSpecialization, setHasOnboarded } = useStore();
  const { t, theme, setTheme, language, setLanguage } = useAppConfig();
  const [selected, setSelected] = useState('emda');

  const [step, setStep] = useState(1);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(checkIOS);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="h-dvh w-screen bg-white dark:bg-zinc-950 flex flex-col p-6 font-sans transition-colors duration-200">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <div>
              <div className="mb-10 text-center md:text-left">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{t('onboarding.setup_title')}</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-500 mt-2 leading-relaxed">{t('onboarding.setup_subtitle')}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    {t('settings.language')}
                  </label>
                  <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
                    {['de', 'en'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
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

                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    {t('settings.theme')}
                  </label>
                  <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
                    {['light', 'dark', 'system'].map((th) => (
                      <button
                        key={th}
                        onClick={() => setTheme(th)}
                        className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
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

                <div className="pt-6">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition-all"
                  >
                    {t('onboarding.next')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-10 text-center md:text-left">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{t('onboarding.title')}</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-500 mt-2 leading-relaxed">{t('onboarding.subtitle')}</p>
              </div>

              <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/5 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-[20px] shrink-0 mt-0.5">lock</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('onboarding.privacy') }} />
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setSpecialization(selected); setHasOnboarded(true); }} className="space-y-3">
                {OPTIONS.map(opt => (
                  <label key={opt.id}
                    className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                      selected === opt.id ? 'bg-zinc-50 dark:bg-white/5 border-zinc-400 dark:border-zinc-600 shadow-sm dark:shadow-none' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/[0.03] hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <input type="radio" name="spec" value={opt.id} checked={selected === opt.id} onChange={() => setSelected(opt.id)} className="sr-only" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 block">{t(opt.labelKey)}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 block">{t('onboarding.spec')}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selected === opt.id ? 'border-zinc-600 dark:border-zinc-400' : 'border-zinc-300 dark:border-zinc-700'
                    }`}>
                      {selected === opt.id && <div className="w-2 h-2 rounded-full bg-zinc-600 dark:bg-zinc-300" />}
                    </div>
                  </label>
                ))}

                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-500 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-colors">
                    {t('onboarding.back')}
                  </button>
                  <button type="button" onClick={() => { setSpecialization('skipped'); setHasOnboarded(true); }}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-500 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-colors">
                    {t('onboarding.skip')}
                  </button>
                  <button type="submit"
                    className="col-span-2 flex-1 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition-all">
                    {t('onboarding.next')}
                  </button>
                </div>
              </form>

              {/* Conditional PWA Installation UI */}
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/5 text-center">
                {deferredPrompt ? (
                  <button 
                    onClick={handleInstallClick}
                    className="w-full py-3 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    {t('onboarding.install_button')}
                  </button>
                ) : isIOS ? (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/5 rounded-xl text-left">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{t('onboarding.install_button')}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                      <div className="w-6 h-6 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                        <Share size={14} className="text-zinc-900 dark:text-zinc-100" />
                      </div>
                      <span>1. {t('onboarding.ios_install_step1')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="w-6 h-6 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[16px] text-zinc-900 dark:text-zinc-100">add_box</span>
                      </div>
                      <span>2. {t('onboarding.ios_install_step2')}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {t('onboarding.desktop_install_hint')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
