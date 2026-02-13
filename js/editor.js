// දැනට තෝරාගෙන තියෙන Style සහ Character තබා ගන්නා Variables
window.currentLogoStyle = 1;
window.selectedCharacterId = 1; 

// 1. Style එක මාරු කිරීම (Modal එක close වෙන්නේ නැති වෙන්න හැදුවා)
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

// 2. ග්‍රිඩ් එකේ Characters පෙන්වීම
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer active:scale-95 transition-all">
                <img src="./assets/logos/s${window.currentLogoStyle}_c${i}.png" 
                     class="w-full h-full object-cover" 
                     onerror="this.src='https://via.placeholder.com/150?text=Error'">
            </div>
        `;
    }
};

// 3. අවසාන Character එක තෝරාගැනීම සහ Modal එක Close කිරීම
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

// 4. PHOTOPEA හරහා ලෝගෝ එක හැදීම (Fixed Title and Font)
window.generateFinalLogo = function() {
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    const userNumber = document.getElementById('target-number')?.value || "";
    const userTitle = document.getElementById('target-title')?.value || ""; // මේක තමයි Title එක

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
    const fontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const photopeaConfig = {
        "files": [psdUrl],
        "script": `
            app.loadFont("${fontUrl}");
            
            // ලේයර්ස් ටික හොයාගෙන ටෙක්ස්ට් එක දාන එක
            function runExport() {
                if (app.documents.length > 0) {
                    var doc = app.activeDocument;
                    function setText(layerName, txt) {
                        try {
                            var l = doc.artLayers.getByName(layerName);
                            l.textItem.contents = txt;
                            l.textItem.font = "Muro-Regular"; 
                        } catch(e) { console.log("Missing: " + layerName); }
                    }

                    // ඔයාගේ PSD එකේ ලේයර් වල නම් මේවට සමාන වෙන්න ඕනේ:
                    setText("LogoName", "${userName.toUpperCase()}");
                    setText("LogoNumber", "${userNumber}");
                    setText("LogoTitle", "${userTitle.toUpperCase()}"); // මෙතන තමයි වැරදිලා තිබුණේ

                    app.activeDocument.saveToOE("png");
                }
            }
            
            // පොඩි විනාඩියක් ඉමු ලෝඩ් වෙනකම්
            setTimeout(runExport, 2000);
        `,
        "serverMode": true
    };

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(photopeaConfig));
    document.body.appendChild(iframe);

    const messageHandler = function(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(progressInterval);
            if(renderBar) renderBar.style.width = "100%";
            if(renderPerc) renderPerc.innerText = "100%";
            if(renderStatus) renderStatus.innerText = "Done!";
            const blob = new Blob([e.data], {type: "image/png"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `LokayaGFX_${userName.replace(/\\s+/g, '_')}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => {
                if(renderScreen) renderScreen.classList.add('hidden');
                document.body.removeChild(iframe);
            }, 1000);
            window.removeEventListener("message", messageHandler);
        }
    };
    window.addEventListener("message", messageHandler);
};

// --- UI Functions ---
window.revealEditor = function() {
    const name = document.getElementById("home-name").value;
    if(!name) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = name;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
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

window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

window.onscroll = function() {
    const header = document.getElementById("slim-header");
    if(header) header.classList.toggle("visible", window.pageYOffset > 300);
};
