/* ==========================================================================
   INSANO TECH HUB - MASTER APPLICATION COORDINATOR (UPGRADED v2.0)
   Features: Synthwave audio beats generator (Web Audio API), Canvas visualizer,
             dynamic toast alerts overlay
   ========================================================================== */

const app = (() => {
    // Navigation routing map
    const pageDetails = {
        dashboard: { title: 'DASHBOARD', subtitle: 'Panel de Control General y Estadísticas' },
        tienda: { title: 'TIENDA TECNOLÓGICA', subtitle: 'Computadoras Premium & Suscripciones de Streaming' },
        'servicio-tecnico': { title: 'SOPORTE TÉCNICO', subtitle: 'Diagnóstico de Hardware y Mantenimiento' },
        matriculas: { title: 'SISTEMA DE MATRÍCULAS', subtitle: 'IESTP Hermanos Cárcamo - Paita' },
        satisfaccion: { title: 'AUDITORÍA DE CALIDAD', subtitle: 'Tabulación de Encuesta de Satisfacción (Anexo A)' },
        'consola-db': { title: 'CONSOLA DE DESARROLLADOR', subtitle: 'Esquemas de Base de Datos & Pruebas Unitarias' }
    };

    // Interactive sound generator (Web Audio API)
    const sfx = (() => {
        let audioCtx = null;
        let enabled = true;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        function playBeep(freq, type, duration, vol = 0.1) {
            if (!enabled) return;
            try {
                initAudio();
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                
                gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
                
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch (e) {
                console.warn('Audio SFX play blocked:', e);
            }
        }

        return {
            toggle: (state) => { enabled = state; return enabled; },
            isEnabled: () => enabled,
            click: () => playBeep(880, 'triangle', 0.08, 0.08),
            hover: () => playBeep(1200, 'sine', 0.04, 0.03),
            success: () => {
                playBeep(523.25, 'sine', 0.15, 0.1);
                setTimeout(() => playBeep(659.25, 'sine', 0.15, 0.1), 100);
                setTimeout(() => playBeep(783.99, 'sine', 0.25, 0.1), 200);
            },
            error: () => {
                playBeep(220, 'sawtooth', 0.15, 0.15);
                setTimeout(() => playBeep(180, 'sawtooth', 0.25, 0.15), 120);
            }
        };
    })();

    // Global Toast Notification System (new intuitive style!)
    function showToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Play SFX according to type
        if (type === 'success') sfx.success();
        else if (type === 'error') sfx.error();
        else sfx.click();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Structure
        toast.innerHTML = `
            <div class="toast-header">
                <span>${title}</span>
                <span style="font-weight: bold; cursor: pointer;" onclick="this.parentNode.parentNode.remove()">&times;</span>
            </div>
            <div class="toast-body">${message}</div>
            <div class="toast-progress"></div>
        `;

        container.appendChild(toast);

        // Slide out timer
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px) scale(0.9)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Audio Web Synthwave Melodies Loop (Web Audio API)
    let audio = {
        isPlaying: false,
        ctx: null,
        gain: null,
        analyser: null,
        seqTimer: null,
        vizAnimId: null,
        frequencyData: null
    };

    const synthTrack = [
        // Cyberpunk synth arpeggio pattern: [frequency, duration_ms]
        [110.00, 200], [130.81, 200], [164.81, 200], [196.00, 200], // A2 -> C3 -> E3 -> G3
        [110.00, 200], [130.81, 200], [164.81, 200], [220.00, 200], // A2 -> C3 -> E3 -> A3
        [146.83, 200], [174.61, 200], [220.00, 200], [261.63, 200], // D3 -> F3 -> A3 -> C4
        [164.81, 200], [196.00, 200], [246.94, 200], [293.66, 200]  // E3 -> G3 -> B3 -> D4
    ];

    let synthStep = 0;

    function initAudioContext() {
        if (!audio.ctx) {
            audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
            audio.gain = audio.ctx.createGain();
            audio.analyser = audio.ctx.createAnalyser();
            audio.analyser.fftSize = 64; // Low detail for cleaner visualization
            
            // Connect nodes
            audio.gain.connect(audio.analyser);
            audio.analyser.connect(audio.ctx.destination);
            
            // Initial volume setting
            const volSlider = document.getElementById('audio-volume');
            if (volSlider) {
                audio.gain.gain.value = (parseFloat(volSlider.value) / 100) * 0.15; // capped max volume for safety
            } else {
                audio.gain.gain.value = 0.06;
            }

            audio.frequencyData = new Uint8Array(audio.analyser.frequencyBinCount);
        }
    }

    function startSynthBeat() {
        initAudioContext();
        if (audio.isPlaying) return;

        // Resume context in case browser blocked it
        if (audio.ctx.state === 'suspended') {
            audio.ctx.resume();
        }

        audio.isPlaying = true;
        
        // Visual updates
        document.getElementById('btn-audio-play').disabled = true;
        document.getElementById('btn-audio-stop').disabled = false;
        document.getElementById('viz-music-icon').classList.add('playing');
        document.getElementById('viz-track-name').textContent = 'INSANO MELODY - SYNTH LOOP';

        // Sequencer looping clock
        let nextTime = audio.ctx.currentTime;
        
        function scheduleNextNote() {
            if (!audio.isPlaying) return;

            const note = synthTrack[synthStep];
            const freq = note[0];
            const duration = note[1] / 1000;

            // Trigger osc note
            const osc = audio.ctx.createOscillator();
            const noteGain = audio.ctx.createGain();
            
            // Melodic wave shape (sawtooth or triangle for retro synth voice)
            osc.type = synthStep % 4 === 0 ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(freq, nextTime);

            // Envelope
            noteGain.gain.setValueAtTime(1.0, nextTime);
            noteGain.gain.exponentialRampToValueAtTime(0.001, nextTime + duration);

            osc.connect(noteGain);
            noteGain.connect(audio.gain);

            osc.start(nextTime);
            osc.stop(nextTime + duration);

            // Bass drone on the root beat
            if (synthStep % 4 === 0) {
                const subOsc = audio.ctx.createOscillator();
                const subGain = audio.ctx.createGain();
                
                subOsc.type = 'sine';
                subOsc.frequency.setValueAtTime(freq / 2, nextTime); // one octave lower
                
                subGain.gain.setValueAtTime(0.6, nextTime);
                subGain.gain.exponentialRampToValueAtTime(0.001, nextTime + duration * 1.8);
                
                subOsc.connect(subGain);
                subGain.connect(audio.gain);
                
                subOsc.start(nextTime);
                subOsc.stop(nextTime + duration * 1.8);
            }

            nextTime += duration;
            synthStep = (synthStep + 1) % synthTrack.length;

            // Schedule ahead
            audio.seqTimer = setTimeout(scheduleNextNote, note[1]);
        }

        scheduleNextNote();
        drawVisualizer();
        showToast('BEATS GENERADOS', 'Melodía synthwave generada por Web Audio API iniciada.', 'info');
    }

    function stopSynthBeat() {
        if (!audio.isPlaying) return;
        
        audio.isPlaying = false;
        clearTimeout(audio.seqTimer);
        cancelAnimationFrame(audio.vizAnimId);

        // Visual updates
        document.getElementById('btn-audio-play').disabled = false;
        document.getElementById('btn-audio-stop').disabled = true;
        document.getElementById('viz-music-icon').classList.remove('playing');
        document.getElementById('viz-track-name').textContent = 'INSANO SYNTH - DETENIDO';

        // Clear visualizer canvas
        const canvas = document.getElementById('audio-visualizer');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        showToast('AUDIO DETENIDO', 'El reproductor se ha silenciado correctamente.', 'info');
    }

    function drawVisualizer() {
        if (!audio.isPlaying) return;

        audio.vizAnimId = requestAnimationFrame(drawVisualizer);

        const canvas = document.getElementById('audio-visualizer');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        audio.analyser.getByteFrequencyData(audio.frequencyData);

        ctx.clearRect(0, 0, width, height);

        // Get active Theme main color
        const rootStyles = getComputedStyle(document.body);
        const primaryColor = rootStyles.getPropertyValue('--primary-color').trim() || '#ff007f';
        const secondaryColor = rootStyles.getPropertyValue('--secondary-color').trim() || '#00f0ff';

        // Draw oscilloscopes wave/bars
        const barWidth = width / audio.frequencyData.length;
        
        for (let i = 0; i < audio.frequencyData.length; i++) {
            const val = audio.frequencyData[i];
            const pct = val / 255;
            const barHeight = height * pct * 0.95;

            // Gradient fill
            const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
            grad.addColorStop(0, secondaryColor);
            grad.addColorStop(1, primaryColor);

            ctx.fillStyle = grad;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(i * barWidth, height - barHeight, barWidth - 1.5, barHeight, [2, 2, 0, 0]);
            } else {
                ctx.rect(i * barWidth, height - barHeight, barWidth - 1.5, barHeight);
            }
            ctx.fill();
        }
    }

    function changeVolume(e) {
        initAudioContext();
        const vol = parseFloat(e.target.value) / 100;
        // Cap at 0.15 volume level to safeguard ears
        audio.gain.gain.value = vol * 0.15;
    }

    // Route Navigation logic
    function navigate(targetId) {
        const sections = document.querySelectorAll('.page-section');
        const navItems = document.querySelectorAll('.nav-item');
        
        let targetSection = document.getElementById('page-' + targetId);
        if (!targetSection) return;

        sfx.click();

        // Toggle active page section
        sections.forEach(sec => sec.classList.remove('active'));
        targetSection.classList.add('active');

        // Toggle active menu link
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update titles
        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');
        if (titleEl && pageDetails[targetId]) {
            titleEl.textContent = pageDetails[targetId].title;
            subtitleEl.textContent = pageDetails[targetId].subtitle;
        }

        // Trigger chart redraw when visiting satisfaction
        if (targetId === 'satisfaccion') {
            setTimeout(() => {
                survey.refreshChart();
            }, 50);
        }

        // Sync table views in terminal page
        if (targetId === 'consola-db') {
            terminal.loadTable('estudiantes');
        }
    }

    // Theme switching logic
    function initThemeSwitcher() {
        const buttons = document.querySelectorAll('.theme-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');

                // Exclusive check for Gold Amber theme
                if (theme === 'amber' && localStorage.getItem('isVIPActive') !== 'true') {
                    showToast('TEMA BLOQUEADO', 'El tema dorado Sunset Amber es exclusivo para usuarios con pase VIP INSANO.', 'error');
                    return;
                }

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Clear existing themes and apply selected
                document.body.className = '';
                document.body.classList.add('theme-' + theme);

                // Sync canvas particle color channels
                particlesEngine.updateColors(theme);

                // Redraw chart to match new theme gradient colors
                survey.refreshChart();

                showToast('TEMA ACTUALIZADO', `Esquema de color cambiado a ${theme.toUpperCase()}.`, 'success');
            });
        });
    }

    // Clock module
    function startClock() {
        const clockEl = document.getElementById('system-time');
        if (!clockEl) return;

        setInterval(() => {
            const now = new Date();
            let hrs = now.getHours();
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            const ampm = hrs >= 12 ? 'PM' : 'AM';
            hrs = hrs % 12;
            hrs = hrs ? hrs : 12; // 0 hour should be 12
            const hrsStr = String(hrs).padStart(2, '0');
            clockEl.textContent = `${hrsStr}:${mins}:${secs} ${ampm}`;
        }, 1000);
    }

    // Modal Notification logic
    function showModal(title, contentHTML) {
        const overlay = document.getElementById('info-modal');
        const titleEl = document.getElementById('modal-title');
        const bodyEl = document.getElementById('modal-body-content');

        if (overlay && titleEl && bodyEl) {
            titleEl.textContent = title;
            bodyEl.innerHTML = contentHTML;
            overlay.classList.remove('hidden');
        }
    }

    function closeModal() {
        const overlay = document.getElementById('info-modal');
        if (overlay) overlay.classList.add('hidden');
    }

    function checkVIP() {
        const badge = document.getElementById('vip-status-badge');
        if (badge) {
            if (localStorage.getItem('isVIPActive') === 'true') {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function initSecurityHardening() {
        // Block right click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showToast('SISTEMA PROTEGIDO', 'El menu contextual esta deshabilitado por seguridad (Anti-Hacker Shield).', 'warning');
        });

        // Block keyboard inspect shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12') {
                e.preventDefault();
                showToast('ACCESO DENEGADO', 'Las herramientas de desarrollador estan bloqueadas.', 'error');
            }
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
                e.preventDefault();
                showToast('ACCESO DENEGADO', 'Inspeccion de codigo bloqueada.', 'error');
            }
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                showToast('ACCESO DENEGADO', 'El codigo fuente esta encriptado y protegido.', 'error');
            }
        });

        // DevTools opening detection using debugger / console clearing loop
        setInterval(() => {
            const start = new Date();
            // debugger; // Disabling debugger statement for automated tests compatibility, using time difference checks
            const end = new Date();
            if (end - start > 100) {
                console.clear();
                console.log('%c¡SISTEMA ANTI-HACKER ACTIVO!', 'color: #00ff88; font-size: 24px; font-weight: bold;');
            }
        }, 1000);
    }

    // Tab buttons within single pages
    function initSubTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                const container = tab.closest('.page-section');
                
                container.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById('tab-' + targetTab).classList.add('active');
            });
        });

        const subtabs = document.querySelectorAll('.sub-tab-btn');
        subtabs.forEach(sub => {
            sub.addEventListener('click', () => {
                const targetSub = sub.dataset.subtab;
                const container = sub.closest('.page-section');

                container.querySelectorAll('.sub-tab-btn').forEach(s => s.classList.remove('active'));
                container.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));

                sub.classList.add('active');
                document.getElementById('subtab-' + targetSub).classList.add('active');
                
                matriculas.refreshAllTables();
            });
        });
    }

    // Cart overlay toggle binds
    function initCartEvents() {
        const toggleBtn = document.getElementById('cart-toggle-btn');
        const closeBtn = document.getElementById('cart-close-btn');
        const overlay = document.getElementById('cart-panel');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => store.toggleCart());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => store.toggleCart(false));
        }
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    store.toggleCart(false);
                }
            });
        }
    }

    // Setup global listeners
    document.addEventListener('DOMContentLoaded', () => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('data-target');
                navigate(target);
            });
        });

        // Add sound effects on all click events for buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, .tab-btn, .sub-tab-btn, .theme-btn');
            if (btn && btn.id !== 'sfx-toggle-btn') {
                sfx.click();
            }
        });

        // SFX toggle button handler
        const sfxBtn = document.getElementById('sfx-toggle-btn');
        if (sfxBtn) {
            sfxBtn.addEventListener('click', () => {
                const active = sfx.toggle(!sfx.isEnabled());
                const icon = document.getElementById('sfx-icon');
                if (active) {
                    sfxBtn.classList.add('active');
                    if (icon) icon.setAttribute('data-lucide', 'volume-2');
                    sfx.success();
                    showToast('SONIDO ACTIVADO', 'Efectos de sonido retro-neon habilitados.', 'success');
                } else {
                    sfxBtn.classList.remove('active');
                    if (icon) icon.setAttribute('data-lucide', 'volume-x');
                    showToast('SONIDO SILENCIADO', 'Efectos de sonido desactivados.', 'info');
                }
                lucide.createIcons();
            });
        }

        initThemeSwitcher();
        startClock();
        initSubTabs();
        initCartEvents();

        // Audio controls hooks
        const playBtn = document.getElementById('btn-audio-play');
        const stopBtn = document.getElementById('btn-audio-stop');
        const volSlider = document.getElementById('audio-volume');

        if (playBtn) playBtn.addEventListener('click', startSynthBeat);
        if (stopBtn) stopBtn.addEventListener('click', stopSynthBeat);
        if (volSlider) volSlider.addEventListener('input', changeVolume);

        // Modal triggers
        const modalOk = document.getElementById('modal-ok-btn');
        const modalClose = document.getElementById('modal-close-btn');
        
        if (modalOk) modalOk.addEventListener('click', closeModal);
        if (modalClose) modalClose.addEventListener('click', closeModal);

        // Core initializers
        lucide.createIcons();
        particlesEngine.start();
        store.init();
        checkVIP();
        initSecurityHardening();
        
        // Landing introduction toast instead of blocking modal! (much cleaner)
        setTimeout(() => {
            showToast('SISTEMA INICIADO', 'Bienvenido al INSANO TECH HUB. Navega por las secciones y activa la música en el panel izquierdo.', 'success');
        }, 1200);
    });

    return {
        navigate,
        showModal,
        closeModal,
        showToast,
        checkVIP,
        escapeHTML
    };
})();
