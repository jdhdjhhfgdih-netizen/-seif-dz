// ==UserScript==
// @name           سبامر سيف
// @description    سبامر قوي لجارترك - نسخة نظيفة
// @version        1.2
// @author         سيف
// @license        N/A
// @match          *://gartic.io/*
// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_addStyle
// @grant          GM_openInTab
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x
// ==/UserScript==

(function() {
    let originalSend = WebSocket.prototype.send, setTrue = false;
    window.wsObj = {};

    WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = 1;
            window.wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    console.log(data);
                    if (data[0] == 5) {
                        window.wsObj.lengthID = data[1];
                        window.wsObj.id = data[2];
                        window.wsObj.roomCode = data[3];
                    }
                } catch (err) {}
            });
        }
    };

    // زر الإيقاف والتشغيل السريع
    var quickSpamButton = document.createElement("button");
    quickSpamButton.style.position = "fixed";
    quickSpamButton.style.left = "5px";
    quickSpamButton.style.bottom = "5px";
    quickSpamButton.style.background = "#000000";
    quickSpamButton.style.color = "#ffffff";
    quickSpamButton.style.border = "2px solid #ff0000";
    quickSpamButton.style.padding = "6px 12px";
    quickSpamButton.style.borderRadius = "8px";
    quickSpamButton.style.cursor = "pointer";
    quickSpamButton.style.zIndex = "100000";
    quickSpamButton.style.fontWeight = "bold";
    quickSpamButton.style.fontSize = "12px";
    quickSpamButton.style.width = "70px";
    quickSpamButton.style.height = "35px";
    quickSpamButton.innerHTML = "تشغيل";

    let quickSpamInterval = null;
    let isQuickSpamRunning = false;
    const spamMessage = "ههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههه";

    quickSpamButton.addEventListener("click", function() {
        if (!isQuickSpamRunning) {
            quickSpamInterval = setInterval(function() {
                if (window.wsObj && window.wsObj.id) {
                    const invisibleChar = String.fromCharCode(8203);
                    const randomInvisibleChars = invisibleChar.repeat(Math.floor(Math.random() * 3) + 1);

                    const message1 = `42[11,${window.wsObj.id},"${spamMessage}"]`;
                    const message2 = `42[11,${window.wsObj.id},"${spamMessage}${randomInvisibleChars}"]`;
                    const message3 = `42[11,${window.wsObj.id},"${spamMessage}"]`;

                    window.wsObj.send(message1);
                    window.wsObj.send(message2);
                    window.wsObj.send(message3);
                }
            }, 2450);

            quickSpamButton.innerHTML = "إيقاف";
            quickSpamButton.style.background = "#990000";
            isQuickSpamRunning = true;
        } else {
            if (quickSpamInterval) {
                clearInterval(quickSpamInterval);
                quickSpamInterval = null;
            }
            quickSpamButton.innerHTML = "تشغيل";
            quickSpamButton.style.background = "#000000";
            isQuickSpamRunning = false;
        }
    });

    document.body.appendChild(quickSpamButton);
})();
