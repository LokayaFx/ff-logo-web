l// 1. මුලින්ම පාවිච්චි කරන Variables
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- 2. UI පාලනය (Navigation & Modals) ---

window.revealEditor = function() {
    const nameInput = document.getElementById("home-name");
    if(!nameInput || !nameInput.value) {
        alert("Please enter a name first!");
        return;
    }
    
    const editor = document.getElementById("editor-section");
    editor.classList.remove("hidden-section");
    
    document.getElementById("target-name").value = nameInput.value;
    
    window.renderCharacters();
    
    setTimeout(() => {
        editor.scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

window.toggleModal = function(id, show) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById('modal-overlay');
    
    if (show) {
        document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
        if(overlay) overlay.style.display = 'block';
        setTimeout(() => {
            if(modal) modal.classList.add('modal-active');
            if(overlay) overlay.style.opacity = '1';
        }, 10);
    } else {
        window.closeAllModals();
    }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const overlay = document.getElementById('modal-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }
};

window.showComingSoon = function() { 
    const c = document.getElementById('coming-soon-layer');
    if(c) c.style.display = 'flex'; 
};

window.hideComingSoon = function() { 
    const c = document.getElementById('coming-soon-layer');
    if(c) c.style.display = 'none'; 
};

window.onscroll = function() {
    const header = document.getElementById("slim-header");
    if(header) {
        if (window.pageYOffset > 300) header.classList.add("visible");
        else header.classList.remove("visible");
    }
};

// --- 3. Logo & Character Logic ---

window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    const mainImg = document.getElementById('main-logo');
    if(mainImg) mainImg.src = "./assets/logos/s" + styleId + "_c" + window.selectedCharacterId + ".png";
    window.renderCharacters();
};

window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += '<div onclick="window.selectFinal(this, ' + i + ')" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all"><img src="./assets/logos/s' + window.currentLogoStyle + '_c' + i + '.png" class="w-full h-full object-cover"></div>';
    }
};

window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId;
    
    document.querySelectorAll('.char-item').forEach(item => item.style.borderColor = "rgba(255,255,255,0.1)");
    el.style.borderColor = "#6638A6";
    
    const mainImg = document.getElementById('main-logo');
    if(mainImg) mainImg.src = "./assets/logos/s" + window.currentLogoStyle + "_c" + charId + ".png";
    window.closeAllModals();
};

// --- 4. Photopea Engine (Rendering) ---

window.generateFinalLogo = function() {
    const userNameInput = document.getElementById('target-name');
    const userNumberInput = document.getElementById('target-number');
    const userTitleInput = document.getElementById('target-title');

    const userName = userNameInput ? userNameInput.value : "LOKAYA GFX";
    const userNumber = userNumberInput ? userNumberInput.value : "";
    const userTitle = userTitleInput ? userTitleInput.value : "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderPerc = document.getElementById('render-perc');
    const renderPreview = document.getElementById('render-preview');
    const mainLogo = document.getElementById('main-logo');

    if(renderScreen) {
        renderScreen.classList.remove('hidden');
        renderScreen.classList.add('flex');
    }
    if(renderPreview && mainLogo) {
        renderPreview.src = mainLogo.src;
    }

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 95) progress = 95;
        if(renderBar) renderBar.style.width = progress + "%";
        if(renderPerc) renderPerc.innerText = Math.floor(progress) + "%";
    }, 400);

    const psdUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s" + window.currentLogoStyle + "_c" + window.selectedCharacterId + ".psd";
    const muroFontUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf";

    // Syntax Error එක ආවේ මේ හරියේ තිබ්බ බැක්ටික් (` `) අවුලක් නිසා. දැන් ඒක හරි.
    const photopeaConfig = {
        "files": [psdUrl, muroFontUrl],
        "script": "app.loadFont('" + muroFontUrl + "'); function run() { if (app.documents.length > 0) { var doc = app.activeDocument; function setT(layerName, val, font) { try { var l = doc.artLayers.getByName(layerName); l.textItem.contents = val; if(font) l.textItem.font = font; } catch(e) {} } setT('LogoName', '" + userName.toUpperCase() + "', 'Muro-Regular'); setT('LogoNumber', '" + userNumber + "', 'BebasNeue-Regular'); setT('LogoTitle', '" + userTitle.toUpperCase() + "', 'Muro-Regular'); app.activeDocument.saveToOE('png'); } } setTimeout(run, 2500);",
        "serverMode": true
    };

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(photopeaConfig));
    document.body.appendChild(iframe);

    window.addEventListener("message", function handleMsg(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(progressInterval);
            if(renderBar) renderBar.style.width = "100%";
            if(renderPerc) renderPerc.innerText = "100%";
            
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = "LokayaGFX_" + userName + ".png";
            a.click();
            
            setTimeout(() => {
                if(renderScreen) renderScreen.classList.add('hidden');
                document.body.removeChild(iframe);
            }, 1000);
            window.removeEventListener("message", handleMsg);
        }
    });
};
