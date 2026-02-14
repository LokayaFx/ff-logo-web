// 1. variables global විදිහට window object එකට දාමු
window.currentLogoStyle = 1;
window.selectedCharacterId = 1; 

// 2. Style Change Function
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    const mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = `./assets/logos/s${styleId}_c${window.selectedCharacterId}.png`;
    }
    window.renderCharacters();
};

// 3. Characters Grid Function
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="window.selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer active:scale-95 transition-all">
                <img src="./assets/logos/s${window.currentLogoStyle}_c${i}.png" class="w-full h-full object-cover">
            </div>`;
    }
};

// 4. Character Select Function
window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId;
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    const mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = `./assets/logos/s${window.currentLogoStyle}_c${charId}.png`;
    }
    window.closeAllModals();
    const ed = document.getElementById("editor-section");
    if(ed) ed.scrollIntoView({ behavior: 'smooth' });
};

// 5. Logo Render Function (Dual Font + 98% Fix)
window.generateFinalLogo = function() {
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    const userNumber = document.getElementById('target-number')?.value || "";
    const userTitle = document.getElementById('target-title').value || "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');

    if(renderScreen) { renderScreen.classList.remove('hidden'); renderScreen.classList.add('flex'); }

    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const muroFontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const photopeaConfig = {
        "files": [psdUrl, muroFontUrl],
        "script": `
            app.loadFont("${muroFontUrl}");
            function runExport() {
                if (app.documents.length > 0) {
                    var doc = app.activeDocument;
                    function setLayer(name, val, font) {
                        try {
                            var l = doc.artLayers.getByName(name);
                            l.textItem.contents = val;
                            if(font) l.textItem.font = font;
                        } catch(e) {}
                    }
                    setLayer("LogoName", "${userName.toUpperCase()}", "Muro-Regular");
                    setLayer("LogoNumber", "${userNumber}", "BebasNeue-Regular");
                    setLayer("LogoTitle", "${userTitle.toUpperCase()}", "Muro-Regular");
                    app.activeDocument.saveToOE("png");
                }
            }
            setTimeout(runExport, 2000); // PSD එක Load වෙන්න තත්පර 2ක් දෙනවා
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

// UI Functions
window.revealEditor = function() {
    const name = document.getElementById("home-name").value;
    if(!name) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = name;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

window.toggleModal = function(id, show) {
    const m = document.getElementById(id);
    const o = document.getElementById('modal-overlay');
    if (show && m && o) {
        document.querySelectorAll('.custom-modal').forEach(mod => mod.classList.remove('modal-active'));
        o.style.display = 'block'; 
        setTimeout(() => { m.classList.add('modal-active'); o.style.opacity = '1'; }, 10);
    } else { window.closeAllModals(); }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const o = document.getElementById('modal-overlay');
    if(o) { o.style.opacity = '0'; setTimeout(() => { o.style.display = 'none'; }, 400); }
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
    if(header) header.classList.toggle("visible", window.pageYOffset > 300);
};
