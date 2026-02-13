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
                <img src="assets/logos/s${window.currentLogoStyle}_c${i}.png" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            </div>
        `;
    }
};

// 3. අවසාන Character එක තෝරාගැනීම
window.selectFinal = function(el, charId) {
    window.selectedCharacterId = charId;
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    
    const mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = `assets/logos/s${window.currentLogoStyle}_c${charId}.png`;
    }
};

// 4. PHOTOPEA හරහා ලෝගෝ එක හැදීම
window.generateFinalLogo = function() {
    // Inputs වලින් අගයන් ලබා ගැනීම
    const userName = document.getElementById('target-name').value || "LOKAYA GFX";
    // Placeholder එක හරහා හරියටම input එක අල්ලනවා
    const userNumber = document.querySelector('input[placeholder="Your Whatsapp number"]').value || "";
    const userTitle = document.querySelector('input[placeholder="Under name TITLE"]').value || "";

    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderStatus = document.getElementById('render-status');
    const renderPerc = document.getElementById('render-perc');
    const renderPreview = document.getElementById('render-preview');

    // Rendering Screen පෙන්වීම
    if(renderScreen) {
        renderScreen.classList.remove('hidden');
        renderScreen.classList.add('flex');
        renderPreview.src = document.getElementById('main-logo').src;
    }

    // Fake Progress Animation
    let progress = 0;
    const messages = ["Connecting...", "Loading PSD...", "Applying Styles...", "Injecting Layers...", "Exporting..."];
    const progressInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress > 95) progress = 95;
        if(renderBar) renderBar.style.width = progress + "%";
        if(renderPerc) renderPerc.innerText = Math.floor(progress) + "%";
        if(renderStatus) renderStatus.innerText = messages[Math.floor(progress / 20)] || "Processing...";
    }, 400);

    // PSD URL එක (මතක ඇතුව ලින්ක් එකේ ඔයාගේ username එක චෙක් කරන්න)
    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;

    // Photopea Script එක (මෙහි තමයි LogoName, LogoNumber, LogoTitle තුනම මාරු කරන්නේ)
    const photopeaConfig = {
        "files": [psdUrl],
        "script": `
            var doc = app.activeDocument;
            
            // Name මාරු කිරීම
            var nameLayer = doc.artLayers.getByName("LogoName");
            nameLayer.textItem.contents = "${userName.toUpperCase()}";
            
            // Number මාරු කිරීම
            try {
                var numLayer = doc.artLayers.getByName("LogoNumber");
                numLayer.textItem.contents = "${userNumber}";
            } catch(e) {}

            // Title මාරු කිරීම
            try {
                var titleLayer = doc.artLayers.getByName("LogoTitle");
                titleLayer.textItem.contents = "${userTitle.toUpperCase()}";
            } catch(e) {}

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
            clearInterval(progressInterval);
            if(renderBar) renderBar.style.width = "100%";
            if(renderPerc) renderPerc.innerText = "100%";
            if(renderStatus) renderStatus.innerText = "Done!";

            const blob = new Blob([e.data], {type: "image/png"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `LokayaGFX_${userName}.png`;
            a.click();
            
            setTimeout(() => {
                if(renderScreen) {
                    renderScreen.classList.add('hidden');
                    renderScreen.classList.remove('flex');
                }
                document.body.removeChild(iframe);
            }, 1000);
            window.removeEventListener("message", receiveMessage);
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
    
