// --- Global Data ---
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- UI Logic ---
window.revealEditor = function() {
    const nameInput = document.getElementById("home-name");
    if(!nameInput || !nameInput.value) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = nameInput.value;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

window.updateCurrentLogo = function(style) {
    window.currentLogoStyle = style;
    document.getElementById('main-logo').src = "./assets/logos/s" + style + "_c" + window.selectedCharacterId + ".png";
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

window.selectFinal = function(el, id) {
    window.selectedCharacterId = id;
    document.getElementById('main-logo').src = "./assets/logos/s" + window.currentLogoStyle + "_c" + id + ".png";
    window.closeAllModals();
};

window.toggleModal = function(id, show) {
    if(show) {
        document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
        document.getElementById('modal-overlay').style.display = 'block';
        setTimeout(() => { document.getElementById(id).classList.add('modal-active'); document.getElementById('modal-overlay').style.opacity = '1'; }, 10);
    } else { window.closeAllModals(); }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    document.getElementById('modal-overlay').style.opacity = '0';
    setTimeout(() => { document.getElementById('modal-overlay').style.display = 'none'; }, 400);
};

window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

// --- Photopea Rendering Engine (THE FIX) ---
window.generateFinalLogo = function() {
    const name = (document.getElementById('target-name').value || "LOKAYA GFX").toUpperCase();
    const num = document.getElementById('target-number').value || "";
    const title = (document.getElementById('target-title').value || "").toUpperCase();

    const screen = document.getElementById('render-screen');
    const bar = document.getElementById('render-bar');
    const perc = document.getElementById('render-perc');

    screen.classList.remove('hidden');
    screen.classList.add('flex');

    let progress = 0;
    const interval = setInterval(() => {
        progress += 2; if (progress > 98) progress = 98;
        bar.style.width = progress + "%";
        perc.innerText = Math.floor(progress) + "%";
    }, 400);

    const psd = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s" + window.currentLogoStyle + "_c" + window.selectedCharacterId + ".psd";
    const font = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf";

    // මේ Script එක තමයි Photopea එක ඇතුළේ වැඩ කරන්නේ
    const pScript = "app.loadFont('" + font + "'); " +
                   "function start() { " +
                   "  if(app.documents.length > 0) { " +
                   "    var d = app.activeDocument; " +
                   "    function set(n, v) { try { d.artLayers.getByName(n).textItem.contents = v; } catch(e) {} } " +
                   "    set('LogoName', '" + name + "'); " +
                   "    set('LogoNumber', '" + num + "'); " +
                   "    set('LogoTitle', '" + title + "'); " +
                   "    app.activeDocument.saveToOE('png'); " +
                   "  } " +
                   "} " +
                   "setTimeout(start, 5000);"; // Font එක load වෙන්න තත්පර 5ක් දෙනවා

    const config = { "files": [psd, font], "script": pScript, "serverMode": true };

    // 1. කලින්ම listener එක දාගන්නවා
    const handleMessage = function(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(interval);
            bar.style.width = "100%";
            perc.innerText = "100%";
            
            const blob = new Blob([e.data], { type: "image/png" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Logo_" + name + ".png";
            a.click();
            
            setTimeout(() => {
                screen.classList.add('hidden');
                document.body.removeChild(iframe);
            }, 1000);
            window.removeEventListener("message", handleMessage);
        }
    };
    window.addEventListener("message", handleMessage);

    // 2. දැන් iframe එක හදලා පේජ් එකට දානවා
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(config));
    document.body.appendChild(iframe);
};
