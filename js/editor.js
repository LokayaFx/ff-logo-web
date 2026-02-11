window.currentLogoStyle = 1;

window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    window.renderCharacters();
};

window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer">
                <img src="assets/logos/s${window.currentLogoStyle}_c${i}.jpg" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            </div>
        `;
    }
};

window.selectFinal = function(el, charId) {
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    document.getElementById('main-logo').src = `assets/logos/s${window.currentLogoStyle}_c${charId}.jpg`;
};

window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

window.revealEditor = function() {
    const name = document.getElementById("home-name").value;
    if(!name) return;
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = name;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

window.toggleModal = function(id, show) {
    if (show) {
        document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
        const m = document.getElementById(id);
        const o = document.getElementById('modal-overlay');
        if(m && o) {
            o.style.display = 'block'; 
            setTimeout(() => { m.classList.add('modal-active'); o.style.opacity = '1'; }, 10);
        }
    }
};

window.closeAllModals = function() {
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
    const o = document.getElementById('modal-overlay');
    if(o) {
        o.style.opacity = '0';
        setTimeout(() => { o.style.display = 'none'; }, 400);
    }
};

window.onscroll = function() {
    const header = document.getElementById("slim-header");
    if(header) header.classList.toggle("visible", window.pageYOffset > 300);
};

        window.onscroll = function() {
            const header = document.getElementById("slim-header");
            if(header) header.classList.toggle("visible", window.pageYOffset > 300);
        };

        function toggleModal(id, show) {
            if (show) {
                document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
                const m = document.getElementById(id);
                const o = document.getElementById('modal-overlay');
                if(m && o) {
                    o.style.display = 'block'; 
                    setTimeout(() => { m.classList.add('modal-active'); o.style.opacity = '1'; }, 10);
                }
            }
        }

        function closeAllModals() {
            document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
            const o = document.getElementById('modal-overlay');
            if(o) {
                o.style.opacity = '0';
                setTimeout(() => { o.style.display = 'none'; }, 400);
            }
        }
// දැනට තෝරාගෙන තියෙන Style සහ Character තබා ගන්නා Variables
window.currentLogoStyle = 1;
window.selectedCharacterId = 1; 

// 1. Style එක මාරු කිරීම (Style 1, 2, 3)
window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    window.renderCharacters();
};

// 2. ග්‍රිඩ් එකේ Characters පෙන්වීම
window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer active:scale-95 transition-all">
                <img src="assets/logos/s${window.currentLogoStyle}_c${i}.jpg" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            </div>
        `;
    }
};

// 3. අවසාන Character එක තෝරාගැනීම
window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId; // PSD එක තෝරන්න මේක ඕනේ
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    
    const mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = `assets/logos/s${window.currentLogoStyle}_c${charId}.jpg`;
    }
};

// 4. PHOTOPEA හරහා ලෝගෝ එක හැදීම (ප්‍රධාන කොටස)
// editor.js ඇතුළේ script කෑල්ල මෙහෙම මාරු කරන්න
const userName = document.getElementById('target-name').value || "LOKAYA GFX";
const userNumber = document.querySelectorAll('input[placeholder="Your Whatsapp number"]')[0].value || "";
const userTitle = document.querySelectorAll('input[placeholder="Under name TITLE"]')[0].value || "";

const photopeaConfig = {
    "files": [psdUrl],
    "script": `
        var doc = app.activeDocument;
        
        // ප්‍රධාන නම මාරු කිරීම
        var nameLayer = doc.artLayers.getByName("LogoName");
        nameLayer.textItem.contents = "${userName.toUpperCase()}";
        
        // WhatsApp අංකය මාරු කිරීම
        try {
            var numLayer = doc.artLayers.getByName("LogoNumber");
            numLayer.textItem.contents = "${userNumber}";
        } catch(e) {}

        // Title එක මාරු කිරීම
        try {
            var titleLayer = doc.artLayers.getByName("LogoTitle");
            titleLayer.textItem.contents = "${userTitle.toUpperCase()}";
        } catch(e) {}

        app.activeDocument.saveToOE("png");
    `,
    "serverMode": true
};

// --- අනිත් UI Functions (Modal, Scroll etc.) ---
window.revealEditor = function() {
    const name = document.getElementById("home-name").value;
    if(!name) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = name;
    window.renderCharacters();
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

window.toggleModal = function(id, show) {
    if (show) {
        document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
        const m = document.getElementById(id);
        const o = document.getElementById('modal-overlay');
        if(m && o) {
            o.style.display = 'block'; 
            setTimeout(() => { m.classList.add('modal-active'); o.style.opacity = '1'; }, 10);
        }
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
window.generateFinalLogo = function() {
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderStatus = document.getElementById('render-status');
    const renderPerc = document.getElementById('render-perc');
    const renderPreview = document.getElementById('render-preview');

    // 1. Rendering Screen එක පෙන්වීම
    renderScreen.classList.remove('hidden');
    renderScreen.classList.add('flex');
    renderPreview.src = document.getElementById('main-logo').src;

    // Fake Progress Animation (යුසර්ට පේන්න)
    let progress = 0;
    const messages = [
        "Connecting to Photopea API...",
        "Loading PSD Template...",
        "Applying Photoshop Styles...",
        "Injecting Text Layers...",
        "Finalizing Export..."
    ];

    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 95) progress = 95;
        
        renderBar.style.width = progress + "%";
        renderPerc.innerText = Math.floor(progress) + "%";
        renderStatus.innerText = messages[Math.floor(progress / 20)] || "Exporting...";
    }, 400);

    // 2. Photopea Logic එක
    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;

    const photopeaConfig = {
        "files": [psdUrl],
        "script": `
            var doc = app.activeDocument;
            var layer = doc.artLayers.getByName("LogoName");
            layer.textItem.contents = "${userName.toUpperCase()}";
            app.activeDocument.saveToOE("png");
        `,
        "serverMode": true
    };

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(photopeaConfig));
    document.body.appendChild(iframe);

    window.addEventListener("message", function receiveMessage(e) {
        if (e.source == iframe.contentWindow) {
            // 3. වැඩේ ඉවරයි - Progress 100% කරනවා
            clearInterval(progressInterval);
            renderBar.style.width = "100%";
            renderPerc.innerText = "100%";
            renderStatus.innerText = "Download Complete!";

            const blob = new Blob([e.data], {type: "image/png"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `LokayaGFX_${userName}.png`;
            a.click();
            
            // තත්පරයකට පස්සේ Screen එක හංගනවා
            setTimeout(() => {
                renderScreen.classList.add('hidden');
                renderScreen.classList.remove('flex');
                document.body.removeChild(iframe);
            }, 1000);

            window.removeEventListener("message", receiveMessage);
        }
    });
};
