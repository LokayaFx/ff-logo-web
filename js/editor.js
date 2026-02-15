window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

window.revealEditor = function() {
    const n = document.getElementById("home-name");
    if(!n || !n.value) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = n.value;
    
    // Update main logo image
    document.getElementById('main-logo').src = `./assets/logos/s${window.currentLogoStyle}_c${window.selectedCharacterId}.png`;
    
    // Render character grid
    window.renderCharacters();
    
    setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
};

window.updateCurrentLogo = function(style) {
    console.log('Style changed to:', style);
    window.currentLogoStyle = style;
    window.selectedCharacterId = 1; // Reset to character 1
    
    // Update main logo
    document.getElementById('main-logo').src = `./assets/logos/s${style}_c1.png`;
    
    // Re-render characters for new style
    window.renderCharacters();
};

window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) {
        console.error('Character grid not found!');
        return;
    }
    
    console.log('Rendering characters for style:', window.currentLogoStyle);
    grid.innerHTML = "";
    
    for(let i=1; i<=9; i++) {
        const charDiv = document.createElement('div');
        charDiv.className = 'aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all';
        
        // Add selected class if this is the current character
        if(i === window.selectedCharacterId) {
            charDiv.style.border = '2px solid #6638A6';
        }
        
        charDiv.onclick = function() {
            window.selectCharacter(i);
        };
        
        const img = document.createElement('img');
        img.src = `./assets/logos/s${window.currentLogoStyle}_c${i}.png`;
        img.className = 'w-full h-full object-cover';
        img.alt = 'Character ' + i;
        
        charDiv.appendChild(img);
        grid.appendChild(charDiv);
    }
    
    console.log('✅ Character grid rendered with 9 characters');
};

window.selectCharacter = function(id) {
    console.log('Character selected:', id);
    window.selectedCharacterId = id;
    
    // Update main logo
    document.getElementById('main-logo').src = `./assets/logos/s${window.currentLogoStyle}_c${id}.png`;
    
    // Re-render to update selection highlight
    window.renderCharacters();
};

window.toggleModal = function(id, show) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById('modal-overlay');
    
    if(!modal || !overlay) {
        console.error('Modal or overlay not found!');
        return;
    }
    
    if(show) {
        // Render characters when opening char-modal
        if(id === 'char-modal') {
            window.renderCharacters();
        }
        
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

// --- PHOTOPEA ENGINE ---
window.generateFinalLogo = function() {
    const name = (document.getElementById('target-name').value || "LOKAYA GFX").toUpperCase();
    const num = document.getElementById('target-number').value || "";
    const title = (document.getElementById('target-title').value || "").toUpperCase();

    console.log('🎯 Generating logo:', { name, num, title, style: window.currentLogoStyle, char: window.selectedCharacterId });

    const screen = document.getElementById('render-screen');
    const bar = document.getElementById('render-bar');
    const perc = document.getElementById('render-perc');

    screen.style.display = 'flex';
    screen.classList.remove('hidden');

    let prog = 0;
    const interval = setInterval(() => {
        prog += 1; 
        if(prog > 95) prog = 95;
        bar.style.width = prog + "%";
        perc.innerText = prog + "%";
    }, 150);

    const psd = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${window.currentLogoStyle}_c${window.selectedCharacterId}.psd`;
    const font = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    console.log('📄 PSD:', psd);
    console.log('🔤 Font:', font);

    const pScript = `
        app.loadFont('${font}');
        function process() {
            if(app.documents.length == 0) return;
            var doc = app.activeDocument;
            function setL(n, v) {
                try { 
                    var layer = doc.artLayers.getByName(n);
                    if(layer) layer.textItem.contents = v;
                    console.log('Updated layer:', n, 'with:', v);
                } catch(e) {
                    console.error('Error updating', n, ':', e);
                }
            }
            setL('LogoName', '${name}');
            setL('LogoNumber', '${num}');
            setL('LogoTitel', '${title}');
            setTimeout(function() {
                doc.saveToOE('png');
                console.log('Export command sent');
            }, 500);
        }
        setTimeout(function() {
            process();
        }, 3000);
    `;

    const config = { 
        "files": [psd], 
        "script": pScript 
    };
    
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.id = "photopea-iframe";
    iframe.src = "https://www.photopea.com#" + encodeURIComponent(JSON.stringify(config));
    document.body.appendChild(iframe);

    console.log('✅ Photopea iframe created');

    let downloadReceived = false;

    window.addEventListener("message", function handle(e) {
        if(e.origin !== 'https://www.photopea.com') return;
        
        console.log('📨 Message from Photopea:', typeof e.data);
        
        if (e.data instanceof ArrayBuffer && e.data.byteLength > 0) {
            console.log('🎉 PNG received! Size:', e.data.byteLength);
            
            downloadReceived = true;
            clearInterval(interval);
            bar.style.width = "100%";
            perc.innerText = "100%";
            
            const url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            const a = document.createElement("a");
            a.href = url;
            a.download = `${name}_Logo_S${window.currentLogoStyle}_C${window.selectedCharacterId}.png`;
            a.click();
            
            console.log('✅ Download triggered');
            
            setTimeout(() => { 
                screen.style.display = 'none';
                const iframeToRemove = document.getElementById('photopea-iframe');
                if(iframeToRemove) document.body.removeChild(iframeToRemove);
                URL.revokeObjectURL(url);
            }, 1500);
            
            window.removeEventListener("message", handle);
        }
    });

    // Timeout fallback
    setTimeout(function() {
        if(!downloadReceived) {
            clearInterval(interval);
            console.error('❌ Export timeout');
            alert('❌ Logo export failed.\n\nPlease try again or check your internet connection.');
            screen.style.display = 'none';
            const iframeToRemove = document.getElementById('photopea-iframe');
            if(iframeToRemove) document.body.removeChild(iframeToRemove);
        }
    }, 25000);
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Editor initialized');
    console.log('Current style:', window.currentLogoStyle);
    console.log('Current character:', window.selectedCharacterId);
});
