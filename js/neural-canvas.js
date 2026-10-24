/**
 * Neural Network & Particle Constellation Interactive Background
 * RACM - IA & Data Science Portfolio
 * 
 * Generates an interactive graph of synaptic nodes connecting in 2D space,
 * reacting to mouse movements and simulating neural activations.
 * Highly optimized, zero external dependencies, 60 FPS requestAnimationFrame.
 */

(function () {
    'use strict';

    const canvas = document.createElement('canvas');
    canvas.id = 'neural-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;

    // Configuración de la Red Neuronal
    const CONFIG = {
        particleCountBase: 65,         // Base para pantallas de 1920px
        maxDistance: 135,             // Distancia máxima para sinapsis entre neuronas
        mouseDistance: 160,           // Distancia de interacción con el cursor
        nodeColor: 'rgba(56, 189, 248, 0.7)',       // Cyan Neón
        synapseColor: '56, 189, 248',               // RGB base para enlaces
        pulseColor: '168, 85, 247',                 // Violeta para pulsos
        speed: 0.45                                 // Velocidad de deriva
    };

    const mouse = {
        x: null,
        y: null,
        active: false
    };

    class Neuron {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;
            this.radius = Math.random() * 2 + 1.2;
            this.baseRadius = this.radius;
            this.pulse = Math.random() * Math.PI * 2;
            this.isSynapseActive = false;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Rebote suave en los bordes
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Pulso sinusoidal suave
            this.pulse += 0.03;
            this.radius = this.baseRadius + Math.sin(this.pulse) * 0.5;

            // Interacción gravitacional / activación con el cursor
            if (mouse.active && mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.mouseDistance) {
                    const force = (1 - dist / CONFIG.mouseDistance) * 0.08;
                    this.x += dx * force;
                    this.y += dy * force;
                    this.isSynapseActive = true;
                } else {
                    this.isSynapseActive = false;
                }
            } else {
                this.isSynapseActive = false;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            if (this.isSynapseActive) {
                ctx.fillStyle = '#a855f7';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#a855f7';
            } else {
                ctx.fillStyle = CONFIG.nodeColor;
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        // Ajustar número de neuronas según el tamaño de la pantalla
        const area = width * height;
        const targetCount = Math.max(25, Math.floor((area / (1920 * 1080)) * CONFIG.particleCountBase));

        particles = [];
        for (let i = 0; i < targetCount; i++) {
            particles.push(new Neuron());
        }
    }

    function drawConnections() {
        const len = particles.length;

        for (let i = 0; i < len; i++) {
            const p1 = particles[i];

            // Conexión con el cursor del usuario
            if (mouse.active && mouse.x !== null) {
                const dmx = mouse.x - p1.x;
                const dmy = mouse.y - p1.y;
                const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);

                if (distMouse < CONFIG.mouseDistance) {
                    const alpha = (1 - distMouse / CONFIG.mouseDistance) * 0.65;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${CONFIG.pulseColor}, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }

            // Conexión entre neuronas adyacentes
            for (let j = i + 1; j < len; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.maxDistance) {
                    const alpha = (1 - dist / CONFIG.maxDistance) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${CONFIG.synapseColor}, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        drawConnections();

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Eventos del Mouse y Touch
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.active = true;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 100);
    });

    // Pausar animación si la pestaña está oculta para ahorrar CPU/batería
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            animate();
        }
    });

    // Inicializar
    resize();
    animate();
})();
