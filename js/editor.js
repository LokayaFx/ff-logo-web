window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

// 1. Navigation
window.revealEditor = function() {
    var n = document.getElementById("home-name");
    if(!n || !n.value) { alert("Please enter a name!"); return; }
    document.getElementById("editor-section").classList.remove("hidden-section");
    document.getElementById("target-name").value = n.value;
    window.renderCharacters();
    setTimeout(function() { 
        document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); 
    }, 100);
};

// 2. Character Grid (FIXED - NO BACKTICKS)
window.renderCharacters = function() {
    var grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    
    for(var i=1; i<=9; i++) {
        var charDiv = document.createElement("div");
        charDiv.className = "char-item aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all";
        
        // Character එකක් තෝරන විදිහ
        charDiv.onclick = (function(idx) {
            return function() { window.selectFinal(this, idx); };
        })(i);
        
        var imgPath = "./assets/logos/s" + window.currentLogoStyle + "_c" + i + ".png";
        charDiv.innerHTML = '<img src="' + imgPath + '" class="w-full h-full object-cover">';
        
        grid.appendChild(charDiv);
    }
};

// 3. Selection Logic
window.selectFinal = function(el, id) {
    window.selectedCharacterId = id;
    var mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = "./assets/logos/s" + window.currentLogoStyle + "_c" + id + ".png";
    }
    
    // Borders reset කිරීම
    var items = document.querySelectorAll('.char-item');
    for(var x=0; x<items.length; x++) { items[x].style.borderColor = "rgba(255,255,255,0.1)"; }
    el.style.borderColor = "#6638A6";
    
    window.closeAllModals();
};

window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    var mainImg = document.getElementById('main-logo');
    if(mainImg) {
        mainImg.src = "./assets/logos/s" + styleId + "_c" + window.selectedCharacterId + ".png";
    }
    window.renderCharacters();
};

// 4. Modals
window.toggleModal = function(id, s) {
    if(s) {
        document.getElementById('modal-overlay').style.display = 'block';
        setTimeout(function() { 
            document.getElementById(id).classList.add('modal-active'); 
            document.getElementById('modal-overlay').style.opacity = '1'; 
        }, 10);
    } else { window.closeAllModals(); }
};

window.closeAllModals = function() {
    var modals = document.querySelectorAll('.custom-modal');
    for(var i=0; i<modals.length; i++) { modals[i].classList.remove('modal-active'); }
    var overlay = document.getElementById('modal-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        setTimeout(function() { overlay.style.display = 'none'; }, 400);
    }
};

// 5. Photopea Rendering
window.generateFinalLogo = function() {
    var name = (document.getElementById('target-name').value || "LOKAYA GFX").toUpperCase();
    var num = document.getElementById('target-number').value || "";
    var title = (document.getElementById('target-title').value || "").toUpperCase();

    var screen = document.getElementById('render-screen');
    var bar = document.getElementById('render-bar');
    var perc = document.getElementById('render-perc');

    screen.classList.remove('hidden');
    screen.classList.add('flex');

    var prog = 0;
    var interval = setInterval(function() {
        prog += 1; if(prog > 95) prog = 95;
        bar.style.width = prog + "%";
        perc.innerText = prog + "%";
    }, 200);

    var psdUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s" + window.currentLogoStyle + "_c" + window.selectedCharacterId + ".psd";
    var fontUrl = "https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf";

    var pScript = "app.loadFont('" + fontUrl + "'); " +
                  "function process() { " +
                  "  if(app.documents.length > 0) { " +
                  "    var doc = app.activeDocument; " +
                  "    function setL(n, v) { try { doc.artLayers.getByName(n).textItem.contents = v; } catch(e) {} } " +
                  "    setL('LogoName', '" + name + "'); " +
                  "    setL('LogoNumber', '" + num + "'); " +
                  "    setL('LogoTitel', '" + title + "'); " +
                  "    doc.saveToOE('png'); " +
                  "  } " +
                  "} " +
                  "setTimeout(process, 4000);";

    var config = { "files": [psdUrl, fontUrl], "script": pScript, "serverMode": true };
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(config));
    document.body.appendChild(iframe);

    window.addEventListener("message", function handle(e) {
        if (e.data instanceof ArrayBuffer) {
            clearInterval(interval);
            bar.style.width = "100%";
            perc.innerText = "100%";
            var url = URL.createObjectURL(new Blob([e.data], {type: "image/png"}));
            var a = document.createElement("a");
            a.href = url;
            a.download = "Logo_" + name + ".png";
            a.click();
            setTimeout(function() { screen.classList.add('hidden'); document.body.removeChild(iframe); }, 1000);
            window.removeEventListener("message", handle);
        }
    });
};
