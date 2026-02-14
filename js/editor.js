// Global Variables
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- UI Logic ---
window.revealEditor = function() {
    const n = document.getElementById("home-name");
    if(!n || !n.value) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = n.value;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

window.updateCurrentLogo = function(s) {
    window.currentLogoStyle = s;
    document.getElementById('main-logo').src = `./assets/logos/s${s}_c${window.selectedCharacterId}.png`;
    window.renderCharacters();
};

window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `<div onclick="window.selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all">
            <img src="./assets/logos/s${window.currentLogoStyle}_c${i}.png" class="w-full h-full object-cover">
        </div>`;
    }
};

window.selectFinal = function(el, id) {
    window.selectedCharacterId = id;
    document.getElementById('main-logo').src = `./assets/logos/s${window.currentLogoStyle}_c${id}.png`;
    window.closeAllModals();
};

window.toggleModal = function(id, s) {
    const m = document.getElementById(id);
    const o = document.getElementById('modal-overlay');
    if(s) { o.style.display = 'block'; setTimeout(() => { m.classList.add('modal-active'); o.style.opacity = '1'; }, 10); }
    else { window.closeAllModals(); }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const o = document.getElementById('modal-overlay');
    if(o) { o.style.opacity = '0'; setTimeout(() => o.style.display = 'none', 400); }
};

window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

// --- Photopea Rendering Engine (Final Fix) ---
window.generateFinalLogo = function() {
    const name = document.getElementById('target-name').value || "LOKAYA GFX";
    const num = document.getElementById('target-number').value || "";
    const title = document.getElementById('target-title').value || "";

    const screen = document.getElementById('render-screen');
    const bar = document.getElementById('render-bar');
    const status = document.getElementById('render-status');

    screen.classList.remove('hidden');
    screen.classList.add('flex');

    let prog = 0;
    const interval = setInterval(() => {
        prog += 2; if(prog > 98) prog = 98;
        bar.style.width = prog + "%";
    }, 300);

    const psd = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const font = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const config = {
        "files": [psd, font],
        "script": `
            function edit() {
                if(app.documents.length == 0) return;
                var doc = app.activeDocument;
                function setL(n, v) {
                    try { 
                        var l = doc.artLayers.getByName(n); 
                        l.textItem.contents = v;
                    } catch(e) { console.log("Missing: " + n); }
                }
                setL("LogoName", "${name.toUpperCase()}");
                setL("LogoNumber", "${num}");
                setL("LogoTitle", "${title.toUpperCase()}");
                
                // Export PNG
                app.activeDocument.saveToOE("png");
            }
            // Font එක load වෙන්නත් එක්ක තත්පර 4ක් ඉමු
            setTimeout(edit, 4000);
        `,
        "serverMode": true
    };

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(config));
    document.body.appendChild(iframe);

    window.addEventListener("message", function handle(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(interval);
            bar.style.width = "100%";
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = `Logo_${name}.png`;
            a.click();
            setTimeout(() => { screen.classList.add('hidden'); document.body.removeChild(iframe); }, 1000);
            window.removeEventListener("message", handle);
        }
    });
};
