// ==UserScript==
// @name         Gartic.io Auto Click Room Play - FIXED
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ينقر تلقائياً على زر Play بعد اختيار غرفة من القائمة
// @author       SEIF DZ
// @match        *://gartic.io/*
// @match        *://*.gartic.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let isLookingForPlayButton = false;

    // 1. مراقبة النقر على أي غرفة في القائمة
    document.addEventListener('click', function(event) {
        // البحث عن العنصر المُنقر الذي يمثل بطاقة غرفة (بناءً على هيكل الصفحة)
        const roomCard = event.target.closest('a, div, button, li');
        if (roomCard) {
            // تحقق بسيط إذا كان النقر في منطقة قد تكون غرفة (يمكنك تعديل هذا الشرط)
            const cardText = roomCard.textContent || '';
            if (cardText.includes('玩家') || cardText.includes('#')) {
                console.log('[Gartic Auto] تم النقر على غرفة محتملة. بانتظار ظهور زر Play...');
                isLookingForPlayButton = true;

                // إعادة تعيين الحالة بعد فترة إذا لم يظهر الزر
                setTimeout(() => { isLookingForPlayButton = false; }, 8000);
            }
        }
    });

    // 2. البحث المستمر عن زر Play بعد النقر على غرفة
    function searchAndClickPlayButton() {
        if (!isLookingForPlayButton) return;

        // محاولة العثور على زر Play بأي من الأسماء المحتملة
        // يمكن إضافة المزيد من المحددات إذا لزم الأمر
        const playButtonSelectors = [
            'button:contains("Play")',
            'button:contains("PLAY")',
            'button:contains("بلاي")',
            'button:contains("انضم")',
            '.btYellowBig',
            '[class*="play"]',
            '[class*="join"]'
        ];

        for (const selector of playButtonSelectors) {
            try {
                const buttons = document.querySelectorAll(selector);
                for (const btn of buttons) {
                    // تأكد أن الزر ظاهر وممكن النقر عليه
                    if (btn.offsetParent !== null && !btn.disabled) {
                        const btnText = btn.textContent || '';
                        if (btnText.match(/play|بلاي|join|انضم/i)) {
                            console.log('[Gartic Auto] عثر على زر Play، جاري النقر عليه!', btn);
                            btn.click();
                            isLookingForPlayButton = false; // توقف عن البحث بعد النجاح
                            return;
                        }
                    }
                }
            } catch(e) {}
        }
    }

    // تشغيل البحث كل نصف ثانية
    setInterval(searchAndClickPlayButton, 500);
})();
