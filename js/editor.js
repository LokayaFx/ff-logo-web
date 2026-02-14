// ========================
// STATE MANAGEMENT
// ========================
let currentLogoStyle = 1;
let selectedCharacterId = 1;
let photopeaWindow = null;

console.log('✅ Editor.js loaded successfully');

// ========================
// NAVIGATION & INITIALIZATION
// ========================
function revealEditor() {
    console.log('🚀 revealEditor() called');
    
    const homeName = document.getElementById('home-name').value.trim();
    console.log('📝 Home name:', homeName);
    
    document.getElementById('target-name').value = homeName || 'PLAYER';
    
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('editor-section').style.display = 'block';
    
    console.log('✅ Editor section revealed');
    
    renderCharacters();
}

// ========================
// CHARACTER GRID RENDERING
// ========================
function renderCharacters() {
    console.log('🎨 renderCharacters() called - Style:', currentLogoStyle);
    
    const charGrid = document.getElementById('char-grid');
    charGrid.innerHTML = '';
    
    for (let i = 1; i <= 9; i++) {
        const charCard = document.createElement('div');
        charCard.className = 'char-card';
        
        if (i === selectedCharacterId) {
            charCard.classList.add('selected');
            console.log('✨ Character', i, 'is selected');
        }
        
        const img = document.createElement('img');
        const imgPath = `./assets/logos/s${currentLogoStyle}_c${i}.png`;
        img.src = imgPath;
        img.alt = `Character ${i}`;
        img.loading = 'lazy';
        
        console.log('🖼️ Loading image:', imgPath);
        
        img.onerror = function() {
            console.error('❌ Failed to load image:', imgPath);
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="%23666" text-anchor="middle" dy=".3em" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
        };
        
        img.onload = function() {
            console.log('✅ Image loaded successfully:', imgPath);
        };
        
        charCard.appendChild(img);
        
        charCard.addEventListener('click', () => {
            console.log('👆 Character clicked:', i);
            selectedCharacterId = i;
            renderCharacters();
        });
        
        charGrid.appendChild(charCard);
    }
    
    console.log('✅ Character grid rendered with 9 characters');
}

// ========================
// STYLE SELECTION
// ========================
function selectStyle(styleNumber) {
    console.log('🎨 Style selected:', styleNumber);
    
    currentLogoStyle = styleNumber;
    
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderCharacters();
}

// ========================
// PHOTOPEA RENDERING LOGIC
// ========================
function generateLogo() {
    console.log('🎯 generateLogo() called');
    console.log('📊 Current State:', {
        style: currentLogoStyle,
        character: selectedCharacterId
    });
    
    const logoName = document.getElementById('target-name').value.trim() || 'PLAYER';
    const logoNumber = document.getElementById('target-number').value.trim() || '99';
    const logoTitle = document.getElementById('target-title').value.trim() || 'LEGEND';
    
    console.log('📝 Logo Details:', { logoName, logoNumber, logoTitle });
    
    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    
    renderScreen.style.display = 'flex';
    renderBar.style.width = '0%';
    
    console.log('✅ Render screen shown');
    
    animateProgressBar(renderBar, 95, 2000);
    
    initializePhotopea(logoName, logoNumber, logoTitle);
}

function animateProgressBar(element, targetPercent, duration) {
    console.log('📊 Progress bar animation started');
    
    const startTime = performance.now();
    const startPercent = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentPercent = startPercent + (targetPercent - startPercent) * easeProgress;
        element.style.width = currentPercent + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            console.log('✅ Progress bar reached', targetPercent + '%');
        }
    }
    
    requestAnimationFrame(update);
}

function initializePhotopea(logoName, logoNumber, logoTitle) {
    console.log('🖼️ Initializing Photopea...');
    
    let iframe = document.getElementById('photopea-iframe');
    if (!iframe) {
        console.log('📦 Creating new Photopea iframe');
        iframe = document.createElement('iframe');
        iframe.id = 'photopea-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    
    iframe.src = 'https://www.photopea.com/';
    console.log('🌐 Loading Photopea from:', iframe.src);
    
    iframe.onload = function() {
        console.log('✅ Photopea iframe loaded');
        photopeaWindow = iframe.contentWindow;
        
        window.addEventListener('message', handlePhotopeaMessage);
        console.log('👂 Message listener added');
        
        setTimeout(() => {
            console.log('⏰ Executing Photopea script after delay');
            executePhotopeaScript(logoName, logoNumber, logoTitle);
        }, 1000);
    };
    
    iframe.onerror = function() {
        console.error('❌ Failed to load Photopea iframe');
    };
}

function executePhotopeaScript(logoName, logoNumber, logoTitle) {
    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${currentLogoStyle}_c${selectedCharacterId}.psd`;
    const fontUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf';
    
    console.log('📄 PSD URL:', psdUrl);
    console.log('🔤 Font URL:', fontUrl);
    
    const script = `
        app.echoToOE = false;
        console.log('🎨 Photopea script started');
        
        function waitForFonts(callback, maxAttempts) {
            var attempts = 0;
            var interval = setInterval(function() {
                attempts++;
                console.log('⏳ Waiting for fonts... Attempt:', attempts);
                if (app.fontsLoaded || attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.log('✅ Font check complete. Loaded:', app.fontsLoaded);
                    callback(app.fontsLoaded);
                }
            }, 100);
        }
        
        console.log('📂 Opening PSD file...');
        app.open("${psdUrl}");
        
        console.log('🔤 Loading font...');
        app.loadFont("${fontUrl}");
        
        waitForFonts(function(loaded) {
            if (loaded) {
                console.log('✅ Fonts loaded successfully');
                var doc = app.activeDocument;
                console.log('📄 Document:', doc.name);
                
                try {
                    var nameLayer = doc.artLayers.getByName("LogoName");
                    if (nameLayer) {
                        nameLayer.textItem.contents = "${logoName.replace(/"/g, '\\"')}";
                        console.log('✅ LogoName updated');
                    }
                } catch(e) {
                    console.error('❌ Error updating LogoName:', e.message);
                }
                
                try {
                    var numberLayer = doc.artLayers.getByName("LogoNumber");
                    if (numberLayer) {
                        numberLayer.textItem.contents = "${logoNumber.replace(/"/g, '\\"')}";
                        console.log('✅ LogoNumber updated');
                    }
                } catch(e) {
                    console.error('❌ Error updating LogoNumber:', e.message);
                }
                
                try {
                    var titleLayer = doc.artLayers.getByName("LogoTitel");
                    if (titleLayer) {
                        titleLayer.textItem.contents = "${logoTitle.replace(/"/g, '\\"')}";
                        console.log('✅ LogoTitel updated');
                    }
                } catch(e) {
                    console.error('❌ Error updating LogoTitel:', e.message);
                }
                
                console.log('💾 Exporting PNG...');
                app.activeDocument.saveToOE("png");
                console.log('✅ Export command sent');
                
            } else {
                console.error('❌ Font loading timeout');
                alert("Font loading failed");
            }
        }, 50);
    `;
    
    console.log('📤 Sending script to Photopea');
    photopeaWindow.postMessage(script, '*');
}

function handlePhotopeaMessage(event) {
    console.log('📨 Message received from:', event.origin);
    console.log('📦 Message type:', typeof event.data);
    console.log('📦 Message data:', event.data);
    
    if (event.origin !== 'https://www.photopea.com') {
        console.log('⚠️ Message not from Photopea, ignoring');
        return;
    }
    
    const data = event.data;
    
    if (data instanceof ArrayBuffer) {
        console.log('🎉 PNG ArrayBuffer received!');
        console.log('📊 Size:', data.byteLength, 'bytes');
        
        const renderBar = document.getElementById('render-bar');
        renderBar.style.width = '100%';
        console.log('✅ Progress bar completed');
        
        setTimeout(() => {
            downloadPNG(data);
            hideRenderScreen();
        }, 500);
    } else {
        console.log('ℹ️ Non-ArrayBuffer message:', data);
    }
}

function downloadPNG(arrayBuffer) {
    console.log('💾 Starting PNG download');
    
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    
    const logoName = document.getElementById('target-name').value.trim() || 'PLAYER';
    const filename = `${logoName}_Logo_Style${currentLogoStyle}_Char${selectedCharacterId}.png`;
    
    console.log('📁 Filename:', filename);
    console.log('🔗 Blob URL:', url);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    console.log('✅ Download triggered');
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('🧹 Cleanup completed');
    }, 100);
}

function hideRenderScreen() {
    console.log('🚫 Hiding render screen');
    
    const renderScreen = document.getElementById('render-screen');
    renderScreen.style.display = 'none';
    
    const iframe = document.getElementById('photopea-iframe');
    if (iframe) {
        iframe.remove();
        console.log('🗑️ Photopea iframe removed');
    }
    
    window.removeEventListener('message', handlePhotopeaMessage);
    console.log('👂 Message listener removed');
}

// ========================
// INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 DOM Content Loaded');
    
    const defaultStyleBtn = document.querySelector('.style-btn[onclick*="selectStyle(1)"]');
    if (defaultStyleBtn) {
        defaultStyleBtn.classList.add('active');
        console.log('✅ Default style button activated');
    }
});

console.log('📜 All functions defined successfully');
