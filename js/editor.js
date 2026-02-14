// ==========================================
// LOKAYA GFX - STABLE EDITOR SCRIPT
// ==========================================

// --- Global Variables ---
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- 1. UI Navigation Functions ---

// මුල් පිටුවේ "Create Logo" බටන් එක එබූ විට
window.revealEditor = function() {
    var homeNameInput = document.getElementById("home-name");
    var editorSection = document.getElementById("editor-section");
    var targetNameInput = document.getElementById("target-name");

    if (!homeNameInput || homeNameInput.value.trim() === "") {
        alert("Please enter your name first!");
        return;
    }

    // එඩිටර් එක පෙන්වීම
    if (editorSection) {
        editorSection.classList.remove("hidden-section");
        // නම පහළ input එකට කොපි කිරීම
        if (targetNameInput) targetNameInput.value = homeNameInput.value;
        
        // Character grid එක මුලින්ම පෙන්වීම
        window.renderCharacters();

        // ස්මූත් විදිහට එඩිටර් එකට යෑම
        setTimeout(function() {
            editorSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
};

// Modal පාලනය (Style සහ Character මාරු කිරීමට)
window.toggleModal = function(id, show) {
    var modal = document.getElementById(id);
    var overlay = document.getElementById('modal-overlay');
    if (show) {
        document.querySelectorAll('.custom-modal').forEach(function(m) { m.classList.remove('modal-active'); });
        if (overlay) {
            overlay.style.display = 'block';
            setTimeout(function() {
                overlay.style.opacity = '1';
                if (modal) modal.classList.add('modal-active');
            }, 10);
        }
    } else {
        window.closeAllModals();
    }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(function(m) { m.classList.remove('modal-active'); });
    var overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(function() { overlay.style.display = 'none'; }, 400);
    }
};

// Coming Soon ලේයර් පාලනය
window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

// Scroll කරන විට header එක පෙන්වීම
window.onscroll = function() {
    var header = document.getElementById("slim-header");
    if (header) {
        if (window.pageYOffset > 300) header.classList.add("visible");
        else header.classList.remove("visible");
    }
};

// --- 2. Logo & Character Logic ---

// Logo Style එක වෙනස් කිරීම (S1, S2, S3)
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    var mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        mainLogo.src = "./assets/logos/s" + styleId + "_c" + window.selectedCharacterId + ".png";
    }
    window.renderCharacters();
};

// Character grid එක ඇතුළේ images පෙන්වීම
window.renderCharacters = function() {
    var grid = document.getElementById('char-grid');
    if (!grid) return;
    grid.innerHTML = "";
    for (var i = 1; i <= 9; i++) {
        var card = document.createElement("div");
        card.className = "char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all";
        card.onclick = (function(idx) {
            return function() { window.selectFinal(this, idx); };
        })(i);
        card.innerHTML = '<img src="./assets/logos/s' + window.currentLogoStyle + '_c' + i + '.png" class="w-full h-full object-cover">';
        grid.appendChild(card);
    }
};

// Character එකක් තෝරාගත් පසු
window.selectFinal = function(element, charId) {
    window.selectedCharacterId = charId;
    document.querySelectorAll('.char-item').forEach(function(item) { item.style.borderColor = "rgba(255,255,255,0.1)"; });
    element.style.borderColor = "#6638A6";
    
    var mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        mainLogo.src = "./assets/logos/s" + window.currentLogoStyle + "_c" + charId + ".png";
    }
    window.closeAllModals();
};

// --- 3. Photopea Render Engine (98% Fix) ---

window.generateFinalLogo = function() {
    var name = (document.getElementById('target-name').value || "LOKAYA GFX").toUpperCase();
    var num = document.getElementById('target-number').value || "";
    var title = (document.getElementById('target-title').value || "").toUpperCase();

    var screen = document.getElementById('render-screen');
    var bar = document.getElementById('render-bar');
    var perc = document.getElementById('render-perc');

    if (screen) { screen.classList.remove('hidden'); screen.classList.add('flex'); }

    // Fake progress animation
    var progress = 0;
    var interval = setInterval(function() {
        progress += Math.random() * 4;
        if (progress > 95) progress = 95;
        if (bar) bar.style.width = progress + "%";
        if (perc) perc.innerText = Math.floor(progress) + "%";
    }, 400);

    var psdUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s" + window.currentLogoStyle + "_c" + window.selectedCharacterId + ".psd";
    var fontUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf";

    // Photopea එක ඇතුළේ දුවන script එක
    // මෙතන තත්පර 4ක delay එකක් දැම්මා font එක load වෙන්න
    var pScript = "app.loadFont('" + fontUrl + "'); " +
        "function run() { " +
            "if (app.documents.length > 0) { " +
                "var doc = app.activeDocument; " +
                "function setLayerText(layerName, text) { " +
                    "try { var l = doc.artLayers.getByName(layerName); l.textItem.contents = text; } catch(e) {} " +
                "} " +
                "setLayerText('LogoName', '" + name + "'); " +
                "setLayerText('LogoNumber', '" + num + "'); " +
                "setLayerText('LogoTitle', '" + title + "'); " +
                "doc.saveToOE('png'); " +
            "} " +
        "} " +
        "setTimeout(run, 4000);";

    var config = { "files": [psdUrl, fontUrl], "script": pScript, "serverMode": true };
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(config));
    document.body.appendChild(iframe);

    window.addEventListener("message", function handleMsg(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(interval);
            if (bar) bar.style.width = "100%";
            if (perc) perc.innerText = "100%";
            
            var url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            var a = document.createElement("a");
            a.href = url;
            a.download = "Logo_" + name + ".png";
            a.click();
            
            setTimeout(function() {
                if (screen) screen.classList.add('hidden');
                document.body.removeChild(iframe);
            }, 1000);
            window.removeEventListener("message", handleMsg);
        }
    });
};
                
