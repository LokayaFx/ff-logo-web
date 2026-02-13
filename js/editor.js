// 1. variables ලෑස්ති කරගමු
window.currentLogoStyle = 1;
window.selectedCharacterId = 1; 

// 2. Style එක මාරු කිරීම (Modal එක වැහෙන්නේ නැත)
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    const mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = `./assets/logos/s${styleId}_c${window.selectedCharacterId}.png`;
    }
    window.renderCharacters();
    const editorSection = document.getElementById("editor-section");
    if(editorSection) {
        editorSection.classList.remove("hidden-section");
    }
};

// 3. Characters Grid එක පෙන්වීම
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer active:scale-95 transition-all">
                <img src="./assets/logos/s${window.currentLogoStyle}_c${i}.png" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150?text=Error'">
            </div>`;
    }
};

// 4. Character එක තෝරාගැනීම සහ Modal එක Close කිරීම
window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId;
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    const mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = `./assets/logos/s${window.currentLogoStyle}_c${charId}.png`;
    }
    window.closeAllModals();
    const editorSection = document.getElementById("editor-section");
    if(editorSection) {
        editorSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// 5. PHOTOPEA හරහා ලෝගෝ එක හැදීම (Dual Font & Title Fix)
window.generateFinalLogo = function() {
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    const userNumber = document.getElementById('target-number')?.value || "";
    const userTitle = document.getElementById('target-title')?.value || "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderStatus = document.getElementById('render-status');
    const renderPerc = document.getElementById('render-perc');
    const renderPreview = document.getElementById('render-preview');

    if(renderScreen) {
        renderScreen.classList.remove('hidden');
        renderScreen.classList.add('flex');
        renderPreview.src = document.getElementById('main-logo').src;
    }

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress > 98) progress = 98;
        if(renderBar) renderBar.style.width = progress + "%";
        if(renderPerc) renderPerc.innerText = Math.floor(progress) + "%";
    }, 300);

    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const muroFontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const photopeaConfig = {
        "files": [psdUrl, muroFontUrl], 
        "script": `
            // 1. Muro Font එක load කරනවා (Bebas Neue Photopea එකේ default තියෙනවා)
            app.loadFont("${muroFontUrl}");

            function runExport() {
                if (app.documents.length > 0) {
                    var doc = app.activeDocument;
                    
                    function setLayer(name, val, fontName) {
                        try {
                            var l = doc.artLayers.getByName(name);
                            l.textItem.contents = val;
                            if(fontName) {
                                l.textItem.font = fontName;
                            }
                        } catch(e) { console.log("Missing Layer: " + name); }
                    }

                    // Logo Name එකට MURO font එක දානවා
                    setLayer("LogoName", "${userName.toUpperCase()}", "Muro-Regular");

                    // Number එකට BEBAS NEUE font එක දානවා
                    setLayer("LogoNumber", "${userNumber}", "BebasNeue-Regular");

                    // Title එක (යටින් එන එක) - PSD එකේ ලේයර් එක "LogoTitle" විය යුතුයි
                    setLayer("LogoTitle", "${userTitle.toUpperCase()}", "Muro-Regular");

                    app.activeDocument.saveToOE("png");
                }
            }
            
            // විනාඩියක් ඉමු PSD එක Load වෙනකම්
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
            if(renderStatus) renderStatus.innerText = "Done!";

            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = \`LokayaGFX_\${userName}.png\`;
            a.click();
            
            setTimeout(() => {
                if(renderScreen) renderScreen.classList.add('hidden');
                document.body.removeChild(iframe);
            }, 1000);
            window.removeEventListener("message", handleMsg);
        }
    });
};

// --- UI Functions ---
window.revealEditor = function() {
    const name = document.getElementById("home-name").value;
    if(!name) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = name;
    window.renderCharacters();
    setTimeout(() => { 
        document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); 
    }, 100);
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

window.onscroll = function() {
    const header = document.getElementById("slim-header");
    if(header) {
        if (window.pageYOffset > 300) header.classList.add("visible");
        else header.classList.remove("visible");
    }
};
