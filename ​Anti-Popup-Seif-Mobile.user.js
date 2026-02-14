// ==UserScript==
// @name         SEIF DZ GARTIC.IO SCRIPT 2024 EDITION (No Panel, No Chat Clear, No Encrypted Names)
// @namespace    http://tampermonkey.net/
// @version      2024.1
// @description  SEIF DZ GARTIC.IO SCRIPT 2024 EDITION - بدون واجهة، بدون مسح الشات، بدون أسماء مشفرة
// @author       SEIF DZ
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        none
// ==/UserScript==

if(window.location.href.indexOf("gartic.io")!=-1||window.location.href.indexOf("_cp")!=-1){
    let url,loop,usertype="admin",lastGM,rand,admin="SEIF DZ",cmd,kbotready=0,t,c,ev,ev2,e,lv,res,i

    function f(a){return document.querySelector(a)}
    function fa(a){return document.querySelectorAll(a)}

    function retry(type=""){
        url=window.location.href+type;
        f("#exit").click();
        loop=setInterval(()=>{
            if(document.querySelector("#nprogress")){
                clearInterval(loop);
                loop=setInterval(()=>{
                    if(!document.querySelector("#nprogress")){
                        clearInterval(loop);
                        window.location.href=url
                    }
                },1)
            }
        },1)
    }

    function resetchat(){
        // تم إزالة مسح الشات هنا
        setTimeout(()=>{kbotready=1},300)
    }

    function w(x){
        e=document.querySelector('input[name="chat"]');
        lv=e.value;
        e.value=x;
        ev=new Event('input',{bubbles:true});
        ev.simulated=true;
        t=e._valueTracker;
        if(t){
            t.setValue(lv);
        }
        e.dispatchEvent(ev);
    }

    // تم إزالة دالتين التشفير والفك
    // function en(x){
    //     res="";
    //     for(i in x){
    //         res+=String.fromCharCode(x[i].charCodeAt()+1)
    //     }
    //     return res
    // }

    // function de(x){
    //     res="";
    //     for(i in x){
    //         res+=String.fromCharCode(x[i].charCodeAt()-1)
    //     }
    //     return res
    // }

    window.location.href.indexOf("?bot")!=-1?usertype="bot":0
    window.location.href.indexOf("_cp")!=-1?usertype="kicklibot":0

    localStorage.setItem("cmd","")

    window.addEventListener("keydown",(event)=>{
        if(window.event.keyCode==27){retry()}
        if(window.event.keyCode==192&&usertype=="admin"){
            rand=Math.floor(Math.random()*10000+1);
            localStorage.setItem("cmd", prompt()+"_"+rand)
        }
    })

    setInterval(()=>{
        if(usertype=="admin"&&f("#chat")&&f(".contentPopup")){
            f(".contentPopup.info")?f(".close").click():0;
            // تم إزالة إرسال الاسم المشفر في الشات
            // if(f(".contentPopup").querySelector(".avatar")&&f(".contentPopup").querySelector(".nick")){
            //     for(let i of f("#users").querySelectorAll(".user")){
            //         if(i.querySelector(".nick").innerText==f(".contentPopup").querySelector(".nick").innerText){
            //             w("k "+en(i.querySelector(".nick").innerText))
            //         }
            //     }
            // }
        }

        if(usertype=="kicklibot"&&f("#chat")&&kbotready==1){
            !f(".off")?f("#sounds").click():0;
            f("g")?f("g").remove():0;
            for(let i of f("#chat").querySelectorAll(".msg")){
                if(i.querySelector("strong").innerText==admin&&i.getAttribute("class").indexOf(" ")==-1){
                    cmd=i.querySelector("span").innerText
                    // تم إزالة تغيير نص الشات هنا
                    cmd=="r"?f(".denounce").click():0
                    cmd=="rr"?retry():0
                    // تم تعطيل أمر k للطرد لأنه يعتمد على التشفير
                    // if(cmd.split(" ")[0]=="k"){
                    //     for(let i of f("#users").querySelectorAll(".user")){
                    //         if(i.querySelector(".nick").innerText==de(cmd.split(" ")[1])){
                    //             i.click();
                    //             f(".btYellowBig.ic-votekick").click();
                    //         }
                    //     }
                    // }
                }
            }
        }

        if(usertype=="bot"&&f("#chat")){
            !f(".off")?f("#sounds").click():0;
            f("g")?f("g").remove():0;
            if(lastGM!=localStorage.getItem("cmd")){
                lastGM=localStorage.getItem("cmd")
                lastGM.split("_")[0]=="r"?f(".denounce").click():0
                lastGM.split("_")[0]=="rr"?retry("?bot"):0
            }
        }

        if(document.querySelector(".btYellowBig.ic-yes")){
            if(usertype=="admin"){
                localStorage.setItem("boturl","https://garticbot.tr.gg/?botfromextension="+window.location.href)
            }
            document.querySelector(".btYellowBig.ic-yes").click()
            resetchat()
        }

        f(".btYellowBig.ic-playHome")&&f("#popUp").style.display=="none"&&f(".content.join")?f(".btYellowBig.ic-playHome").click():0
    },50)
          }
