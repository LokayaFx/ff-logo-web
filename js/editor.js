/**
 * LOKAYA GFX - Official Editor Script
 * Version: 2.1 (Full Stable)
 */

// 1. GLOBAL STATE
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- 2. NAVIGATION & UI LOGIC ---

// 'Create Logo' බටන් එක එබූ විට ක්‍රියාත්මක වේ
window.revealEditor = function() {
    const homeName = document.getElementById("home-name");
    const editorSection = document.getElementById("editor-section");
    const targetName = document.getElementById("target-name");

    if (!homeName || homeName.value.trim() === "") {
        alert("කරුණාකර නමක් ඇතුළත් කරන්න!");
        return;
    }

    // Editor එක පෙන්වීම
    if (editorSection) {
        editorSection.classList.remove("hidden-section");
        // උඩ ටයිප් කරපු නම යටට ගෙන යාම
        if (targetName) targetName.value = homeName.value;
        
        // Character grid එක මුලින්ම සකස් කිරීම
        window.renderCharacters();

        // ස්මූත් විදිහට එඩිටර් එකට ස්ක්‍රෝල් කිරීම
        setTimeout(() => {
            editorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
};

// Slim Header එක පෙන්වීම/සැඟවීම (Scroll කරන විට)
window.onscroll = function() {
    const slimHeader = document.getElementById("slim-header");
    if (slimHeader) {
        if (window.pageYOffset > 350) {
            slimHeader.classList.add("visible");
        } else {
            slimHeader.classList.remove("visible");
        }
    }
};

// 'Coming Soon' ලේයර් එක පාලනය
window.showComingSoon = function() {
    const layer = document.getElementById('coming-soon-layer');
    if (layer) layer.style.display = 'flex';
};

window.hideComingSoon = function() {
    const layer = document.getElementById('coming-soon-layer');
    if (layer) layer.style.display = 'none';
};

// --- 3. MODAL & CHARACTER LOGIC ---

window.toggleModal = function(modalId, show) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');

    if (show) {
        // අනෙක් සියලුම මෝඩල්ස් වසා දැමීම
        document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
        
        if (overlay) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.style.opacity = '1';
                if (modal) modal.classList.add('modal-active');
            }, 10);
        }
    } else {
        window.closeAllModals();
    }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }
};

// ලෝගෝ ස්ටයිල් එක වෙනස් කරන විට (S1, S2, S3)
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    const mainLogoImg = document.getElementById('main-logo');
    
    // ප්‍රධාන රූපය අප්ඩේට් කිරීම
    if (mainLogoImg) {
        mainLogoImg.src = "./assets/logos/s" + styleId + "_c" + window.selectedCharacterId + ".png";
    }
    
    // නව ස්ටයිල් එකට අදාළව කැරැක්ටර් ග්‍රිඩ් එක අලුත් කිරීම
    window.renderCharacters();
};

// කැරැක්ටර් 9ක් පෙන්වන ග්‍රිඩ් එක සෑදීම
window.renderCharacters = function() {
    const charGrid = document.getElementById('char-grid');
    if (!charGrid) return;

    charGrid.innerHTML = ""; // පරණ ඒවා ඉවත් කිරීම
    for (let i = 1; i <= 9; i++) {
        const charDiv = document.createElement("div");
        charDiv.className = "char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all";
        charDiv.onclick = function() { window.selectFinal(this, i); };
        
        charDiv.innerHTML = '<img src="./assets/logos/s' + window.currentLogoStyle + '_c' + i + '.png" class="w-full h-full object-cover" onerror="this.src=\'https://via.placeholder.com/150?text=Error\'">';
        
        charGrid.appendChild(charDiv);
    }
};

// ග්‍රිඩ් එකෙන් කැරැක්ටර් එකක් තේරූ විට
window.selectFinal = function(element, charId) {
    window.selectedCharacterId = charId;
    
    // සිලෙක්ට් කළ බව පෙන්වීමට බෝඩර් එකක් දැමීම
    document.querySelectorAll('.char-item').forEach(item => item.style.borderColor = "rgba(255,255,255,0.1)");
    element.style.borderColor = "#6638A6";

    // ප්‍රධාන ලෝගෝ එක අප්ඩේට් කිරීම
    const mainLogoImg = document.getElementById('main-logo');
    if (mainLogoImg) {
        mainLogoImg.src = "./assets/logos/s" + window.currentLogoStyle + "_c" + charId + ".png";
    }

    // ස්වයංක්‍රීයව මෝඩල් එක වසා දැමීම
    setTimeout(window.closeAllModals, 300);
};

// --- 4. PHOTOPEA RENDERING ENGINE (98% FIX) ---

window.generateFinalLogo = function() {
    // දත්ත ලබා ගැනීම
    const nameVal = (document.getElementById('target-name')?.value || "LOKAYA GFX").toUpperCase();
    const numVal = document.getElementById('target-number')?.value || "";
    const titleVal = (document.getElementById('target-title')?.value || "").toUpperCase();

    // UI Elements
    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderPerc = document.getElementById('render-perc');
    const renderPreview = document.getElementById('render-preview');
    const mainLogo = document.getElementById('main-logo');

    // Rendering තිරය පෙන්වීම
    if (renderScreen) {
        renderScreen.classList.remove('hidden');
        renderScreen.classList.add('flex');
    }
    if (renderPreview && mainLogo) renderPreview.src = mainLogo.src;

    // Loading Progress (0% to 95%)
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 4;
        if (progress > 95) progress = 95;
        if (renderBar) renderBar.style.width = progress + "%";
        if (renderPerc) renderPerc.innerText = Math.floor(progress) + "%";
    }, 450);

    // Paths
    const psdPath = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s" + window.currentLogoStyle + "_c" + window.selectedCharacterId + ".psd";
    const muroFont = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf";

    // Photopea Script
    const photopeaScript = "app.loadFont('" + muroFont + "'); " +
        "function startProcess() { " +
            "if (app.documents.length > 0) { " +
                "var doc = app.activeDocument; " +
                "function update(layerName, text) { " +
                    "try { var l = doc.artLayers.getByName(layerName); l.textItem.contents = text; } catch(e) {} " +
                "} " +
                "update('LogoName', '" + nameVal + "'); " +
                "update('LogoNumber', '" + numVal + "'); " +
                "update('LogoTitle', '" + titleVal + "'); " +
                "doc.saveToOE('png'); " +
            "} " +
        "} " +
        "setTimeout(startProcess, 3500);"; // Font එක ලෝඩ් වීමට කාලය ලබා දීම

    const photopeaConfig = {
        "files": [psdPath, muroFont],
        "script": photopeaScript,
        "serverMode": true
    };

    // Iframe එකක් මගින් Photopea සම්බන්ධ කිරීම
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(photopeaConfig));
    document.body.appendChild(iframe);

    // Photopea එකෙන් රූපය ලැබෙන තෙක් බලා සිටීම
    window.addEventListener("message", function handleResponse(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(progressInterval);
            if (renderBar) renderBar.style.width = "100%";
            if (renderPerc) renderPerc.innerText = "100%";

            const blob = new Blob([e.data], { type: "image/png" });
            const downloadUrl = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "LokayaGFX_" + nameVal + ".png";
            link.click();

            // අවසානයේ Rendering Screen එක වැසීම
            setTimeout(() => {
                if (renderScreen) renderScreen.classList.add('hidden');
                document.body.removeChild(iframe);
            }, 1200);

            window.removeEventListener("message", handleResponse);
        }
    });
};
