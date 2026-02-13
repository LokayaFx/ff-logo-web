window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// 1. Style එක මාරු කිරීම (Modal එක වැහෙන්නේ නැත)
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    const mainImg = document.getElementById('main-logo');
    if(mainImg) mainImg.src = `./assets/logos/s${styleId}_c${window.selectedCharacterId}.png`;
    window.renderCharacters();
};

// 2. ග්‍රිඩ් එකේ Characters පෙන්වීම
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer active:scale-95 transition-all">
                <img src="./assets/logos/s${window.currentLogoStyle}_c${i}.png" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150?text=Error'">
            </div>`;
    }
};

// 3. Character එකක් තෝරාගත් පසු Modal එක වැසීම
window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId;
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    const mainImg = document.getElementById('main-logo');
    if(mainImg) mainImg.src = `./assets/logos/s${window.currentLogoStyle}_c${charId}.png`;
    
    window.closeAllModals(); // මෙතනදී තමයි Modal එක වහන්නේ
};

// 4. Logo එක Render කිරීම (Simplified Photopea Script)
window.generateFinalLogo = function() {
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    const userNumber = document.getElementById('target-number')?.value || "";
    const userTitle = document.getElementById('target-title')?.value || "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    if(renderScreen) { renderScreen.classList.remove('hidden'); renderScreen.classList.add('flex'); }

    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const fontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const photopeaConfig = {
        "files": [psdUrl, fontUrl], // Font එක මෙතනදීම දෙන නිසා Muro error එක එන්නේ නැහැ
        "script": `
            var doc = app.activeDocument;
            function setText(name, val) {
                try {
                    var l = doc.artLayers.getByName(name);
                    l.textItem.contents = val;
                    l.textItem.font = "Muro-Regular"; 
                } catch(e) {}
            }
            setText("LogoName", "${userName.toUpperCase()}");
            setText("LogoNumber", "${userNumber}");
            setText("LogoTitle", "${userTitle.toUpperCase()}");
            app.activeDocument.saveToOE("png");
        `,
        "serverMode": true
    };

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(photopeaConfig));
    document.body.appendChild(iframe);

    window.addEventListener("message", function handleMsg(e) {
        if (e.data instanceof ArrayBuffer) {
            if(renderBar) renderBar.style.width = "100%";
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = "Logo.png";
            a.click();
            setTimeout(() => { renderScreen.classList.add('hidden'); document.body.removeChild(iframe); }, 1000);
            window.removeEventListener("message", handleMsg);
        }
    });
};

// 5. UI Helpers (Modal වැසීමට)
window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const o = document.getElementById('modal-overlay');
    if(o) { o.style.opacity = '0'; setTimeout(() => o.style.display = 'none', 400); }
};

window.toggleModal = function(id, show) {
    const m = document.getElementById(id);
    const o = document.getElementById('modal-overlay');
    if (show && m && o) { o.style.display = 'block'; setTimeout(() => m.classList.add('modal-active'), 10); }
    else { window.closeAllModals(); }
};

window.revealEditor = function() {
    document.getElementById("editor-section").classList.remove("hidden-section");
    window.renderCharacters();
};
                
