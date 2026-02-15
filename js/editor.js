// ========================
// STATE MANAGEMENT
// ========================
window.currentLogoStyle = 1;
window.selectedCharacterId = 1;

console.log('✅ Editor.js loaded successfully');

// ========================
// COMING SOON LAYER
// ========================
window.showComingSoon = function() {
    console.log('⏰ showComingSoon() called');
    const layer = document.getElementById('coming-soon-layer');
    if (layer) {
        layer.style.display = 'flex';
        console.log('✅ Coming soon layer shown');
    }
};

window.hideComingSoon = function() {
    console.log('🚫 hideComingSoon() called');
    const layer = document.getElementById('coming-soon-layer');
    if (layer) {
        layer.style.display = 'none';
        console.log('✅ Coming soon layer hidden');
    }
};

// ========================
// NAVIGATION & EDITOR REVEAL
// ========================
window.revealEditor = function() {
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
    if (!homeName) {
        alert('Please enter your logo name!');
        return;
    }
    
    console.log('📝 Home name:', homeName);
    
    targetNameInput.value = homeName;
    
    homeSection.style.display = 'none';
    editorSection.classList.remove('hidden-section');
    editorSection.style.display = 'flex';
    
    console.log('✅ Editor section revealed');
    
    // Update main logo image
    updateMainLogoImage();
    
    // Render character grid
    renderCharacters();
    
    // Scroll to editor
    setTimeout(function() {
        editorSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

// ========================
// LOGO STYLE SELECTION (Still here for HTML compatibility)
// ========================
window.updateCurrentLogo = function(styleNumber) {
    console.log('🎨 updateCurrentLogo() called - Style:', styleNumber);
    window.currentLogoStyle = styleNumber;
    window.selectedCharacterId = 1; // Reset to character 1
    updateMainLogoImage();
    
    // Re-render character grid if modal is open
    const charModal = document.getElementById('char-modal');
    if (charModal && charModal.classList.contains('modal-active')) {
        renderCharacters();
    }
    
    console.log('✅ Logo style updated');
};

function updateMainLogoImage() {
    console.log('🖼️ updateMainLogoImage() - Style:', window.currentLogoStyle, 'Char:', window.selectedCharacterId);
    const mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        const newSrc = './assets/logos/s' + window.currentLogoStyle + '_c' + window.selectedCharacterId + '.png';
        mainLogo.src = newSrc;
        console.log('✅ Main logo updated:', newSrc);
        
        const renderPreview = document.getElementById('render-preview');
        if (renderPreview) {
            renderPreview.src = newSrc;
        }
    }
}

// ========================
// CHARACTER GRID RENDERING - ALL STYLES
// ========================
function renderCharacters() {
    console.log('🎨 renderCharacters() called - Showing ALL styles');
    
    const charGrid = document.getElementById('char-grid');
    if (!charGrid) {
        console.error('❌ char-grid element not found!');
        return;
    }
    
    charGrid.innerHTML = '';
    
    // Loop through all 3 styles
    for (let style = 1; style <= 3; style++) {
        // Add style header
        const styleHeader = document.createElement('div');
        styleHeader.className = 'col-span-3 text-center py-2 text-purple-400 text-xs font-bold uppercase tracking-widest';
        styleHeader.textContent = 'Style ' + style;
        charGrid.appendChild(styleHeader);
        
        // Loop through 9 characters for this style
        for (let char = 1; char <= 9; char++) {
            const charCard = document.createElement('div');
            charCard.className = 'aspect-square bg-white/5 rounded-2xl border overflow-hidden cursor-pointer active:scale-95 transition-transform';
            
            // Add selected style if this matches current selection
            if (style === window.currentLogoStyle && char === window.selectedCharacterId) {
                charCard.style.borderColor = '#6638A6';
                charCard.style.borderWidth = '2px';
                charCard.style.boxShadow = '0 0 20px rgba(102, 56, 166, 0.5)';
                console.log('✨ Selected: Style', style, 'Character', char);
            } else {
                charCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                charCard.style.borderWidth = '1px';
            }
            
            const img = document.createElement('img');
            const imgPath = './assets/logos/s' + style + '_c' + char + '.png';
            img.src = imgPath;
            img.alt = 'Style ' + style + ' Character ' + char;
            img.className = 'w-full h-full object-cover';
            
            img.onerror = function() {
                console.error('❌ Failed to load image:', imgPath);
            };
            
            img.onload = function() {
                console.log('✅ Image loaded:', imgPath);
            };
            
            // Click handler for selection
            (function(selectedStyle, selectedChar) {
                charCard.onclick = function() {
                    console.log('👆 Selected: Style', selectedStyle, 'Character', selectedChar);
                    window.currentLogoStyle = selectedStyle;
                    window.selectedCharacterId = selectedChar;
                    updateMainLogoImage();
                    renderCharacters(); // Re-render to update selection
                };
            })(style, char);
            
            charCard.appendChild(img);
            charGrid.appendChild(charCard);
        }
    }
    
    console.log('✅ Character grid rendered with ALL styles (27 total images)');
}

// ========================
// MODAL MANAGEMENT
// ========================
window.toggleModal = function(modalId, show) {
    console.log('🎭 toggleModal() called - Modal:', modalId, 'Show:', show);
    
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    
    if (!modal || !overlay) {
        console.error('❌ Modal or overlay not found!');
        return;
    }
    
    if (show) {
        // Close all other modals first
        document.querySelectorAll('.custom-modal').forEach(function(m) {
            m.classList.remove('modal-active');
        });
        
        overlay.style.display = 'block';
        setTimeout(function() {
            modal.classList.add('modal-active');
            overlay.style.opacity = '1';
        }, 10);
        
        // Render characters when opening char-modal
        if (modalId === 'char-modal') {
            renderCharacters();
        }
        
        console.log('✅ Modal shown:', modalId);
    } else {
        modal.classList.remove('modal-active');
        overlay.style.opacity = '0';
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 400);
        console.log('✅ Modal hidden:', modalId);
    }
};

window.closeAllModals = function() {
    console.log('🚫 closeAllModals() called');
    
    document.querySelectorAll('.custom-modal').forEach(function(modal) {
        modal.classList.remove('modal-active');
    });
    
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 400);
    }
    
    console.log('✅ All modals closed');
};

// ========================
// LOGO GENERATION - PHOTOPEA ENGINE
// ========================
window.generateFinalLogo = function() {
    console.log('🎯 generateFinalLogo() called');
    console.log('📊 Current State:', {
        style: window.currentLogoStyle,
        character: window.selectedCharacterId
    });
    
    const targetNameInput = document.getElementById('target-name');
    const targetNumberInput = document.getElementById('target-number');
    const targetTitleInput = document.getElementById('target-title');
    
    if (!targetNameInput || !targetNumberInput || !targetTitleInput) {
        console.error('❌ Input elements not found!');
        alert('Error: Required input fields not found!');
        return;
    }
    
    const logoName = (targetNameInput.value.trim() || 'PLAYER').toUpperCase();
    const logoNumber = targetNumberInput.value.trim() || '';
    const logoTitle = (targetTitleInput.value.trim() || '').toUpperCase();
    
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
    
    // Show render screen
    renderScreen.style.display = 'flex';
    renderScreen.classList.remove('hidden');
    renderBar.style.width = '0%';
    if (renderPerc) renderPerc.textContent = '0%';
    if (renderStatus) renderStatus.textContent = 'Initializing Photopea Engine...';
    
    console.log('✅ Render screen shown');
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(function() {
        progress += 1;
        if (progress > 95) progress = 95;
        renderBar.style.width = progress + '%';
        if (renderPerc) renderPerc.textContent = progress + '%';
    }, 150);
    
    // Build URLs
    const psdUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s' + window.currentLogoStyle + '_c' + window.selectedCharacterId + '.psd';
    const fontUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf';
    
    console.log('📄 PSD URL:', psdUrl);
    console.log('🔤 Font URL:', fontUrl);
    
    // Photopea script
    const photopeaScript = 
        'app.loadFont("' + fontUrl + '");' +
        'function process() {' +
        '  if(app.documents.length == 0) return;' +
        '  var doc = app.activeDocument;' +
        '  function setLayer(name, value) {' +
        '    try {' +
        '      var layer = doc.artLayers.getByName(name);' +
        '      if(layer) layer.textItem.contents = value;' +
        '      console.log("Updated", name, "with", value);' +
        '    } catch(e) {' +
        '      console.error("Error updating", name, ":", e);' +
        '    }' +
        '  }' +
        '  setLayer("LogoName", "' + logoName.replace(/"/g, '\\"') + '");' +
        '  setLayer("LogoNumber", "' + logoNumber.replace(/"/g, '\\"') + '");' +
        '  setLayer("LogoTitel", "' + logoTitle.replace(/"/g, '\\"') + '");' +
        '  setTimeout(function() {' +
        '    doc.saveToOE("png");' +
        '    console.log("Export command sent");' +
        '  }, 500);' +
        '}' +
        'setTimeout(function() { process(); }, 3000);';
    
    // Create Photopea configuration
    const config = {
        files: [psdUrl],
        script: photopeaScript
    };
    
    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.id = 'photopea-iframe';
    iframe.src = 'https://www.photopea.com#' + encodeURIComponent(JSON.stringify(config));
    document.body.appendChild(iframe);
    
    console.log('✅ Photopea iframe created');
    
    let downloadReceived = false;
    
    // Listen for Photopea messages
    function handlePhotopeaMessage(event) {
        if (event.origin !== 'https://www.photopea.com') return;
        
        console.log('📨 Message from Photopea - Type:', typeof event.data);
        
        if (event.data instanceof ArrayBuffer && event.data.byteLength > 0) {
            console.log('🎉 PNG ArrayBuffer received!');
            console.log('📊 Size:', event.data.byteLength, 'bytes');
            
            downloadReceived = true;
            clearInterval(progressInterval);
            
            renderBar.style.width = '100%';
            if (renderPerc) renderPerc.textContent = '100%';
            if (renderStatus) renderStatus.textContent = 'Download starting...';
            
            // Create download
            const blob = new Blob([event.data], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            const filename = logoName + '_Logo_S' + window.currentLogoStyle + '_C' + window.selectedCharacterId + '.png';
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            
            console.log('✅ Download triggered:', filename);
            
            // Cleanup
            setTimeout(function() {
                renderScreen.style.display = 'none';
                renderScreen.classList.add('hidden');
                const iframeToRemove = document.getElementById('photopea-iframe');
                if (iframeToRemove) document.body.removeChild(iframeToRemove);
                URL.revokeObjectURL(url);
                window.removeEventListener('message', handlePhotopeaMessage);
                console.log('🧹 Cleanup completed');
            }, 1500);
        }
    }
    
    window.addEventListener('message', handlePhotopeaMessage);
    
    // Timeout fallback
    setTimeout(function() {
        if (!downloadReceived) {
            clearInterval(progressInterval);
            console.error('❌ Export timeout - no ArrayBuffer received');
            
            if (renderStatus) {
                renderStatus.textContent = 'Export timeout - Please try again';
            }
            
            setTimeout(function() {
                renderScreen.style.display = 'none';
                renderScreen.classList.add('hidden');
                const iframeToRemove = document.getElementById('photopea-iframe');
                if (iframeToRemove) document.body.removeChild(iframeToRemove);
                alert('❌ Logo export failed.\n\nPlease try again or check your internet connection.');
            }, 2000);
        }
    }, 25000);
};

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
    console.log('Current style:', window.currentLogoStyle);
    console.log('Current character:', window.selectedCharacterId);
    console.log('✅ Editor initialized successfully');
});

console.log('📜 All functions defined successfully');
