// ==UserScript==
// @name         Gartic.io Quick Exit - SEIF DZ
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  زر بسيط للخروج السريع وإعادة الدخول - يعمل على Firefox Mobile
// @author       SEIF DZ
// @match        *://gartic.io/*
// @match        *://*.gartic.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // إنشاء الزر
    function createButton() {
        const btn = document.createElement('div');
        btn.id = 'seif-quick-exit';
        btn.textContent = 'SEIF DZ';
        btn.title = 'اضغط للخروج السريع وإعادة الدخول';

        btn.style.cssText = `
            position: fixed !important;
            width: 55px !important;
            height: 55px !important;
            background: #000000 !important;
            color: #FF3333 !important;
            border: 2px solid #FF0000 !important;
            border-radius: 50% !important;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.8) !important;
            z-index: 999999 !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: Arial Black, sans-serif !important;
            font-weight: 900 !important;
            font-size: 12px !important;
            text-shadow: 0 0 8px rgba(255, 50, 50, 1) !important;
            right: 15px !important;
            bottom: 15px !important;
            user-select: none !important;
            opacity: 0.9 !important;
            transition: all 0.2s ease !important;
        `;

        // حدث النقر
        btn.onclick = function() {
            quickExitRejoin();
        };

        document.body.appendChild(btn);
        console.log('[SEIF DZ] ✅ الزر جاهز');
        return btn;
    }

    // وظيفة الخروج السريع (بنفس طريقة سكربتك الناجح)
    function quickExitRejoin() {
        console.log('[SEIF DZ] 🚀 بدء الخروج السريع...');

        const currentUrl = window.location.href;
        const button = document.getElementById('seif-quick-exit');

        if (button) {
            button.style.transform = 'scale(0.9)';
            button.style.opacity = '0.7';
        }

        // الخطوة 1: البحث عن زر الخروج والضغط عليه
        let exitButton = document.querySelector('#exit') ||
                        document.querySelector('.bt-exit') ||
                        document.querySelector('.exit-btn');

        if (exitButton) {
            console.log('[SEIF DZ] ✅ وجد زر الخروج');
            exitButton.click();

            // الخطوة 2: انتظار الخروج ثم إعادة التحميل
            setTimeout(() => {
                console.log('[SEIF DZ] 🔄 إعادة تحميل...');
                window.location.href = currentUrl;
            }, 800);

        } else {
            console.log('[SEIF DZ] ⚠️ لم أجد زر الخروج');

            // محاولة الضغط في الزاوية العلوية اليمنى
            const xBtn = document.elementFromPoint(window.innerWidth - 30, 30);
            if (xBtn && xBtn.click) {
                xBtn.click();
                setTimeout(() => {
                    window.location.href = currentUrl;
                }, 800);
            } else {
                // إذا فشل كل شيء، إعادة تحميل مباشرة
                window.location.reload();
            }
        }

        // استعادة مظهر الزر
        setTimeout(() => {
            if (button) {
                button.style.transform = '';
                button.style.opacity = '0.9';
            }
        }, 300);
    }

    // بدء التشغيل
    setTimeout(createButton, 2000);

    // إشعار ترحيبي
    setTimeout(() => {
        const note = document.createElement('div');
        note.textContent = '🔴 SEIF DZ - اضغط للخروج السريع';
        note.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 61, 0, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            z-index: 999998;
            font-size: 12px;
            font-weight: bold;
        `;
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    }, 2500);

})();
