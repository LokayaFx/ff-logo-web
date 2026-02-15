window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

window.revealEditor = function() {
    const n = document.getElementById("home-name");
    if(!n || !n.value) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = n.value;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
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
    if(s) {
        document.getElementById('modal-overlay').style.display = 'block';
        setTimeout(() => { document.getElementById(id).classList.add('modal-active'); document.getElementById('modal-overlay').style.opacity = '1'; }, 10);
    } else { window.closeAllModals(); }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    document.getElementById('modal-overlay').style.opacity = '0';
    setTimeout(() => { document.getElementById('modal-overlay').style.display = 'none'; }, 400);
};

// --- PHOTOPEA ENGINE (THE FINAL FIX) ---
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

    const psd = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const font = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    // මෙතන මම LogoTitel (ඔයාගේ PSD එකේ තියෙන නම) පාවිච්චි කළා
    const pScript = `
        app.loadFont('${font}');
        function process() {
            if(app.documents.length == 0) return;
            var doc = app.activeDocument;
            function setL(n, v) {
                try { doc.artLayers.getByName(n).textItem.contents = v; } catch(e) {}
            }
            setL('LogoName', '${name}');
            setL('LogoNumber', '${num}');
            setL('LogoTitel', '${title}'); // Fixed spelling to match your PSD
            doc.saveToOE('png');
        }
        // Wait until font is ready - Using a simple loop instead of setTimeout
        var checkLimit = 0;
        function checkReady() {
            if(app.fontsLoaded || checkLimit > 50) { process(); }
            else { checkLimit++; process(); } // Calling process directly since setTimeout is blocked
        }
        checkReady();
    `;

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
            a.download = `Logo_${name}.png`;
            a.click();
            setTimeout(() => { screen.classList.add('hidden'); document.body.removeChild(iframe); }, 1000);
            window.removeEventListener("message", handle);
        }
    });
};
            
