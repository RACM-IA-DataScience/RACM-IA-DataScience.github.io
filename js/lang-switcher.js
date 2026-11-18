/**
 * Global Language Switcher Dropdown Controller (ES / EN)
 * RACM - AI & Data Science
 */
(function () {
    'use strict';

    function initLanguageSwitchers() {
        const switchers = document.querySelectorAll('[data-lang-switcher]');
        if (!switchers.length) return;

        switchers.forEach((switcher) => {
            const btn = switcher.querySelector('.lang-switcher-btn');
            const options = switcher.querySelectorAll('.lang-option');
            if (!btn) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = switcher.classList.toggle('open');
                btn.setAttribute('aria-expanded', String(isOpen));
            });

            options.forEach((opt) => {
                opt.addEventListener('click', () => {
                    const lang = opt.getAttribute('hreflang');
                    if (lang) {
                        try {
                            localStorage.setItem('racm_lang', lang);
                        } catch (_) {}
                    }
                });
            });
        });

        document.addEventListener('click', (e) => {
            switchers.forEach((switcher) => {
                if (!switcher.contains(e.target)) {
                    switcher.classList.remove('open');
                    const btn = switcher.querySelector('.lang-switcher-btn');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                switchers.forEach((switcher) => {
                    switcher.classList.remove('open');
                    const btn = switcher.querySelector('.lang-switcher-btn');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSwitchers);
    } else {
        initLanguageSwitchers();
    }
})();
