// --- Global Data ---
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- UI Navigation ---
window.revealEditor = function() {
    const n = document.getElementById("home-name");
    if(!n || !n.value) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = n.value;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

// --- Character Grid Logic (FIXED) ---
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = ""; // කලින් තිබ්බ ඒවා මකන්න
    
    for(let i=1; i<=9; i++) {
        const charDiv = document.createElement("div");
        charDiv.className = "char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all";
        charDiv.onclick = function() { window.selectFinal(this, i); };
        
        // Image එක පේන්න මෙතන path එක නිවැරදි කළා
        const imgPath = "./assets/logos/s" + window.currentLogoStyle + "_c" + i + ".png";
        charDiv.innerHTML = '<img src="' + imgPath + '" class="w-full h-full object-cover" onerror="this.src=\'https://via.placeholder.com/150?text=Logo\'">';
        
        grid.appendChild(charDiv);
    }
};

window.updateCurrentLogo = function(style) {
    window.currentLogoStyle = style;
    const mainLogo = document.getElementById('main-logo');
    if(mainLogo) {
        mainLogo.src = "./assets/logos/s" + style + "_c" + window.selectedCharacterId + ".png";
    }
    window.renderCharacters(); // Style එක මාරු වුණාම Grid එක අලුත් කරන්න
};

window.selectFinal = function(el, id) {
    window.selectedCharacterId = id;
    const mainLogo = document.getElementById('main-logo');
    if(mainLogo) {
        mainLogo.src = "./assets/logos/s" + window.currentLogoStyle + "_c" + id + ".png";
    }
    window.closeAllModals();
};

// --- Modal Management ---
window.toggleModal = function(id, show) {
    if(show) {
        document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
        const overlay = document.getElementById('modal-overlay');
        if(overlay) {
            overlay.style.display = 'block';
            setTimeout(() => { 
                document.getElementById(id).classList.add('modal-active'); 
                overlay.style.opacity = '1'; 
            }, 10);
        }
    } else { window.closeAllModals(); }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const overlay = document.getElementById('modal-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }
};

window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

// --- Photopea Rendering Engine (Already Working) ---
window.generateFinalLogo = function() {
    const name = (document.getElementById('target-name').value || "LOKAYA GFX").toUpperCase();
    const num = document.getElementById('target-number').value || "";
    const title = (document.getElementById('target-title').value || "").toUpperCase();

    const screen = document.getElementById('render-screen');
    const bar = document.getElementById('render-bar');
    const perc = document.getElementById('render-perc');

    screen.classList.remove('hidden');
    screen.classList.add('flex');

    let prog = 0;
    const interval = setInterval(() => {
        prog += 1; if(prog > 95) prog = 95;
        bar.style.width = prog + "%";
        perc.innerText = prog + "%";
    }, 200);

    const psd = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s" + window.currentLogoStyle + "_c" + window.selectedCharacterId + ".psd";
    const font = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf";

    const pScript = "app.loadFont('" + font + "'); " +
                   "function process() { " +
                   "  if(app.documents.length > 0) { " +
                   "    var d = app.activeDocument; " +
                   "    function set(n, v) { try { d.artLayers.getByName(n).textItem.contents = v; } catch(e) {} } " +
                   "    set('LogoName', '" + name + "'); " +
                   "    set('LogoNumber', '" + num + "'); " +
                   "    set('LogoTitel', '" + title + "'); " + // Your PSD spelling
                   "    app.activeDocument.saveToOE('png'); " +
                   "  } " +
                   "} " +
                   "setTimeout(process, 4000);";

    const config = { "files": [psd, font], "script": pScript, "serverMode": true };
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(config));
    document.body.appendChild(iframe);

    window.addEventListener("message", function handle(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(interval);
            bar.style.width = "100%";
            perc.innerText = "100%";
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = "Logo_" + name + ".png";
            a.click();
            setTimeout(() => { screen.classList.add('hidden'); document.body.removeChild(iframe); }, 1000);
            window.removeEventListener("message", handle);
        }
    });
};
