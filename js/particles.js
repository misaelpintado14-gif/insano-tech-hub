/* ==========================================================================
   INSANO TECH HUB - BACKGROUND PARTICLES ENGINE (CANVAS)
   Features: Hover interactive force-field, dynamic speed/gravity slider sync
   ========================================================================== */

const particlesEngine = (() => {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Default configuration (modified dynamically via UI sliders and theme selection)
    let settings = {
        speedFactor: 0.6,
        gravityFactor: 0, // positive attracts, negative repels
        density: 80,      // Total particles
        colors: ['#00ff41', '#00ff41', '#008f11'], // Default Matrix Green
        maxDistance: 110  // Distance to draw linking lines
    };

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.size = Math.random() * 3 + 1;
            if (initial) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            } else {
                // If it goes out of screen, spawn at edges
                if (Math.random() > 0.5) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() > 0.5 ? 0 - 10 : canvas.height + 10;
                } else {
                    this.x = Math.random() > 0.5 ? 0 - 10 : canvas.width + 10;
                    this.y = Math.random() * canvas.height;
                }
            }
            this.baseDx = (Math.random() - 0.5) * 1.5;
            this.baseDy = (Math.random() - 0.5) * 1.5;
            this.dx = this.baseDx;
            this.dy = this.baseDy;
            this.color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
        }

        update() {
            // Speed adjustments
            this.dx = this.baseDx * settings.speedFactor;
            this.dy = this.baseDy * settings.speedFactor;

            // Interactive mouse force field
            if (mouse.x !== null && mouse.y !== null) {
                const distanceX = mouse.x - this.x;
                const distanceY = mouse.y - this.y;
                const distance = Math.hypot(distanceX, distanceY);

                if (distance < mouse.radius) {
                    // Interaction: attraction/repulsion based on gravity factor
                    const force = (mouse.radius - distance) / mouse.radius; // 0 to 1
                    
                    if (settings.gravityFactor !== 0) {
                        // Gravitational attraction/repulsion
                        const angle = Math.atan2(distanceY, distanceX);
                        // settings.gravityFactor > 0 pulls, < 0 pushes
                        const strength = settings.gravityFactor * force * 1.5;
                        this.x += Math.cos(angle) * strength;
                        this.y += Math.sin(angle) * strength;
                    } else {
                        // Default ambient bounce/repel (so it feels interactive even at 0 gravity)
                        const angle = Math.atan2(distanceY, distanceX);
                        this.x -= Math.cos(angle) * force * 0.8;
                        this.y -= Math.sin(angle) * force * 0.8;
                    }
                }
            }

            // Normal movement
            this.x += this.dx;
            this.y += this.dy;

            // Boundaries check
            if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size > 2 ? 8 : 0;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }
    }

    function init() {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < settings.density; i++) {
            particles.push(new Particle());
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                if (dist < settings.maxDistance) {
                    const alpha = 1 - (dist / settings.maxDistance);
                    ctx.strokeStyle = `rgba(${hexToRgb(particles[a].color)}, ${alpha * 0.18})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connect();
        requestAnimationFrame(animate);
    }

    // Helper utility to convert hex colors to RGB channels
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
            : '255, 255, 255';
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Sync controls from sliders safely
    document.addEventListener('DOMContentLoaded', () => {
        const speedSlider = document.getElementById('particle-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                settings.speedFactor = parseFloat(e.target.value) / 5;
            });
        }

        const gravitySlider = document.getElementById('particle-gravity');
        if (gravitySlider) {
            gravitySlider.addEventListener('input', (e) => {
                settings.gravityFactor = parseFloat(e.target.value);
            });
        }
    });

    // Public controller interface
    return {
        start: () => {
            init();
            animate();
        },
        updateColors: (themeName) => {
            if (themeName === 'cyberpunk') {
                settings.colors = ['#ff007f', '#00f0ff'];
            } else if (themeName === 'matrix') {
                settings.colors = ['#00ff88', '#00e5ff', '#00a3ff'];
            } else if (themeName === 'neon') {
                settings.colors = ['#8b5cf6', '#3b82f6'];
            } else if (themeName === 'amber') {
                settings.colors = ['#f59e0b', '#10b981'];
            }
            // re-apply to active particles
            particles.forEach(p => {
                p.color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
            });
        }
    };
})();
