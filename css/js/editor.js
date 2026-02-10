let currentLogoStyle = 1;

        function updateCurrentLogo(styleId) {
            currentLogoStyle = styleId;
            renderCharacters();
        }

        function renderCharacters() {
            const grid = document.getElementById('char-grid');
            grid.innerHTML = "";
            for(let i=1; i<=9; i++) {
                grid.innerHTML += `
                    <div onclick="selectFinal(this, ${i})" class="char-item aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden cursor-pointer active:scale-95 transition-all">
                        <img src="https://via.placeholder.com/150?text=Logo${currentLogoStyle}_Char${i}" class="w-full h-full object-cover">
                    </div>
                `;
            }
        }

        function selectFinal(el, charId) {
            document.querySelectorAll('.char-item').forEach(d => d.classList.remove('selected-card'));
            el.classList.add('selected-card');
            document.getElementById('main-logo').src = `https://via.placeholder.com/500?text=Logo${currentLogoStyle}_Char${charId}`;
        }

        function showComingSoon() { document.getElementById('coming-soon-layer').style.display = 'flex'; }
        function hideComingSoon() { document.getElementById('coming-soon-layer').style.display = 'none'; }
        
        function revealEditor() {
            const name = document.getElementById("home-name").value;
            if(!name) return;
            document.getElementById("editor-section").classList.remove("hidden-section");
            document.getElementById("target-name").value = name;
            renderCharacters();
            setTimeout(() => { document.getElementById("editor-section").scrollIntoView({ behavior: 'smooth' }); }, 100);
        }

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
