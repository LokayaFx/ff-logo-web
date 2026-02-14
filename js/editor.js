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
// LOGO GENERATION - NEW POPUP METHOD
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
    
    // Build URLs
    const psdUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s' + currentLogoStyle + '_c' + selectedCharacterId + '.psd';
    const fontUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf';
    
    console.log('📄 PSD URL:', psdUrl);
    console.log('🔤 Font URL:', fontUrl);
    
    // Open Photopea in new window
    const photopeaUrl = 'https://www.photopea.com/' + encodeURIComponent(psdUrl);
    const newWindow = window.open(
        photopeaUrl,
        'PhotopeaEditor',
        'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no'
    );
    
    if (!newWindow) {
        alert('❌ Please allow popups!\n\nYour browser blocked the Photopea editor.\n\nPlease enable popups for this site and try again.');
        console.error('❌ Popup blocked');
        return;
    }
    
    console.log('✅ Photopea window opened');
    
    // Wait for Photopea to load, then send update commands
    setTimeout(function() {
        console.log('📤 Sending update commands to Photopea...');
        
        // Escape special characters in text
        const safeName = logoName.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");
        const safeNumber = logoNumber.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");
        const safeTitle = logoTitle.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");
        
        // Build script
        const updateScript = 
            'app.loadFont("' + fontUrl + '");' +
            'setTimeout(function() {' +
            '  var doc = app.activeDocument;' +
            '  try { doc.artLayers.getByName("LogoName").textItem.contents = "' + safeName + '"; } catch(e) { console.error("Name error:", e); }' +
            '  try { doc.artLayers.getByName("LogoNumber").textItem.contents = "' + safeNumber + '"; } catch(e) { console.error("Number error:", e); }' +
            '  try { doc.artLayers.getByName("LogoTitel").textItem.contents = "' + safeTitle + '"; } catch(e) { console.error("Title error:", e); }' +
            '  alert("✅ Logo Updated Successfully!\\n\\nTo Download:\\n1. Click: File > Export As > PNG\\n2. Or Press: Ctrl+Shift+E (Windows) / Cmd+Shift+E (Mac)");' +
            '}, 3000);';
        
        try {
            newWindow.postMessage(updateScript, '*');
            console.log('✅ Commands sent successfully');
            
            // Show instruction to user
            alert('✅ Photopea Editor Opened!\n\n' +
                  'Your logo is being updated automatically.\n\n' +
                  'After the update message appears:\n' +
                  '1. Click: File > Export As > PNG\n' +
                  '2. Or Press: Ctrl+Shift+E\n\n' +
                  'The logo will download to your computer.');
            
        } catch (error) {
            console.error('❌ Error sending commands:', error);
            alert('⚠️ Commands sent but there may be an error.\n\nPlease manually update the text layers in Photopea if needed.');
        }
        
    }, 6000); // Wait 6 seconds for Photopea to fully load
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
