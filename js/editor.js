// 1. මුලින්ම පාවිච්චි කරන Variables
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// --- 2. UI පාලනය (Navigation & Modals) ---

// Create Logo Button එක එබුවම යටට scroll වෙන්න
window.revealEditor = function() {
    const nameInput = document.getElementById("home-name");
    if(!nameInput || !nameInput.value) {
        alert("Please enter a name first!");
        return;
    }
    
    // Editor එක පෙන්නන්න
    const editor = document.getElementById("editor-section");
    editor.classList.remove("hidden-section");
    
    // උඩ ගැහුව නම යට input එකට දාන්න
    document.getElementById("target-name").value = nameInput.value;
    
    // Character grid එක හදන්න
    window.renderCharacters();
    
    // Smooth scroll කරන්න
    setTimeout(() => {
        editor.scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

// Modal පාලනය
window.toggleModal = function(id, show) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById('modal-overlay');
    
    if (show) {
        // පරණ ඒවා වහන්න
        document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
        overlay.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('modal-active');
            overlay.style.opacity = '1';
        }, 10);
    } else {
        window.closeAllModals();
    }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const overlay = document.getElementById('modal-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }
};

// Coming Soon දේවල්
window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

// Scroll Bar එක (Slim Header)
window.onscroll = function() {
    const header = document.getElementById("slim-header");
    if(header) {
        if (window.pageYOffset > 300) header.classList.add("visible");
        else header.classList.remove("visible");
    }
};

// --- 3. Logo & Character Logic ---

// Style එක මාරු කරද්දී (s1, s2, s3)
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    const mainImg = document.getElementById('main-logo');
    // ප්‍රධාන රූපය වෙනස් කරනවා
    mainImg.src = `./assets/logos/s${styleId}_c${window.selectedCharacterId}.png`;
    // Characters grid එකත් ඒ style එකට අදාළව අලුත් කරනවා
    window.renderCharacters();
};

// Grid එක ඇතුළේ characters 9 පෙන්වීම
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="window.selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all">
                <img src="./assets/logos/s${window.currentLogoStyle}_c${i}.png" class="w-full h-full object-cover">
            </div>`;
    }
};

// Grid එකෙන් එකක් තෝරාගත්තම
window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId;
    
    // Select වුණ බව පෙන්නන්න border එකක් දාමු
    document.querySelectorAll('.char-item').forEach(item => item.style.borderColor = "rgba(255,255,255,0.1)");
    el.style.borderColor = "#6638A6";
    
    // ප්‍රධාන රූපය update කරලා modal එක වහන්න
    document.getElementById('main-logo').src = `./assets/logos/s${window.currentLogoStyle}_c${charId}.png`;
    window.closeAllModals();
};

// --- 4. Photopea Engine (Rendering) ---

window.generateFinalLogo = function() {
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    const userNumber = document.getElementById('target-number').value || "";
    const userTitle = document.getElementById('target-title').value || "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderPerc = document.getElementById('render-perc');
    const renderPreview = document.getElementById('render-preview');

    // Rendering screen එක පෙන්වන්න
    renderScreen.classList.remove('hidden');
    renderScreen.classList.add('flex');
    renderPreview.src = document.getElementById('main-logo').src;

    // Loading Progress Animation (0% - 95%)
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 95) progress = 95;
        renderBar.style.width = progress + "%";
        renderPerc.innerText = Math.floor(progress) + "%";
    }, 400);

    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const muroFontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const photopeaConfig = {
        "files": [psdUrl, muroFontUrl],
        "script": `
            app.loadFont("${muroFontUrl}");
            function run() {
                if (app.documents.length > 0) {
                    var doc = app.activeDocument;
                    function setT(layerName, val, font) {
                        try {
                            var l = doc.artLayers.getByName(layerName);
                            l.textItem.contents = val;
                            if(font) l.textItem.font = font;
                        } catch(e) {}
                    }
                    // Fonts: Name -> Muro, Number -> Bebas, Title -> Muro
                    setT("LogoName", "${userName.toUpperCase()}", "Muro-Regular");
                    setT("LogoNumber", "${userNumber}", "BebasNeue-Regular");
                    setT("LogoTitle", "${userTitle.toUpperCase()}", "Muro-Regular");
                    
                    app.activeDocument.saveToOE("png");
                }
            }
            setTimeout(run, 2500);
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
            renderBar.style.width = "100%";
            renderPerc.innerText = "100%";
            
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = \`LokayaGFX_\${userName}.png\`;
            a.click();
            
            setTimeout(() => {
                renderScreen.classList.add('hidden');
                document.body.removeChild(iframe);
            }, 1000);
            window.removeEventListener("message", handleMsg);
        }
    });
};
