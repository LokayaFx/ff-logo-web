// Global Variables
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- 1. UI & Navigation (Buttons ඔක්කොම වැඩ කරන්න) ---
window.revealEditor = function() {
    const nameInput = document.getElementById("home-name");
    if(!nameInput || !nameInput.value) { alert("Please enter a name!"); return; }
    
    const editorSection = document.getElementById("editor-section");
    if(editorSection) editorSection.classList.remove("hidden-section");
    
    const targetName = document.getElementById("target-name");
    if(targetName) targetName.value = nameInput.value;
    
    window.renderCharacters();
    // Create Logo එබුවම යටට Smooth යන්න
    setTimeout(() => { if(editorSection) editorSection.scrollIntoView({ behavior: 'smooth' }); }, 100);
};

window.toggleModal = function(id, show) {
    const m = document.getElementById(id);
    const o = document.getElementById('modal-overlay');
    if (show && m && o) {
        document.querySelectorAll('.custom-modal').forEach(mod => mod.classList.remove('modal-active'));
        o.style.display = 'block'; 
        setTimeout(() => { m.classList.add('modal-active'); o.style.opacity = '1'; }, 10);
    } else { 
        window.closeAllModals(); 
    }
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

// --- 2. Style & Character Selection ---
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
                <img src="./assets/logos/s${window.currentLogoStyle}_c${i}.png" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150?text=Error'">
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

// --- 3. Photopea Rendering Engine (0% & 98% Fixes + Dual Fonts) ---
window.generateFinalLogo = function() {
    // ?.value පාවිච්චි කරලා තියෙන්නේ HTML එකේ මේ id නැති වුණත් script එක crash නොවෙන්නයි
    const userName = document.getElementById('target-name')?.value || "LOKAYA GFX";
    const userNumber = document.getElementById('target-number')?.value || "";
    const userTitle = document.getElementById('target-title')?.value || "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderStatus = document.getElementById('render-status');
    const renderPerc = document.getElementById('render-perc');

    if(renderScreen) { 
        renderScreen.classList.remove('hidden'); 
        renderScreen.classList.add('flex'); 
    }

    // 0% - 98% ප්‍රශ්නය විසඳන්න Progress Bar එක හදලා තියෙනවා
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 5; 
        if (progress > 95) progress = 95; // Photopea ඉවර වෙනකම් 95% න් නවතිනවා
        if(renderBar) renderBar.style.width = progress + "%";
        if(renderPerc) renderPerc.innerText = Math.floor(progress) + "%";
        if(renderStatus) renderStatus.innerText = "Processing in Photopea... " + Math.floor(progress) + "%";
    }, 400);

    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const muroFontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const photopeaConfig = {
        "files": [psdUrl, muroFontUrl],
        "script": `
            function updateLayer(layerName, textValue, fontName) {
                try {
                    var layer = app.activeDocument.artLayers.getByName(layerName);
                    layer.textItem.contents = textValue;
                    if(fontName) { layer.textItem.font = fontName; }
                } catch(e) {} // Error එකක් ආවත් හිර වෙන්නේ නැහැ
            }

            function runExport() {
                if (app.documents.length > 0) {
                    updateLayer("LogoName", "${userName.toUpperCase()}", "Muro-Regular");
                    updateLayer("LogoNumber", "${userNumber}", "BebasNeue-Regular");
                    updateLayer("LogoTitle", "${userTitle.toUpperCase()}", "Muro-Regular");
                    
                    app.activeDocument.saveToOE("png");
                }
            }

            // Photopea එකට PSD එක load වෙන්න තත්පර 2ක් දෙනවා
            setTimeout(runExport, 2000);
        `,
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
            if(renderStatus) renderStatus.innerText = "Download Ready!";
            
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = \`LokayaGFX_\${userName}.png\`;
            a.click();
            
            setTimeout(() => { 
                if(renderScreen) renderScreen.classList.add('hidden'); 
                document.body.removeChild(iframe); 
            }, 1500);
            window.removeEventListener("message", handleMsg);
        }
    });
};
        
