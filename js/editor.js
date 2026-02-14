window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// 1. Style & Character Selection
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    const mainImg = document.getElementById('main-logo');
    if(mainImg) mainImg.src = `./assets/logos/s${styleId}_c${window.selectedCharacterId}.png`;
    window.renderCharacters();
};

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

window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId;
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    const mainImg = document.getElementById('main-logo');
    if(mainImg) mainImg.src = `./assets/logos/s${window.currentLogoStyle}_c${charId}.png`;
    window.closeAllModals();
    const ed = document.getElementById("editor-section");
    if(ed) ed.scrollIntoView({ behavior: 'smooth' });
};

// 2. Main Rendering Function (0% Fix)
window.generateFinalLogo = function() {
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    const userNumber = document.getElementById('target-number')?.value || "";
    const userTitle = document.getElementById('target-title').value || "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderStatus = document.getElementById('render-status');

    if(renderScreen) { renderScreen.classList.remove('hidden'); renderScreen.classList.add('flex'); }
    if(renderStatus) renderStatus.innerText = "Connecting to Photopea...";

    // GitHub ලින්ක් එක හරියටම තියෙනවද බලන්න
    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const muroFontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const photopeaConfig = {
        "files": [psdUrl, muroFontUrl],
        "script": `
            // Script එක පටන් ගන්න කලින් පොඩි වෙලාවක් ඉමු
            function start() {
                if (app.documents.length > 0) {
                    var doc = app.activeDocument;
                    function setLayer(name, val, font) {
                        try {
                            var l = doc.artLayers.getByName(name);
                            l.textItem.contents = val;
                            if(font) l.textItem.font = font;
                        } catch(e) { console.log("Missing layer: " + name); }
                    }
                    
                    app.loadFont("${muroFontUrl}");
                    
                    setLayer("LogoName", "${userName.toUpperCase()}", "Muro-Regular");
                    setLayer("LogoNumber", "${userNumber}", "BebasNeue-Regular");
                    setLayer("LogoTitle", "${userTitle.toUpperCase()}", "BebasNeue-Regular");
                    
                    app.activeDocument.saveToOE("png");
                }
            }
            // 0% හිර නොවෙන්න මෙතන තත්පර 3ක් ඉමු
            setTimeout(start, 3000);
        `,
        "serverMode": true
    };

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(photopeaConfig));
    document.body.appendChild(iframe);

    // Progress Bar එකට පොඩි ගැම්මක් දෙමු
    let prog = 0;
    const pInt = setInterval(() => {
        prog += 5;
        if(prog > 95) prog = 95;
        if(renderBar) renderBar.style.width = prog + "%";
        if(renderStatus) renderStatus.innerText = "Processing Logo... " + prog + "%";
    }, 500);

    window.addEventListener("message", function handleMsg(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(pInt);
            if(renderBar) renderBar.style.width = "100%";
            if(renderStatus) renderStatus.innerText = "Download Ready!";
            
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = \`Logo_\${userName}.png\`;
            a.click();
            
            setTimeout(() => { 
                renderScreen.classList.add('hidden'); 
                document.body.removeChild(iframe); 
            }, 1000);
            window.removeEventListener("message", handleMsg);
        }
    });
};

// UI Functions
window.revealEditor = function() {
    const n = document.getElementById("home-name").value;
    if(!n) { alert("Enter Name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = n;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

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
