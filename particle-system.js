/**
 * Particle System for Classic Games Collection
 * Centralized particle effects management
 */

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 1000; // Performance limit
    }
    
    /**
     * Update all particles
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        // Update particles in reverse to safely remove during iteration
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Apply gravity if specified
            if (particle.gravity) {
                particle.vy += particle.gravity * deltaTime;
            }
            
            // Apply friction/damping
            if (particle.friction) {
                particle.vx *= Math.pow(particle.friction, deltaTime);
                particle.vy *= Math.pow(particle.friction, deltaTime);
            }
            
            // Update life
            particle.life -= particle.decay * deltaTime;
            
            // Update size
            if (particle.shrink) {
                particle.size *= Math.pow(particle.shrink, deltaTime);
            }
            
            // Remove dead particles
            if (particle.life <= 0 || particle.size < 0.1) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * Render all particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.save();
        
        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.life * particle.opacity;
            
            if (particle.glow) {
                // Add glow effect
                ctx.shadowBlur = particle.size * 2;
                ctx.shadowColor = particle.color;
            }
            
            if (particle.shape === 'circle') {
                // Draw circular particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            } else {
                // Draw square particle (default)
                ctx.fillStyle = particle.color;
                ctx.fillRect(
                    particle.x - particle.size / 2, 
                    particle.y - particle.size / 2, 
                    particle.size, 
                    particle.size
                );
            }
            
            ctx.shadowBlur = 0;
        });
        
        ctx.restore();
    }
    
    /**
     * Create a basic particle
     * @param {Object} options - Particle options
     */
    createParticle(options = {}) {
        if (this.particles.length >= this.maxParticles) {
            return; // Limit reached
        }
        
        const particle = {
            x: options.x || 0,
            y: options.y || 0,
            vx: options.vx || 0,
            vy: options.vy || 0,
            size: options.size || 2,
            color: options.color || '#ffffff',
            life: options.life || 1,
            decay: options.decay || 1, // Life decay rate (1 = 1 second)
            gravity: options.gravity || 0,
            friction: options.friction || 1, // 1 = no friction, 0.9 = 10% friction
            opacity: options.opacity || 1,
            shape: options.shape || 'square',
            shrink: options.shrink || 1, // Size decay rate
            glow: options.glow || false
        };
        
        this.particles.push(particle);
        return particle;
    }
    
    /**
     * Create an explosion effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Explosion options
     */
    createExplosion(x, y, options = {}) {
        const count = options.count || 20;
        const speed = options.speed || 100;
        const speedVariation = options.speedVariation || 0.5;
        const color = options.color || '#ff6b6b';
        const colors = options.colors || [color];
        const life = options.life || 1;
        const size = options.size || 3;
        const gravity = options.gravity || 0;
        const friction = options.friction || 0.9;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            const velocity = speed * (1 + (Math.random() - 0.5) * speedVariation);
            const particleColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.createParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: size * (0.5 + Math.random() * 0.5),
                color: particleColor,
                life: life * (0.5 + Math.random() * 0.5),
                decay: 1 / life,
                gravity: gravity,
                friction: friction,
                shrink: 0.95,
                glow: options.glow || false
            });
        }
    }
    
    /**
     * Create a sparkle/collection effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Sparkle options
     */
    createSparkle(x, y, options = {}) {
        const count = options.count || 10;
        const color = options.color || '#fbbf24';
        const life = options.life || 0.5;
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 50;
            
            this.createParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50, // Upward bias
                size: 1 + Math.random() * 2,
                color: color,
                life: life,
                decay: 1 / life,
                gravity: -100, // Float upward
                shape: 'circle',
                shrink: 0.9,
                glow: true
            });
        }
    }
    
    /**
     * Create a trail effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Trail options
     */
    createTrail(x, y, options = {}) {
        const color = options.color || '#4ade80';
        const size = options.size || 3;
        const life = options.life || 0.3;
        const vx = options.vx || 0;
        const vy = options.vy || 0;
        
        this.createParticle({
            x: x,
            y: y,
            vx: vx * 0.1 + (Math.random() - 0.5) * 10,
            vy: vy * 0.1 + (Math.random() - 0.5) * 10,
            size: size,
            color: color,
            life: life,
            decay: 1 / life,
            opacity: 0.5,
            shape: 'circle',
            shrink: 0.95
        });
    }
    
    /**
     * Create a directional burst
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} angle - Direction in radians
     * @param {Object} options - Burst options
     */
    createBurst(x, y, angle, options = {}) {
        const count = options.count || 15;
        const spread = options.spread || Math.PI / 4; // 45 degree spread
        const speed = options.speed || 150;
        const color = options.color || '#60a5fa';
        const life = options.life || 0.8;
        
        for (let i = 0; i < count; i++) {
            const particleAngle = angle + (Math.random() - 0.5) * spread;
            const velocity = speed * (0.5 + Math.random() * 0.5);
            
            this.createParticle({
                x: x,
                y: y,
                vx: Math.cos(particleAngle) * velocity,
                vy: Math.sin(particleAngle) * velocity,
                size: 2 + Math.random() * 2,
                color: color,
                life: life,
                decay: 1 / life,
                friction: 0.95,
                shape: options.shape || 'square'
            });
        }
    }
    
    /**
     * Create smoke effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Smoke options
     */
    createSmoke(x, y, options = {}) {
        const color = options.color || '#666666';
        const size = options.size || 8;
        const life = options.life || 1.5;
        
        this.createParticle({
            x: x + (Math.random() - 0.5) * 10,
            y: y,
            vx: (Math.random() - 0.5) * 20,
            vy: -20 - Math.random() * 20,
            size: size,
            color: color,
            life: life,
            decay: 1 / life,
            opacity: 0.3,
            shape: 'circle',
            shrink: 1.02 // Smoke expands
        });
    }
    
    /**
     * Create impact shockwave
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Shockwave options
     */
    createShockwave(x, y, options = {}) {
        const rings = options.rings || 3;
        const color = options.color || '#ffffff';
        const maxSize = options.maxSize || 100;
        
        for (let i = 0; i < rings; i++) {
            setTimeout(() => {
                const particle = this.createParticle({
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,
                    size: 1,
                    color: color,
                    life: 0.5,
                    decay: 2,
                    opacity: 0.3,
                    shape: 'circle',
                    shrink: 1 // No shrink
                });
                
                // Custom update for expanding ring
                if (particle) {
                    const originalUpdate = particle.update;
                    particle.expandRate = maxSize * 2; // pixels per second
                    particle.update = function(deltaTime) {
                        this.size += this.expandRate * deltaTime;
                        this.opacity = this.life * 0.3 * (1 - this.size / maxSize);
                    };
                }
            }, i * 100);
        }
    }
    
    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
    
    /**
     * Get particle count
     */
    getCount() {
        return this.particles.length;
    }
    
    /**
     * Set maximum particle limit
     */
    setMaxParticles(max) {
        this.maxParticles = max;
    }
}

// Create global instance
window.particleSystem = new ParticleSystem();

// For games that need multiple particle systems
window.ParticleSystem = ParticleSystem;