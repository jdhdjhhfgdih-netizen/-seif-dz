// ==UserScript==
// @name         Gartic.io Mobile Wait Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  تجاوز وقت الانتظار 15 ثانية في Gartic.io للهاتف
// @author       SEIF DZ
// @match        *://gartic.io/*
// @match        *://*.gartic.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // إعدادات الهاتف
    const MOBILE_SETTINGS = {
        enabled: true,
        delay: 1200, // تأخير أطول للهاتف
        useHistoryAPI: true, // يستخدم History API بدلاً من reload
        simpleMode: true, // وضع بسيط للهاتف
        vibration: false // اهتزاز عند النجاح (اختياري)
    };

    // ==================== وظائف الهاتف ====================

    // تنظيف بسيط للهاتف (بدون indexedDB)
    function mobileCleanSession() {
        console.log('[Mobile Bypass] تنظيف خفيف للجلسة');

        // 1. كوكيز أساسية فقط
        const cookies = ['gartic_wait', 'cooldown', 'last_exit', 'game_session'];
        cookies.forEach(cookie => {
            document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        });

        // 2. تنظيف localStorage بذكاء
        const now = Date.now();
        localStorage.setItem('mobile_bypass_time', now.toString());

        // 3. إضافة بارامتر فريد للجلسة
        sessionStorage.setItem('mobile_session', 'm_' + now + '_' + Math.random().toString(36).substr(2, 6));

        return true;
    }

    // إعادة التحميل المناسبة للهاتف
    function mobileReload() {
        if (!MOBILE_SETTINGS.enabled) return;

        console.log('[Mobile Bypass] بدء تجاوز الانتظار للهاتف');

        // تأخير مناسب للهاتف
        setTimeout(() => {
            try {
                // الطريقة الأولى: History API (الأفضل للهاتف)
                if (MOBILE_SETTINGS.useHistoryAPI && 'history' in window) {
                    const currentUrl = new URL(window.location.href);

                    // إزالة بارامترات الانتظار
                    currentUrl.searchParams.delete('wait');
                    currentUrl.searchParams.delete('timeout');

                    // إضافة بارامتر تجاوز
                    currentUrl.searchParams.set('_m', Date.now().toString().substr(-6));
                    currentUrl.searchParams.set('_r', Math.random().toString(36).substr(2, 4));

                    const newUrl = currentUrl.toString();

                    // استخدام replaceState لتغيير العنوان دون إعادة تحميل كامل
                    history.replaceState({mobileBypass: true}, '', newUrl);

                    // إعادة تحميل لطيف
                    setTimeout(() => {
                        location.reload();
                    }, 300);

                } else {
                    // الطريقة الثانية: Reload مع تنظيف الكاش
                    mobileCleanSession();
                    location.reload(true);
                }

                // إشعار اهتزازي (إن كان مدعوماً)
                if (MOBILE_SETTINGS.vibration && 'vibrate' in navigator) {
                    navigator.vibrate(100);
                }

            } catch (error) {
                console.log('[Mobile Bypass] خطأ:', error);
                // طريقة الطوارئ: إعادة التحميل العادية
                location.href = location.href;
            }
        }, MOBILE_SETTINGS.delay);
    }

    // ==================== كشف الهاتف ====================

    // التحقق من أننا على هاتف
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    // ==================== مراقبة للهاتف ====================

    // مراقبة أحداث الهاتف
    function setupMobileEvents() {
        // 1. مراقبة أزرار الخروج (لمس)
        document.addEventListener('touchstart', function(e) {
            const target = e.target;
            const exitBtn = target.closest('#exit, .exit-btn, [data-action="exit"], .btRed');

            if (exitBtn) {
                console.log('[Mobile Bypass] تم لمس زر الخروج');
                localStorage.setItem('mobile_exit_time', Date.now().toString());

                // بدء التجاوز بعد تأخير
                setTimeout(mobileReload, MOBILE_SETTINGS.delay);
            }
        });

        // 2. مراقبة تغيير الصفحة
        let lastPage = location.href;
        setInterval(() => {
            if (location.href !== lastPage) {
                lastPage = location.href;

                // إذا كانت صفحة انتظار
                if (location.href.includes('wait') ||
                    location.search.includes('cooldown') ||
                    document.body.innerText.includes('15 second') ||
                    document.body.innerText.includes('please wait')) {

                    console.log('[Mobile Bypass] تم كشف صفحة انتظار');
                    setTimeout(mobileReload, 800);
                }
            }
        }, 1000);

        // 3. مراقبة رسائل الخطأ
        const originalConsoleError = console.error;
        console.error = function(...args) {
            if (args.some(arg => typeof arg === 'string' &&
                (arg.includes('wait') || arg.includes('cooldown') || arg.includes('15')))) {
                console.log('[Mobile Bypass] تم كشف خطأ انتظار:', args);
                setTimeout(mobileReload, 500);
            }
            return originalConsoleError.apply(this, args);
        };
    }

    // ==================== التهيئة ====================

    // الدالة الرئيسية
    function initMobileBypass() {
        if (!isMobileDevice()) {
            console.log('[Mobile Bypass] ليس هاتفاً، التوقف');
            return;
        }

        if (!MOBILE_SETTINGS.enabled) return;

        console.log('[Mobile Bypass] بدء التشغيل على الهاتف');

        // تنظيف أولي
        mobileCleanSession();

        // إعداد الأحداث
        setupMobileEvents();

        // اختصار الاهتزاز (ثلاث لمسات في الزاوية)
        let cornerTaps = 0;
        document.addEventListener('touchstart', function(e) {
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;

            // الزاوية اليسرى العليا
            if (x < 50 && y < 50) {
                cornerTaps++;

                if (cornerTaps >= 3) {
                    cornerTaps = 0;
                    mobileReload();

                    // اهتزاز تأكيد
                    if ('vibrate' in navigator) {
                        navigator.vibrate([100, 50, 100]);
                    }
                }

                setTimeout(() => { cornerTaps = 0; }, 1000);
            }
        });

        console.log('[Mobile Bypass] جاهز للاستخدام على الهاتف!');
    }

    // ==================== التشغيل ====================

    // بدء التشغيل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileBypass);
    } else {
        setTimeout(initMobileBypass, 1000);
    }

})();
