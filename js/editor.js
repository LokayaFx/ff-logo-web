window.currentLogoStyle = 1;

window.updateCurrentLogo = function(styleId) {
    window.currentLogoStyle = styleId;
    window.renderCharacters();
};

window.renderCharacters = function() {
    const grid = document.getElementById('char-grid');
    if(!grid) return;
    grid.innerHTML = "";
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div onclick="selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer">
                <img src="assets/logos/s${window.currentLogoStyle}_c${i}.jpg" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            </div>
        `;
    }
};

window.selectFinal = function(el, charId) {
    document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
    el.classList.add('selected-card');
    document.getElementById('main-logo').src = `assets/logos/s${window.currentLogoStyle}_c${charId}.jpg`;
};

window.showComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'flex'; };
window.hideComingSoon = function() { document.getElementById('coming-soon-layer').style.display = 'none'; };

window.revealEditor = function() {
    const name = document.getElementById("home-name").value;
    if(!name) return;
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
    if(o) {
        o.style.opacity = '0';
        setTimeout(() => { o.style.display = 'none'; }, 400);
    }
};

window.onscroll = function() {
    const header = document.getElementById("slim-header");
    if(header) header.classList.toggle("visible", window.pageYOffset > 300);
};

        window.onscroll = function() {
            const header = document.getElementById("slim-header");
            if(header) header.classList.toggle("visible", window.pageYOffset > 300);
        };

        function toggleModal(id, show) {
            if (show) {
                document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
                const m = document.getElementById(id);
                const o = document.getElementById('modal-overlay');
                if(m && o) {
                    o.style.display = 'block'; 
                    setTimeout(() => { m.classList.add('modal-active'); o.style.opacity = '1'; }, 10);
                }
            }
        }

        function closeAllModals() {
            document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('modal-active'));
            const o = document.getElementById('modal-overlay');
            if(o) {
                o.style.opacity = '0';
                setTimeout(() => { o.style.display = 'none'; }, 400);
            }
        }
