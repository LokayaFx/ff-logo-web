// ========================
// STATE MANAGEMENT
// ========================
let currentLogoStyle = 1;
let selectedCharacterId = 1;
let photopeaWindow = null;
let isWaitingForPNG = false;

console.log('✅ Editor.js loaded successfully');

// ========================
// COMING SOON LAYER
// ========================
function showComingSoon() {
    console.log('⏰ showComingSoon() called');
    const layer = document.getElementById('coming-soon-layer');
    if (layer) {
        layer.style.display = 'flex';
        console.log('✅ Coming soon layer shown');
    }
}

function hideComingSoon() {
    console.log('🚫 hideComingSoon() called');
    const layer = document.getElementById('coming-soon-layer');
    if (layer) {
        layer.style.display = 'none';
        console.log('✅ Coming soon layer hidden');
    }
}

// ========================
// NAVIGATION & EDITOR REVEAL
// ========================
function revealEditor() {
    console.log('🚀 revealEditor() called');
    
    const homeNameInput = document.getElementById('home-name');
    const targetNameInput = document.getElementById('target-name');
    const homeSection = document.querySelector('.bg-premium-dark');
    const editorSection = document.getElementById('editor-section');
    
    if (!homeNameInput || !targetNameInput || !homeSection || !editorSection) {
        console.error('❌ Required elements not found!');
        return;
    }
    
    const homeName = homeNameInput.value.trim();
    console.log('📝 Home name:', homeName);
    
    targetNameInput.value = homeName || 'PLAYER';
    
    homeSection.style.display = 'none';
    editorSection.classList.remove('hidden-section');
    editorSection.style.display = 'flex';
    
    console.log('✅ Editor section revealed');
    
    updateMainLogoImage();
    renderCharacters();
}

// ========================
// LOGO STYLE SELECTION
// ========================
function updateCurrentLogo(styleNumber) {
    console.log('🎨 updateCurrentLogo() called - Style:', styleNumber);
    currentLogoStyle = styleNumber;
    selectedCharacterId = 1;
    updateMainLogoImage();
    console.log('✅ Logo style updated');
}

function updateMainLogoImage() {
    console.log('🖼️ updateMainLogoImage() - Style:', currentLogoStyle, 'Char:', selectedCharacterId);
    const mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        const newSrc = './assets/logos/s' + currentLogoStyle + '_c' + selectedCharacterId + '.png';
        mainLogo.src = newSrc;
        console.log('✅ Main logo updated:', newSrc);
        
        const renderPreview = document.getElementById('render-preview');
        if (renderPreview) {
            renderPreview.src = newSrc;
        }
    }
}

// ========================
// CHARACTER GRID RENDERING
// ========================
function renderCharacters() {
    console.log('🎨 renderCharacters() called - Style:', currentLogoStyle);
    
    const charGrid = document.getElementById('char-grid');
    if (!charGrid) {
        console.error('❌ char-grid element not found!');
        return;
    }
    
    charGrid.innerHTML = '';
    
    for (let i = 1; i <= 9; i++) {
        const charCard = document.createElement('div');
        charCard.className = 'aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-transform';
        
        if (i === selectedCharacterId) {
            charCard.classList.add('selected-card');
            console.log('✨ Character', i, 'is selected');
        }
        
        const img = document.createElement('img');
        const imgPath = './assets/logos/s' + currentLogoStyle + '_c' + i + '.png';
        img.src = imgPath;
        img.alt = 'Character ' + i;
        img.className = 'w-full h-full object-cover';
        
        img.onerror = function() {
            console.error('❌ Failed to load image:', imgPath);
        };
        
        img.onload = function() {
            console.log('✅ Image loaded:', imgPath);
        };
        
        charCard.appendChild(img);
        
        charCard.addEventListener('click', (function(charNum) {
            return function() {
                console.log('👆 Character clicked:', charNum);
                selectedCharacterId = charNum;
                updateMainLogoImage();
                renderCharacters();
            };
        })(i));
        
        charGrid.appendChild(charCard);
    }
    
    console.log('✅ Character grid rendered with 9 characters');
}

// ========================
// MODAL MANAGEMENT
// ========================
function toggleModal(modalId, show) {
    console.log('🎭 toggleModal() called - Modal:', modalId, 'Show:', show);
    
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    
    if (!modal || !overlay) {
        console.error('❌ Modal or overlay not found!');
        return;
    }
    
    if (show) {
        document.querySelectorAll('.custom-modal').forEach(function(m) {
            m.classList.remove('modal-active');
        });
        
        overlay.style.display = 'block';
        setTimeout(function() {
            modal.classList.add('modal-active');
        }, 10);
        
        if (modalId === 'char-modal') {
            renderCharacters();
        }
        
        console.log('✅ Modal shown:', modalId);
    } else {
        modal.classList.remove('modal-active');
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 400);
        console.log('✅ Modal hidden:', modalId);
    }
}

function closeAllModals() {
    console.log('🚫 closeAllModals() called');
    
    document.querySelectorAll('.custom-modal').forEach(function(modal) {
        modal.classList.remove('modal-active');
    });
    
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 400);
    }
    
    console.log('✅ All modals closed');
}

// ========================
// LOGO GENERATION
// ========================
function generateFinalLogo() {
    console.log('🎯 generateFinalLogo() called');
    console.log('📊 Current State:', {
        style: currentLogoStyle,
        character: selectedCharacterId
    });
    
    const targetNameInput = document.getElementById('target-name');
    const targetNumberInput = document.getElementById('target-number');
    const targetTitleInput = document.getElementById('target-title');
    
    if (!targetNameInput || !targetNumberInput || !targetTitleInput) {
        console.error('❌ Input elements not found!');
        alert('Error: Required input fields not found!');
        return;
    }
    
    const logoName = targetNameInput.value.trim() || 'PLAYER';
    const logoNumber = targetNumberInput.value.trim() || '99';
    const logoTitle = targetTitleInput.value.trim() || 'LEGEND';
    
    console.log('📝 Logo Details:', { logoName: logoName, logoNumber: logoNumber, logoTitle: logoTitle });
    
    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    const renderPerc = document.getElementById('render-perc');
    const renderStatus = document.getElementById('render-status');
    
    if (!renderScreen || !renderBar) {
        console.error('❌ Render screen elements not found!');
        alert('Error: Render screen not found!');
        return;
    }
    
    renderScreen.style.display = 'flex';
    renderBar.style.width = '0%';
    if (renderPerc) renderPerc.textContent = '0%';
    if (renderStatus) renderStatus.textContent = 'Initializing Photopea Engine...';
    
    console.log('✅ Render screen shown');
    
    animateProgressBar(renderBar, renderPerc, 95, 3000);
    
    initializePhotopea(logoName, logoNumber, logoTitle);
}

function animateProgressBar(element, percElement, targetPercent, duration) {
    console.log('📊 Progress bar animation started');
    
    const startTime = performance.now();
    const startPercent = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentPercent = Math.floor(startPercent + (targetPercent - startPercent) * easeProgress);
        element.style.width = currentPercent + '%';
        
        if (percElement) {
            percElement.textContent = currentPercent + '%';
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            console.log('✅ Progress bar reached', targetPercent + '%');
        }
    }
    
    requestAnimationFrame(update);
}

// ========================
// PHOTOPEA INTEGRATION
// ========================
function initializePhotopea(logoName, logoNumber, logoTitle) {
    console.log('🖼️ Initializing Photopea...');
    
    const psdUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s' + currentLogoStyle + '_c' + selectedCharacterId + '.psd';
    
    let iframe = document.getElementById('photopea-iframe');
    if (!iframe) {
        console.log('📦 Creating new Photopea iframe');
        iframe = document.createElement('iframe');
        iframe.id = 'photopea-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    
    iframe.src = 'https://www.photopea.com/#' + encodeURIComponent(psdUrl);
    console.log('🌐 Loading Photopea with PSD');
    
    iframe.onload = function() {
        console.log('✅ Photopea iframe loaded');
        photopeaWindow = iframe.contentWindow;
        
        window.addEventListener('message', handlePhotopeaMessage);
        console.log('👂 Message listener added');
        
        isWaitingForPNG = false;
        
        setTimeout(function() {
            console.log('⏰ Executing Photopea script after delay');
            updateRenderStatus('Loading font and updating text...');
            executePhotopeaScript(logoName, logoNumber, logoTitle);
        }, 5000);
    };
    
    iframe.onerror = function() {
        console.error('❌ Failed to load Photopea iframe');
        alert('Failed to load Photopea. Please check your internet connection.');
        hideRenderScreen();
    };
}

function executePhotopeaScript(logoName, logoNumber, logoTitle) {
    const fontUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf';
    
    console.log('🔤 Font URL:', fontUrl);
    updateRenderStatus('Loading font and updating layers...');
    
    // New approach: Use app.open with data URL
    const fullScript = 
        'console.log("🔤 Loading font...");' +
        'app.loadFont("' + fontUrl + '");' +
        'setTimeout(function() {' +
        '  console.log("📝 Updating text layers...");' +
        '  var doc = app.activeDocument;' +
        '  try { doc.artLayers.getByName("LogoName").textItem.contents = "' + logoName.replace(/"/g, '\\"') + '"; console.log("✅ Name updated"); } catch(e) { console.error("❌ Name:", e); }' +
        '  try { doc.artLayers.getByName("LogoNumber").textItem.contents = "' + logoNumber.replace(/"/g, '\\"') + '"; console.log("✅ Number updated"); } catch(e) { console.error("❌ Number:", e); }' +
        '  try { doc.artLayers.getByName("LogoTitel").textItem.contents = "' + logoTitle.replace(/"/g, '\\"') + '"; console.log("✅ Title updated"); } catch(e) { console.error("❌ Title:", e); }' +
        '  setTimeout(function() {' +
        '    console.log("💾 Starting export...");' +
        '    app.activeDocument.saveToOE("png");' +
        '    console.log("✅ Export command executed");' +
        '  }, 1000);' +
        '}, 3000);';
    
    console.log('📤 Sending script to Photopea...');
    isWaitingForPNG = true;
    
    photopeaWindow.postMessage(fullScript, '*');
    console.log('✅ Script sent, waiting for response...');
    
    // Extended timeout
    setTimeout(function() {
        if (isWaitingForPNG) {
            console.log('⚠️ ArrayBuffer not received - trying alternative method...');
            
            // Try requesting export again
            console.log('🔄 Sending export command again...');
            photopeaWindow.postMessage('app.activeDocument.saveToOE("png");', '*');
            
            // Wait another 5 seconds
            setTimeout(function() {
                if (isWaitingForPNG) {
                    console.error('❌ Export failed - Photopea may not support saveToOE in this context');
                    isWaitingForPNG = false;
                    
                    alert('Logo export failed. This may be due to browser restrictions. Please try:\n\n1. Refresh the page and try again\n2. Use a different browser (Chrome recommended)\n3. Disable browser extensions temporarily');
                    
                    hideRenderScreen();
                }
            }, 5000);
        }
    }, 15000);
}
function handlePhotopeaMessage(event) {
    if (event.origin !== 'https://www.photopea.com') {
        return;
    }
    
    const data = event.data;
    
    console.log('📨 Message from Photopea - Type:', typeof data, 'IsWaiting:', isWaitingForPNG);
    
    if (isWaitingForPNG && data instanceof ArrayBuffer && data.byteLength > 0) {
        console.log('🎉 PNG ArrayBuffer received!');
        console.log('📊 Size:', data.byteLength, 'bytes');
        
        isWaitingForPNG = false;
        
        updateRenderStatus('Finalizing download...');
        
        const renderBar = document.getElementById('render-bar');
        const renderPerc = document.getElementById('render-perc');
        
        if (renderBar) renderBar.style.width = '100%';
        if (renderPerc) renderPerc.textContent = '100%';
        
        console.log('✅ Progress bar completed');
        
        setTimeout(function() {
            downloadPNG(data);
            setTimeout(function() {
                hideRenderScreen();
            }, 1000);
        }, 500);
    } 
    else if (typeof data === 'string') {
        console.log('ℹ️ String message:', data);
    }
}

function downloadPNG(arrayBuffer) {
    console.log('💾 Starting PNG download');
    
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    
    const logoName = document.getElementById('target-name').value.trim() || 'PLAYER';
    const filename = logoName + '_Logo_S' + currentLogoStyle + '_C' + selectedCharacterId + '.png';
    
    console.log('📁 Filename:', filename);
    console.log('🔗 Blob URL:', url);
    
    updateRenderStatus('Download starting...');
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    console.log('✅ Download triggered');
    
    setTimeout(function() {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('🧹 Cleanup completed');
    }, 100);
}

function hideRenderScreen() {
    console.log('🚫 Hiding render screen');
    
    const renderScreen = document.getElementById('render-screen');
    if (renderScreen) {
        renderScreen.style.display = 'none';
    }
    
    const iframe = document.getElementById('photopea-iframe');
    if (iframe) {
        iframe.remove();
        console.log('🗑️ Photopea iframe removed');
    }
    
    window.removeEventListener('message', handlePhotopeaMessage);
    console.log('👂 Message listener removed');
    
    isWaitingForPNG = false;
}

function updateRenderStatus(message) {
    const renderStatus = document.getElementById('render-status');
    if (renderStatus) {
        renderStatus.textContent = message;
        console.log('📝 Render status updated:', message);
    }
}

// ========================
// SCROLL HEADER
// ========================
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const slimHeader = document.getElementById('slim-header');
    if (slimHeader) {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 100) {
            slimHeader.classList.add('visible');
        } else {
            slimHeader.classList.remove('visible');
        }
        
        lastScrollTop = currentScroll;
    }
});

// ========================
// INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 DOM Content Loaded');
    console.log('✅ Editor initialized successfully');
});

console.log('📜 All functions defined successfully');
