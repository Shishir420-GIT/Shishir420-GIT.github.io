// Fluid Background Effect Manager
export class FluidBackground {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.programs = {};
        this.framebuffers = {};
        this.config = {
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 800,
            DENSITY_DISSIPATION: 0.98,
            VELOCITY_DISSIPATION: 0.99,
            PRESSURE: 0.8,
            PRESSURE_ITERATIONS: 20,
            CURL: 30,
            SPLAT_RADIUS: 0.25,
            SPLAT_FORCE: 6000,
            COLOR_UPDATE_SPEED: 10,
            TRANSPARENT: true
        };
        this.pointers = [];
        this.lastUpdateTime = Date.now();
        this.colorUpdateTimer = 0.0;
        this.isInitialized = false;
        this.animationId = null;
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            this.createCanvas();
            this.initWebGL();
            this.initShaders();
            this.initFramebuffers();
            this.setupEventListeners();
            this.initPointer();
            this.startAnimation();
            this.isInitialized = true;
            console.log('Fluid background initialized successfully');
        } catch (error) {
            console.warn('Fluid background initialization failed:', error);
            this.fallbackToStaticBackground();
        }
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'fluid-canvas';
        this.canvas.className = 'fluid-canvas';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.resizeCanvas();
    }

    initWebGL() {
        const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        if (!gl) {
            throw new Error('WebGL not supported');
        }
        
        this.gl = gl;
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        
        // Get extensions
        this.ext = {
            halfFloatTexType: gl.HALF_FLOAT || gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES,
            supportLinearFiltering: gl.getExtension('OES_texture_float_linear') || gl.getExtension('OES_texture_half_float_linear')
        };
    }

    initShaders() {
        const gl = this.gl;
        
        // Vertex shader
        const vertexShaderSource = `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform vec2 texelSize;
            
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        // Fragment shaders
        const displayShaderSource = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            
            void main () {
                vec3 c = texture2D(uTexture, vUv).rgb;
                float a = max(c.r, max(c.g, c.b));
                gl_FragColor = vec4(c, a * 0.8);
            }
        `;

        const splatShaderSource = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTarget;
            uniform float aspectRatio;
            uniform vec3 color;
            uniform vec2 point;
            uniform float radius;
            
            void main () {
                vec2 p = vUv - point.xy;
                p.x *= aspectRatio;
                vec3 splat = exp(-dot(p, p) / radius) * color;
                vec3 base = texture2D(uTarget, vUv).xyz;
                gl_FragColor = vec4(base + splat, 1.0);
            }
        `;

        const advectionShaderSource = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform float dt;
            uniform float dissipation;
            
            void main () {
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
                float decay = 1.0 + dissipation * dt;
                gl_FragColor = result / decay;
            }
        `;

        // Compile shaders and create programs
        this.vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        this.programs.display = this.createProgram(this.vertexShader, this.compileShader(gl.FRAGMENT_SHADER, displayShaderSource));
        this.programs.splat = this.createProgram(this.vertexShader, this.compileShader(gl.FRAGMENT_SHADER, splatShaderSource));
        this.programs.advection = this.createProgram(this.vertexShader, this.compileShader(gl.FRAGMENT_SHADER, advectionShaderSource));

        // Setup geometry
        this.setupGeometry();
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error('Shader compilation error: ' + gl.getShaderInfoLog(shader));
        }
        
        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Program linking error: ' + gl.getProgramInfoLog(program));
        }
        
        // Get uniform locations
        const uniforms = {};
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        
        return { program, uniforms };
    }

    setupGeometry() {
        const gl = this.gl;
        
        // Create quad geometry
        const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
        const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    initFramebuffers() {
        const gl = this.gl;
        const width = Math.floor(this.canvas.width / 4);
        const height = Math.floor(this.canvas.height / 4);
        
        // Create textures and framebuffers for double buffering
        this.framebuffers.dye = this.createDoubleFBO(width, height);
        this.framebuffers.velocity = this.createDoubleFBO(width, height);
    }

    createDoubleFBO(width, height) {
        const fbo1 = this.createFBO(width, height);
        const fbo2 = this.createFBO(width, height);
        
        return {
            read: fbo1,
            write: fbo2,
            swap() {
                const temp = this.read;
                this.read = this.write;
                this.write = temp;
            }
        };
    }

    createFBO(width, height) {
        const gl = this.gl;
        
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        
        return { texture, fbo, width, height };
    }

    initPointer() {
        this.pointers.push({
            id: -1,
            x: 0.5,
            y: 0.5,
            prevX: 0.5,
            prevY: 0.5,
            deltaX: 0,
            deltaY: 0,
            down: false,
            moved: false,
            color: this.generateColor()
        });
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;
            this.updatePointer(x, y);
        });

        // Touch events
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = (touch.clientX - rect.left) / rect.width;
            const y = 1.0 - (touch.clientY - rect.top) / rect.height;
            this.updatePointer(x, y);
        }, { passive: false });

        // Resize handler
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initFramebuffers();
        });
    }

    updatePointer(x, y) {
        const pointer = this.pointers[0];
        pointer.prevX = pointer.x;
        pointer.prevY = pointer.y;
        pointer.x = x;
        pointer.y = y;
        pointer.deltaX = x - pointer.prevX;
        pointer.deltaY = y - pointer.prevY;
        pointer.moved = Math.abs(pointer.deltaX) > 0.001 || Math.abs(pointer.deltaY) > 0.001;
    }

    resizeCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * pixelRatio;
        this.canvas.height = window.innerHeight * pixelRatio;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
    }

    generateColor() {
        const hue = Math.random();
        const saturation = 0.8 + Math.random() * 0.2;
        const value = 0.6 + Math.random() * 0.4;
        return this.HSVtoRGB(hue, saturation, value);
    }

    HSVtoRGB(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return { r: r * 0.3, g: g * 0.3, b: b * 0.3 };
    }

    startAnimation() {
        const animate = () => {
            if (!this.isInitialized) return;
            
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    update() {
        const now = Date.now();
        const dt = Math.min((now - this.lastUpdateTime) / 1000, 0.016);
        this.lastUpdateTime = now;

        // Update colors periodically
        this.colorUpdateTimer += dt * this.config.COLOR_UPDATE_SPEED;
        if (this.colorUpdateTimer >= 1) {
            this.colorUpdateTimer = 0;
            this.pointers[0].color = this.generateColor();
        }

        // Apply input
        const pointer = this.pointers[0];
        if (pointer.moved) {
            pointer.moved = false;
            this.splat(pointer.x, pointer.y, pointer.deltaX * this.config.SPLAT_FORCE, pointer.deltaY * this.config.SPLAT_FORCE, pointer.color);
        }

        // Advection step (simplified)
        this.advect(this.framebuffers.velocity, this.framebuffers.velocity, dt, this.config.VELOCITY_DISSIPATION);
        this.advect(this.framebuffers.velocity, this.framebuffers.dye, dt, this.config.DENSITY_DISSIPATION);
    }

    splat(x, y, dx, dy, color) {
        const gl = this.gl;
        const program = this.programs.splat;
        
        gl.useProgram(program.program);
        
        // Splat velocity
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.velocity.write.fbo);
        gl.viewport(0, 0, this.framebuffers.velocity.write.width, this.framebuffers.velocity.write.height);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.framebuffers.velocity.read.texture);
        gl.uniform1i(program.uniforms.uTarget, 0);
        gl.uniform1f(program.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
        gl.uniform2f(program.uniforms.point, x, y);
        gl.uniform3f(program.uniforms.color, dx, dy, 0.0);
        gl.uniform1f(program.uniforms.radius, this.config.SPLAT_RADIUS);
        
        this.blit();
        this.framebuffers.velocity.swap();
        
        // Splat dye
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.dye.write.fbo);
        gl.viewport(0, 0, this.framebuffers.dye.write.width, this.framebuffers.dye.write.height);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.framebuffers.dye.read.texture);
        gl.uniform1i(program.uniforms.uTarget, 0);
        gl.uniform3f(program.uniforms.color, color.r, color.g, color.b);
        
        this.blit();
        this.framebuffers.dye.swap();
    }

    advect(velocityFBO, sourceFBO, dt, dissipation) {
        const gl = this.gl;
        const program = this.programs.advection;
        
        gl.useProgram(program.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, sourceFBO.write.fbo);
        gl.viewport(0, 0, sourceFBO.write.width, sourceFBO.write.height);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocityFBO.read.texture);
        gl.uniform1i(program.uniforms.uVelocity, 0);
        
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, sourceFBO.read.texture);
        gl.uniform1i(program.uniforms.uSource, 1);
        
        gl.uniform2f(program.uniforms.texelSize, 1.0 / sourceFBO.read.width, 1.0 / sourceFBO.read.height);
        gl.uniform1f(program.uniforms.dt, dt);
        gl.uniform1f(program.uniforms.dissipation, dissipation);
        
        this.blit();
        sourceFBO.swap();
    }

    render() {
        const gl = this.gl;
        const program = this.programs.display;
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.framebuffers.dye.read.texture);
        gl.uniform1i(program.uniforms.uTexture, 0);
        
        this.blit();
    }

    blit() {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    fallbackToStaticBackground() {
        // Create a simple animated gradient background as fallback
        const canvas = document.createElement('canvas');
        canvas.className = 'fluid-canvas';
        canvas.style.background = `
            linear-gradient(45deg, 
                rgba(59, 130, 246, 0.1) 0%, 
                rgba(16, 185, 129, 0.1) 50%, 
                rgba(139, 92, 246, 0.1) 100%)
        `;
        canvas.style.animation = 'gradientShift 10s ease-in-out infinite';
        
        // Add keyframes for gradient animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0%, 100% { filter: hue-rotate(0deg); }
                50% { filter: hue-rotate(180deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.isInitialized = false;
    }
}