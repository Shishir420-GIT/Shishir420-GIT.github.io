// Matrix Rain Effect
export class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.columns = [];
        this.fontSize = 14;
        this.matrix = "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह01";
        this.animationId = null;
    }

    init() {
        const container = document.getElementById('matrix-rain');
        if (!container) return;

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);

        // Set canvas size
        this.resizeCanvas();
        
        // Initialize columns
        this.initColumns();
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('Matrix rain effect initialized');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recalculate columns
        this.initColumns();
    }

    initColumns() {
        // Optimize for mobile performance - reduce columns on smaller screens
        const isMobile = window.innerWidth <= 768;
        const adjustedFontSize = isMobile ? this.fontSize + 2 : this.fontSize; // Slightly larger on mobile
        const numColumns = Math.floor(this.canvas.width / adjustedFontSize);
        
        // Limit maximum columns for performance on mobile
        const maxColumns = isMobile ? 40 : 100;
        const finalColumns = Math.min(numColumns, maxColumns);
        
        this.columns = Array(finalColumns).fill(1);
        this.currentFontSize = adjustedFontSize;
    }

    animate = () => {
        // Get current theme
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        
        // Set transparent background to create fade effect (adjust for theme)
        this.ctx.fillStyle = isLightTheme ? 'rgba(248, 250, 252, 0.08)' : 'rgba(0, 0, 0, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set text properties (adjust color for theme)
        this.ctx.fillStyle = isLightTheme ? '#006600' : '#00ff41';
        this.ctx.font = `${this.currentFontSize || this.fontSize}px JetBrains Mono, monospace`;
        
        // Add glow effect for better visibility
        if (isLightTheme) {
            this.ctx.shadowColor = '#006600';
            this.ctx.shadowBlur = 8;
        } else {
            this.ctx.shadowColor = '#00ff41';
            this.ctx.shadowBlur = 5;
        }

        const currentFontSize = this.currentFontSize || this.fontSize;
        
        for (let i = 0; i < this.columns.length; i++) {
            // Pick random character
            const text = this.matrix[Math.floor(Math.random() * this.matrix.length)];
            
            // Draw character
            this.ctx.fillText(text, i * currentFontSize, this.columns[i] * currentFontSize);

            // Reset column if it reaches bottom or random reset
            if (this.columns[i] * currentFontSize > this.canvas.height && Math.random() > 0.975) {
                this.columns[i] = 0;
            }
            
            // Move column down
            this.columns[i]++;
        }

        // Reset shadow for next frame
        this.ctx.shadowBlur = 0;

        this.animationId = requestAnimationFrame(this.animate);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}