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

// --- Character Grid Logic ---
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = ""; 
    
    for(let i=1; i<=9; i++) {
        const charDiv = document.createElement("div");
        charDiv.className = "char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all";
        charDiv.onclick = (function(idx) {
            return function() { window.selectFinal(this, idx); };
        })(i);
        
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
    window.renderCharacters(); 
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

// --- Photopea Rendering Engine (The Final Repair) ---
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
        prog += 2; if(prog > 95) prog = 95;
        bar.style.width = prog + "%";
        perc.innerText = prog + "%";
    }, 300);

    // PSD Path එක හරියටම හැදෙනවා මෙතනින්
    const psdFile = "s" + window.currentLogoStyle + "_c" + window.selectedCharacterId + ".psd";
    const psdUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/" + psdFile;
    const fontUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf";

    // Script එක ඇතුළේ කිසිම Backtick එකක් නැතුව සාමාන්‍ය විදිහට ලිව්වා
    const pScript = "app.loadFont('" + fontUrl + "'); " +
                   "function runProcess() { " +
                   "  if(app.documents.length > 0) { " +
                   "    var doc = app.activeDocument; " +
                   "    function updateLayer(n, v) { try { doc.artLayers.getByName(n).textItem.contents = v; } catch(e) {} } " +
                   "    updateLayer('LogoName', '" + name + "'); " +
                   "    updateLayer('LogoNumber', '" + num + "'); " +
                   "    updateLayer('LogoTitel', '" + title + "'); " +
                   "    doc.saveToOE('png'); " +
                   "  } " +
                   "} " +
                   "setTimeout(runProcess, 4000);";

    const config = { "files": [psdUrl, fontUrl], "script": pScript, "serverMode": true };
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
            setTimeout(() => { 
                screen.classList.add('hidden'); 
                if(document.body.contains(iframe)) document.body.removeChild(iframe); 
            }, 1000);
            window.removeEventListener("message", handle);
        }
    });
};
                       
