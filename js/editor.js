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
        const newSrc = `./assets/logos/s${currentLogoStyle}_c${selectedCharacterId}.png`;
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
        const imgPath = `./assets/logos/s${currentLogoStyle}_c${i}.png`;
        img.src = imgPath;
        img.alt = `Character ${i}`;
        img.className = 'w-full h-full object-cover';
        
        img.onerror = function() {
            console.error('❌ Failed to load image:', imgPath);
        };
        
        img.onload = function() {
            console.log('✅ Image loaded:', imgPath);
        };
        
        charCard.appendChild(img);
        
        charCard.addEventListener('click', () => {
            console.log('👆 Character clicked:', i);
            selectedCharacterId = i;
            updateMainLogoImage();
            renderCharacters();
        });
        
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
        document.querySelectorAll('.custom-modal').forEach(m => {
            m.classList.remove('modal-active');
        });
        
        overlay.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('modal-active');
        }, 10);
        
        if (modalId === 'char-modal') {
            renderCharacters();
        }
        
        console.log('✅ Modal shown:', modalId);
    } else {
        modal.classList.remove('modal-active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 400);
        console.log('✅ Modal hidden:', modalId);
    }
}

function closeAllModals() {
    console.log('🚫 closeAllModals() called');
    
    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.classList.remove('modal-active');
    });
    
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        setTimeout(() => {
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
    
    console.log('📝 Logo Details:', { logoName, logoNumber, logoTitle });
    
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
// PHOTOPEA INTEGRATION - NEW METHOD
// ========================
function initializePhotopea(logoName, logoNumber, logoTitle) {
    console.log('🖼️ Initializing Photopea...');
    
    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${currentLogoStyle}_c${selectedCharacterId}.psd`;
    
    let iframe = document.getElementById('photopea-iframe');
    if (!iframe) {
        console.log('📦 Creating new Photopea iframe');
        iframe = document.createElement('iframe');
        iframe.id = 'photopea-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    
    // Load Photopea with PSD file directly
    iframe.src = `https://www.photopea.com/#${encodeURIComponent(psdUrl)}`;
    console.log('🌐 Loading Photopea with PSD');
    
    iframe.onload = function() {
        console.log('✅ Photopea iframe loaded');
        photopeaWindow = iframe.contentWindow;
        
        window.addEventListener('message', handlePhotopeaMessage);
        console.log('👂 Message listener added');
        
        isWaitingForPNG = false;
        
        setTimeout(() => {
            console.log('⏰ Executing Photopea script after delay');
            updateRenderStatus('Loading font and updating text...');
            executePhotopeaScript(logoName, logoNumber, logoTitle);
        }, 5000); // Longer delay for PSD to fully load
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
    
    // Send individual commands with delays
    setTimeout(() => {
        console.log('📤 Loading font...');
        photopeaWindow.postMessage(`app.loadFont("${fontUrl}");`, '*');
        
        setTimeout(() => {
            console.log('📤 Updating LogoName...');
            photopeaWindow.postMessage(`app.activeDocument.artLayers.getByName("LogoName").textItem.contents = "${logoName.replace(/"/g, '\\"')}";`, '*');
            
            setTimeout(() => {
                console.log('📤 Updating LogoNumber...');
                photopeaWindow.postMessage(`app.activeDocument.artLayers.getByName("LogoNumber").textItem.contents = "${logoNumber.replace(/"/g, '\\"')}";`, '*');
                
                setTimeout(() => {
                    console.log('📤 Updating LogoTitel...');
                    photopeaWindow.postMessage(`app.activeDocument.artLayers.getByName("LogoTitel").textItem.contents = "${logoTitle.replace(/"/g, '\\"')}";`, '*');
                    
                    setTimeout(() => {
                        console.log('📤 Exporting PNG...');
                        updateRenderStatus('Exporting PNG...');
                        isWaitingForPNG = true;
                        photopeaWindow.postMessage('app.activeDocument.saveToOE("png");', '*');
                    }, 500);
                }, 500);
            }, 500);
        }, 2000);
    }, 500);
}

function handlePhotopeaMessage(event) {
    if (event.origin !== 'https://www.photopea.com') {
        return;
    }
    
    const data = event.data;
    
    console.log('📨 Message from Photopea - Type:', typeof data, 'IsWaiting:', isWaitingForPNG);
    
    // Only accept ArrayBuffer when we're waiting for PNG
    if (isWaitingForPNG && data instanceof ArrayBuffer && data.byteLength > 0) {
        console.log('🎉 PNG ArrayBuffer received!');
        console.log('📊 Size:', data.byteLength, 'bytes');
        
        isWaitingForPNG = false;
        
        updateRenderStatus('Finalizing download.
