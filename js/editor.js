// ========================
// STATE MANAGEMENT
// ========================
let currentLogoStyle = 1;
let selectedCharacterId = 1;
let photopeaWindow = null;

// ========================
// NAVIGATION & INITIALIZATION
// ========================
function revealEditor() {
    // Copy name from home input to editor input
    const homeName = document.getElementById('home-name').value.trim();
    document.getElementById('target-name').value = homeName || 'PLAYER';
    
    // Show editor section
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('editor-section').style.display = 'block';
    
    // Render character grid for current style
    renderCharacters();
}

// ========================
// CHARACTER GRID RENDERING
// ========================
function renderCharacters() {
    const charGrid = document.getElementById('char-grid');
    charGrid.innerHTML = ''; // Clear existing grid
    
    // Generate 9 character thumbnails
    for (let i = 1; i <= 9; i++) {
        const charCard = document.createElement('div');
        charCard.className = 'char-card';
        
        // Add selected class if this is the current character
        if (i === selectedCharacterId) {
            charCard.classList.add('selected');
        }
        
        const img = document.createElement('img');
        img.src = `./assets/logos/s${currentLogoStyle}_c${i}.png`;
        img.alt = `Character ${i}`;
        img.loading = 'lazy';
        
        // Handle image load errors
        img.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="%23666" text-anchor="middle" dy=".3em" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
        };
        
        charCard.appendChild(img);
        
        // Click handler for character selection
        charCard.addEventListener('click', () => {
            selectedCharacterId = i;
            renderCharacters(); // Re-render to update selection
        });
        
        charGrid.appendChild(charCard);
    }
}

// ========================
// STYLE SELECTION
// ========================
function selectStyle(styleNumber) {
    currentLogoStyle = styleNumber;
    
    // Update active state on style buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-render characters for new style
    renderCharacters();
}

// ========================
// PHOTOPEA RENDERING LOGIC
// ========================
function generateLogo() {
    // Get user inputs
    const logoName = document.getElementById('target-name').value.trim() || 'PLAYER';
    const logoNumber = document.getElementById('target-number').value.trim() || '99';
    const logoTitle = document.getElementById('target-title').value.trim() || 'LEGEND';
    
    // Show render screen
    const renderScreen = document.getElementById('render-screen');
    const renderBar = document.getElementById('render-bar');
    renderScreen.style.display = 'flex';
    renderBar.style.width = '0%';
    
    // Animate progress bar to 95%
    animateProgressBar(renderBar, 95, 2000);
    
    // Initialize Photopea in hidden iframe
    initializePhotopea(logoName, logoNumber, logoTitle);
}

function animateProgressBar(element, targetPercent, duration) {
    const startTime = performance.now();
    const startPercent = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentPercent = startPercent + (targetPercent - startPercent) * easeProgress;
        element.style.width = currentPercent + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function initializePhotopea(logoName, logoNumber, logoTitle) {
    // Create hidden iframe for Photopea
    let iframe = document.getElementById('photopea-iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'photopea-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    
    // Load Photopea
    iframe.src = 'https://www.photopea.com/';
    
    // Wait for Photopea to load
    iframe.onload = function() {
        photopeaWindow = iframe.contentWindow;
        
        // Set up message listener for Photopea responses
        window.addEventListener('message', handlePhotopeaMessage);
        
        // Small delay to ensure Photopea is fully initialized
        setTimeout(() => {
            executePhotopeaScript(logoName, logoNumber, logoTitle);
        }, 1000);
    };
}

function executePhotopeaScript(logoName, logoNumber, logoTitle) {
    const psdUrl = `https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/psds/s${currentLogoStyle}_c${selectedCharacterId}.psd`;
    const fontUrl = 'https://raw.githubusercontent.com/LokayaFx/ff-logo-web/main/assets/Muro.otf';
    
    const script = `
        // Load the PSD file
        app.echoToOE = true;
        
        async function processLogo() {
            try {
                // Load PSD from URL
                await app.open("${psdUrl}");
                
                // Load custom font
                await app.loadFont("${fontUrl}");
                
                // Wait for fonts to be loaded
                let fontCheckAttempts = 0;
                while (!app.fontsLoaded && fontCheckAttempts < 50) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    fontCheckAttempts++;
                }
                
                if (!app.fontsLoaded) {
                    throw new Error("Fonts failed to load");
                }
                
                // Update text layers
                const doc = app.activeDocument;
                
                // Update LogoName layer
                try {
                    const nameLayer = doc.layers.getByName("LogoName");
                    if (nameLayer && nameLayer.kind === "text") {
                        nameLayer.textItem.contents = "${logoName.replace(/"/g, '\\"')}";
                    }
                } catch(e) {
                    console.error("Error updating LogoName:", e);
                }
                
                // Update LogoNumber layer
                try {
                    const numberLayer = doc.layers.getByName("LogoNumber");
                    if (numberLayer && numberLayer.kind === "text") {
                        numberLayer.textItem.contents = "${logoNumber.replace(/"/g, '\\"')}";
                    }
                } catch(e) {
                    console.error("Error updating LogoNumber:", e);
                }
                
                // Update LogoTitel layer
                try {
                    const titleLayer = doc.layers.getByName("LogoTitel");
                    if (titleLayer && titleLayer.kind === "text") {
                        titleLayer.textItem.contents = "${logoTitle.replace(/"/g, '\\"')}";
                    }
                } catch(e) {
                    console.error("Error updating LogoTitel:", e);
                }
                
                // Final check before export
                if (app.fontsLoaded) {
                    // Export as PNG
                    await doc.saveToOE("png");
                } else {
                    throw new Error("Fonts not loaded before export");
                }
                
            } catch(error) {
                alert("Error: " + error.message);
            }
        }
        
        processLogo();
    `;
    
    // Send script to Photopea
    photopeaWindow.postMessage(script, '*');
}

function handlePhotopeaMessage(event) {
    // Check if message is from Photopea
    if (event.origin !== 'https://www.photopea.com') return;
    
    const data = event.data;
    
    // Check if this is the PNG ArrayBuffer
    if (data instanceof ArrayBuffer) {
        // Complete progress bar
        const renderBar = document.getElementById('render-bar');
        renderBar.style.width = '100%';
        
        // Convert ArrayBuffer to Blob and download
        setTimeout(() => {
            downloadPNG(data);
            hideRenderScreen();
        }, 500);
        
        // Clean up message listener
        window.removeEventListener('message', handlePhotopeaMessage);
    }
}

function downloadPNG(arrayBuffer) {
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    
    const logoName = document.getElementById('target-name').value.trim() || 'PLAYER';
    const filename = `${logoName}_Logo_Style${currentLogoStyle}_Char${selectedCharacterId}.png`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

function hideRenderScreen() {
    const renderScreen = document.getElementById('render-screen');
    renderScreen.style.display = 'none';
    
    // Remove Photopea iframe
    const iframe = document.getElementById('photopea-iframe');
    if (iframe) {
        iframe.remove();
    }
}

// ========================
// INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // Set default active style button
    const defaultStyleBtn = document.querySelector('.style-btn[onclick*="selectStyle(1)"]');
    if (defaultStyleBtn) {
        defaultStyleBtn.classList.add('active');
    }
});
