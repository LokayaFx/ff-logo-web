window.revealEditor = function() {
    const homeInput = document.getElementById('home-name');
    const targetInput = document.getElementById('target-name');
    const editorSection = document.getElementById('editor-section');
    
    if (!homeInput || homeInput.value.trim() === "") {
        alert("Please enter a name!");
        return;
    }

    targetInput.value = homeInput.value.trim() || 'PLAYER';
    
    // Show editor
    editorSection.classList.remove('hidden-section');
    editorSection.style.display = 'flex';
    
    // Hide home section
    const homeSection = document.querySelector('.bg-premium-dark');
    if (homeSection) homeSection.style.display = 'none';

    setTimeout(() => {
        editorSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

window.generateFinalLogo = function() {
    const name = (document.getElementById('target-name').value || 'PLAYER').toUpperCase();
    const number = document.getElementById('target-number').value || '';
    const title = (document.getElementById('target-title').value || 'LEGEND').toUpperCase();
    
    const screen = document.getElementById('render-screen');
    const bar = document.getElementById('render-bar');
    const perc = document.getElementById('render-perc');
    const preview = document.getElementById('render-preview');

    preview.src = document.getElementById('main-logo').src;
    screen.style.display = 'flex';
    bar.style.width = '0%';
    
    let p = 0;
    const interval = setInterval(() => {
        p += 1; if (p > 95) p = 95;
        bar.style.width = p + '%';
        if (perc) perc.innerText = p + '%';
    }, 150);

    // හැමතිස්සෙම s1_c1.psd එක විතරක් render වෙනවා
    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s1_c1.psd`;
    const fontUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf`;

    const pScript = `
        app.loadFont("${fontUrl}");
        function runTask() {
            if(app.documents.length > 0) {
                var doc = app.activeDocument;
                function setL(n, v) { try { doc.artLayers.getByName(n).textItem.contents = v; } catch(e) {} }
                setL('LogoName', "${name}");
                setL('LogoNumber', "${number}");
                setL('LogoTitel', "${title}");
                doc.saveToOE("png");
            }
        }
        setTimeout(runTask, 4000);
    `;

    const config = {
        files: [psdUrl, fontUrl],
        script: pScript,
        serverMode: true
    };

    let iframe = document.getElementById('photopea-iframe');
    if (iframe) iframe.remove(); 

    iframe = document.createElement('iframe');
    iframe.id = 'photopea-iframe';
    iframe.style.display = 'none';
    iframe.src = "https://www.photopea.com#" + encodeURI(JSON.stringify(config));
    document.body.appendChild(iframe);

    const messageHandler = function(e) {
        if (e.origin !== "https://www.photopea.com") return;
        
        if (e.data instanceof ArrayBuffer) {
            clearInterval(interval);
            bar.style.width = '100%';
            if (perc) perc.innerText = '100%';

            const blob = new Blob([e.data], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name}_Logo.png`;
            a.click();

            setTimeout(() => {
                screen.style.display = 'none';
                document.body.removeChild(iframe);
            }, 1000);
            
            window.removeEventListener('message', messageHandler);
        }
    };

    window.addEventListener('message', messageHandler);
};

// Coming soon
window.showComingSoon = () => { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = () => { document.getElementById('coming-soon-layer').style.display = 'none'; };
        
