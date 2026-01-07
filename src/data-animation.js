class DataFlowAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.nodes = [];
        this.lineColor = 'rgba(66, 133, 244, 0.1)';
        this.particleColor = '#4285F4';
        this.nodeColor = '#4285F4';
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.init(); // Re-init nodes on resize
    }

    init() {
        this.nodes = [];
        this.particles = [];
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 50000);

        // Create static nodes
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                pulse: 0
            });
        }
    }

    createParticle() {
        if (this.nodes.length < 2) return;
        const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        const endNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];

        if (startNode === endNode) return;

        this.particles.push({
            x: startNode.x,
            y: startNode.y,
            targetX: endNode.x,
            targetY: endNode.y,
            progress: 0,
            speed: 0.005 + Math.random() * 0.01,
            size: Math.random() * 2 + 1
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dist = Math.hypot(this.nodes[i].x - this.nodes[j].x, this.nodes[i].y - this.nodes[j].y);
                if (dist < 200) {
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                }
            }
        }
        this.ctx.stroke();

        // Draw nodes
        this.nodes.forEach(node => {
            node.pulse += 0.05;
            const pulseRadius = Math.max(0.1, node.radius + Math.sin(node.pulse) * 2);
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.nodeColor + '33'; // 20% opacity
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.nodeColor;
            this.ctx.fill();
        });

        // Draw particles (Data flow)
        this.particles.forEach((p, index) => {
            p.progress += p.speed;
            const curX = p.x + (p.targetX - p.x) * p.progress;
            const curY = p.y + (p.targetY - p.y) * p.progress;

            this.ctx.beginPath();
            this.ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.particleColor;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.particleColor;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            if (p.progress >= 1) {
                this.particles.splice(index, 1);
            }
        });

        if (this.particles.length < 50 && Math.random() > 0.5) {
            this.createParticle();
        }
    }

    updateColors(isDark) {
        if (isDark) {
            this.lineColor = 'rgba(66, 133, 244, 0.1)';
            this.particleColor = '#4285F4';
            this.nodeColor = '#4285F4';
        } else {
            this.lineColor = 'rgba(26, 115, 232, 0.05)';
            this.particleColor = '#1A73E8';
            this.nodeColor = '#1A73E8';
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dataAnimation = new DataFlowAnimation('hero-canvas');
    const isDark = document.documentElement.classList.contains('dark');
    window.dataAnimation.updateColors(isDark);
});
