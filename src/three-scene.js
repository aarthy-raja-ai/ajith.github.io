class DataNexus3D {
    constructor() {
        this.container = document.body;
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.particles = null;
        this.lines = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;

        this.colors = {
            dark: {
                particle: 0x4285F4,
                line: 0x4285F4,
                opacity: 0.3
            },
            light: {
                particle: 0x1A73E8,
                line: 0x1A73E8,
                opacity: 0.1
            }
        };

        this.init();
        this.addEventListeners();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.camera.position.z = 5;

        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
        }

        for (let i = 0; i < particleCount; i++) {
            sizes[i] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: this.isDarkMode() ? this.colors.dark.particle : this.colors.light.particle,
            transparent: true,
            opacity: this.isDarkMode() ? 0.8 : 0.4,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Add connections (Lines)
        const lineCount = 100;
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(lineCount * 6); // 2 points per line

        for (let i = 0; i < lineCount * 6; i++) {
            linePositions[i] = (Math.random() - 0.5) * 15;
        }

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            color: this.isDarkMode() ? this.colors.dark.line : this.colors.light.line,
            transparent: true,
            opacity: this.isDarkMode() ? 0.2 : 0.05
        });

        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
    }

    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    updateColors() {
        if (!this.particles || !this.lines) return;
        const isDark = this.isDarkMode();

        this.particles.material.color.setHex(isDark ? this.colors.dark.particle : this.colors.light.particle);
        this.particles.material.opacity = isDark ? 0.8 : 0.4;

        this.lines.material.color.setHex(isDark ? this.colors.dark.line : this.colors.light.line);
        this.lines.material.opacity = isDark ? 0.2 : 0.05;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) - 0.5;
            this.mouseY = (event.clientY / window.innerHeight) - 0.5;
        });

        // Listen for theme toggle via a custom event or observer
        const observer = new MutationObserver(() => this.updateColors());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.0001;

        if (this.particles) {
            this.particles.rotation.y = time * 0.5;

            // Mouse react
            this.targetRotationX += (this.mouseY * 0.5 - this.targetRotationX) * 0.05;
            this.targetRotationY += (this.mouseX * 0.5 - this.targetRotationY) * 0.05;

            this.particles.rotation.x = this.targetRotationX;
            this.particles.rotation.y += this.targetRotationY;
        }

        if (this.lines) {
            this.lines.rotation.y = time * 0.3;
            this.lines.rotation.x = this.targetRotationX;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dataNexus = new DataNexus3D();
});
