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
        
        // Handle resize with throttling for performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
            }, 100);
        });
        
        console.log('Matrix rain effect initialized');
    }

    resizeCanvas() {
        // Ensure canvas covers the full viewport
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Set CSS size to match canvas size for proper scaling
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        // Recalculate columns for new width
        this.initColumns();
        
        console.log(`Canvas resized to: ${this.canvas.width} x ${this.canvas.height}`);
    }

    initColumns() {
        // Optimize for mobile performance - reduce columns on smaller screens
        const isMobile = window.innerWidth <= 768;
        const adjustedFontSize = isMobile ? this.fontSize + 2 : this.fontSize;
        const numColumns = Math.floor(this.canvas.width / adjustedFontSize);
        
        // Only limit columns on mobile for performance - desktop gets full coverage
        const maxColumns = isMobile ? 40 : numColumns;
        const finalColumns = Math.min(numColumns, maxColumns);
        
        // Initialize columns with random starting positions for better distribution
        this.columns = Array(finalColumns).fill(0).map(() => Math.floor(Math.random() * 20) - 20);
        this.currentFontSize = adjustedFontSize;
        
        console.log(`Matrix: ${finalColumns} columns covering ${this.canvas.width}px width (font: ${adjustedFontSize}px)`);
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