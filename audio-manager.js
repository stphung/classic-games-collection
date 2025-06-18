/**
 * Audio Manager for Classic Games Collection
 * Centralized audio handling with 8-bit sound effects and music
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isMuted = false;
        this.musicMuted = false;
        this.masterVolume = 0.6;  // Increased from 0.3 for better audibility
        this.musicVolume = 0.2;   // Increased from 0.1
        this.effectsVolume = 0.4; // Increased from 0.2
        this.backgroundMusic = null;
        this.musicInterval = null;
        this.initialized = false;
        
        // Sound queue system
        this.soundQueue = [];
        this.maxConcurrentSounds = 20;  // Increased from 10 to reduce dropped sounds
        this.activeSounds = 0;
        
        // Pitch variation control
        this.enablePitchVariation = true;  // Can be disabled for consistent sounds
        this.pitchVariationAmount = 0.02;  // Reduced from 0.05 (±2% instead of ±5%)
        
        // Effects volume control (separate from music)
        this.effectsMuted = false;
        
        // Check global mute state if available
        if (window.isGloballyMuted) {
            this.musicMuted = window.isGloballyMuted();
            this.isMuted = window.isGloballyMuted();
        }
        
        // Listen for global mute toggle
        window.addEventListener('globalMuteToggle', (event) => {
            this.musicMuted = event.detail.isMuted;
            this.isMuted = event.detail.isMuted;
            if (this.musicMuted) {
                this.stopMusic();
            }
        });
    }
    
    /**
     * Initialize the audio context
     * Call this on first user interaction
     */
    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.error('Failed to initialize audio:', e);
        }
    }
    
    /**
     * Normalize volume to ensure consistent levels across all sounds
     */
    normalizeVolume(volume, soundType) {
        // Apply normalization factors based on sound type characteristics
        // Adjusted to be closer to 1.0 for more consistent volume with originals
        const normalizationFactors = {
            'beep': 0.95,         // Increased from 0.8
            'click': 0.95,        // Increased from 0.9
            'success': 0.85,      // Increased from 0.7
            'fail': 0.9,          // Increased from 0.8
            'powerup': 0.9,       // Increased from 0.75
            'explosion': 1.0,     // Unchanged
            'jump': 0.95,         // Increased from 0.85
            'collect': 0.95,      // Increased from 0.8
            'thrust': 0.85,       // Increased from 0.6 (was way too quiet)
            'laser': 0.95,        // Increased from 0.9
            'wallBounce': 0.95,   // Increased from 0.85
            'flag': 0.9,          // Increased from 0.75
            'warning': 1.0,       // Increased from 0.95
            'countdown': 0.95,    // Increased from 0.8
            'paddleHit': 1.0      // Full volume for classic paddle sound
        };
        
        const factor = normalizationFactors[soundType] || 1.0;
        return Math.min(1.0, volume * factor * this.masterVolume);
    }
    
    /**
     * Get pitch variation for sound to prevent audio fatigue
     */
    getPitchVariation(soundType, baseFrequency) {
        // Only apply variation if enabled
        if (!this.enablePitchVariation) {
            return baseFrequency;
        }
        
        // Sounds that benefit from pitch variation
        const variableSounds = ['beep', 'click', 'collect', 'wallBounce', 'jump', 'paddleHit'];
        
        if (variableSounds.includes(soundType)) {
            // Random variation based on pitchVariationAmount (default ±2%)
            const range = this.pitchVariationAmount * 2;
            const variation = 1 - this.pitchVariationAmount + (Math.random() * range);
            return baseFrequency * variation;
        }
        
        return baseFrequency;
    }
    
    /**
     * Create subtle variations for repeated sounds to reduce audio fatigue
     * This method can be called directly for custom sound variations
     */
    createSoundVariation(baseSound, variationOptions = {}) {
        const {
            pitchRange = 0.1,      // ±10% pitch variation by default
            volumeRange = 0.05,    // ±5% volume variation by default
            durationRange = 0.02   // ±2% duration variation by default
        } = variationOptions;
        
        return {
            pitch: 1 + (Math.random() - 0.5) * pitchRange * 2,
            volume: 1 + (Math.random() - 0.5) * volumeRange * 2,
            duration: 1 + (Math.random() - 0.5) * durationRange * 2
        };
    }
    
    /**
     * Common 8-bit sound effects with enhancements
     */
    playSound(type, options = {}) {
        if (!this.initialized || this.isMuted || this.effectsMuted) return;
        
        // Queue system to prevent audio overload
        if (this.activeSounds >= this.maxConcurrentSounds) {
            this.soundQueue.push({ type, options, timestamp: Date.now() });
            // Remove old queued sounds
            this.soundQueue = this.soundQueue.filter(s => Date.now() - s.timestamp < 100);
            return;
        }
        
        const now = this.audioContext.currentTime;
        const baseVolume = options.volume || this.effectsVolume;
        const volume = this.normalizeVolume(baseVolume, type);
        
        // Apply pitch variation for supported sounds
        const frequency = options.frequency ? 
            this.getPitchVariation(type, options.frequency) : 
            options.frequency;
        
        this.activeSounds++;
        
        // Track when sound ends to update counter
        const duration = this.getSoundDuration(type, options);
        setTimeout(() => {
            this.activeSounds--;
            this.processQueue();
        }, duration * 1000);
        
        switch(type) {
            case 'beep':
                this.playBeep(frequency || this.getPitchVariation('beep', 800), options.duration || 0.1, volume);
                break;
            case 'click':
                this.playClick(volume, this.getPitchVariation('click', 1000));
                break;
            case 'success':
                this.playSuccess(volume);
                break;
            case 'fail':
                this.playFail(volume);
                break;
            case 'powerup':
                this.playPowerUp(volume);
                break;
            case 'explosion':
                this.playExplosion(volume);
                break;
            case 'jump':
                this.playJump(volume, this.getPitchVariation('jump', 200));
                break;
            case 'collect':
                this.playCollect(volume, this.getPitchVariation('collect', 800));
                break;
            case 'thrust':
                this.playThrust(volume);
                break;
            case 'laser':
                this.playLaser(volume);
                break;
            case 'wallBounce':
                this.playWallBounce(volume, this.getPitchVariation('wallBounce', 400));
                break;
            case 'flag':
                this.playFlag(volume);
                break;
            case 'warning':
                this.playWarning(volume);
                break;
            case 'countdown':
                this.playCountdown(volume);
                break;
            case 'paddleHit':
                this.playPaddleHit(volume, frequency || this.getPitchVariation('paddleHit', 600));
                break;
            default:
                console.warn('Unknown sound type:', type);
                this.activeSounds--; // Decrement if unknown
        }
    }
    
    /**
     * Process queued sounds when slots become available
     */
    processQueue() {
        if (this.soundQueue.length > 0 && this.activeSounds < this.maxConcurrentSounds) {
            const { type, options } = this.soundQueue.shift();
            this.playSound(type, options);
        }
    }
    
    /**
     * Get estimated duration for a sound type
     */
    getSoundDuration(type, options = {}) {
        const durations = {
            'beep': options.duration || 0.1,
            'click': 0.02,
            'success': 0.4,
            'fail': 0.9,
            'powerup': 0.2,
            'explosion': 0.3,
            'jump': 0.1,
            'collect': 0.1,
            'thrust': 0.1,
            'laser': 0.1,
            'wallBounce': 0.1,
            'flag': 0.05,
            'warning': 0.45,
            'countdown': 0.02,
            'paddleHit': 0.05
        };
        return durations[type] || 0.1;
    }
    
    /**
     * Simple beep sound
     */
    playBeep(frequency = 800, duration = 0.1, volume = 0.2) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.value = frequency;
        osc.type = 'square';
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }
    
    /**
     * Click/Select sound
     */
    playClick(volume = 0.2, startFreq = 1000) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.6, now + 0.02);
        osc.type = 'square';
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.02);
    }
    
    /**
     * Success/Win sound
     */
    playSuccess(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.value = freq;
            
            const startTime = now + i * 0.1;
            gain.gain.setValueAtTime(volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    }
    
    /**
     * Fail/Game Over sound
     */
    playFail(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const notes = [300, 250, 200];
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sawtooth';
            
            const startTime = now + i * 0.2;
            gain.gain.setValueAtTime(volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }
    
    /**
     * Power-up collection sound
     */
    playPowerUp(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.2);
    }
    
    /**
     * Explosion sound effect
     */
    playExplosion(volume = 0.3) {
        const now = this.audioContext.currentTime;
        
        // Low frequency rumble
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        // Create noise for explosion
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        
        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(volume * 0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        noise.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.3);
        noise.start();
    }
    
    /**
     * Jump sound effect
     */
    playJump(volume = 0.2, startFreq = 200) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 3, now + 0.1);
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.setValueAtTime(volume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.1);
    }
    
    /**
     * Item collection sound
     */
    playCollect(volume = 0.2, baseFreq = 800) {
        const now = this.audioContext.currentTime;
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        osc1.frequency.value = baseFreq;
        osc2.frequency.value = baseFreq * 1.5;
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(now + 0.1);
        osc2.stop(now + 0.1);
    }
    
    /**
     * Thrust/Engine sound
     */
    playThrust(volume = 0.1) {
        const now = this.audioContext.currentTime;
        
        // Create white noise for thrust
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        noise.start();
    }
    
    /**
     * Laser/Shoot sound
     */
    playLaser(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.1);
    }
    
    /**
     * Wall bounce sound (variation of bounce for JezzBall/Breakout)
     */
    playWallBounce(volume = 0.2, baseFreq = 400) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.1);
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.1);
    }
    
    /**
     * Flag placement sound for Minesweeper (short high-pitched beep)
     */
    playFlag(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 1200;
        
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.05);
    }
    
    /**
     * Warning sound for danger situations (descending tones)
     */
    playWarning(volume = 0.3) {
        const now = this.audioContext.currentTime;
        const frequencies = [800, 600, 400];
        
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.value = freq;
            
            const startTime = now + i * 0.15;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gain.gain.setValueAtTime(volume, startTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    }
    
    /**
     * Countdown tick sound for timed events
     */
    playCountdown(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.value = 1000;
        
        // Create a sharp tick sound
        gain.gain.setValueAtTime(volume, now);
        gain.gain.setValueAtTime(volume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.02);
    }
    
    /**
     * Classic paddle hit sound (like Pong/Breakout)
     */
    playPaddleHit(volume = 0.2, baseFreq = 600) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.value = baseFreq;
        
        // Very short, punchy sound
        gain.gain.setValueAtTime(volume, now);
        gain.gain.setValueAtTime(volume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(now + 0.05);
    }
    
    /**
     * Start background music with a simple 8-bit melody
     */
    startMusic(melody = 'default', tempo = 120) {
        if (!this.initialized || this.musicMuted) return;
        
        this.stopMusic();
        
        let notes;
        switch(melody) {
            case 'tetris':
                notes = [
                    { freq: 329.63, duration: 0.5 }, // E4
                    { freq: 246.94, duration: 0.25 }, // B3
                    { freq: 261.63, duration: 0.25 }, // C4
                    { freq: 293.66, duration: 0.5 }, // D4
                    { freq: 261.63, duration: 0.25 }, // C4
                    { freq: 246.94, duration: 0.25 }, // B3
                    { freq: 220.00, duration: 0.5 }, // A3
                ];
                break;
            case 'space':
                notes = [
                    { freq: 130.81, duration: 0.5 }, // C3
                    { freq: 146.83, duration: 0.5 }, // D3
                    { freq: 164.81, duration: 0.5 }, // E3
                    { freq: 174.61, duration: 0.5 }, // F3
                    { freq: 164.81, duration: 0.5 }, // E3
                    { freq: 146.83, duration: 0.5 }, // D3
                ];
                break;
            default:
                notes = [
                    { freq: 261.63, duration: 0.5 }, // C4
                    { freq: 293.66, duration: 0.5 }, // D4
                    { freq: 329.63, duration: 0.5 }, // E4
                    { freq: 349.23, duration: 0.5 }, // F4
                    { freq: 329.63, duration: 0.5 }, // E4
                    { freq: 293.66, duration: 0.5 }, // D4
                    { freq: 261.63, duration: 1 },   // C4
                ];
        }
        
        const beatDuration = 60 / tempo;
        
        const playSequence = () => {
            if (!this.musicMuted && this.audioContext) {
                const now = this.audioContext.currentTime;
                let currentTime = now;
                
                notes.forEach((note) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    
                    osc.type = 'square';
                    osc.frequency.value = note.freq;
                    
                    gain.gain.setValueAtTime(0, currentTime);
                    gain.gain.linearRampToValueAtTime(this.musicVolume, currentTime + 0.01);
                    gain.gain.setValueAtTime(this.musicVolume, currentTime + note.duration * beatDuration - 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration * beatDuration);
                    
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.start(currentTime);
                    osc.stop(currentTime + note.duration * beatDuration);
                    
                    currentTime += note.duration * beatDuration;
                });
            }
        };
        
        playSequence();
        this.musicInterval = setInterval(playSequence, notes.reduce((acc, note) => acc + note.duration, 0) * beatDuration * 1000);
    }
    
    /**
     * Stop background music
     */
    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }
    
    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.effectsVolume = this.masterVolume * 0.8;  // Increased from 0.7
        this.musicVolume = this.masterVolume * 0.4;    // Increased from 0.3
    }
    
    /**
     * Set effects volume independently
     */
    setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Toggle sound effects mute (separate from music)
     */
    toggleEffects() {
        this.effectsMuted = !this.effectsMuted;
        return this.effectsMuted;
    }
    
    /**
     * Toggle mute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        }
        return this.isMuted;
    }
    
    /**
     * Toggle music only
     */
    toggleMusic() {
        this.musicMuted = !this.musicMuted;
        if (this.musicMuted) {
            this.stopMusic();
        }
        return this.musicMuted;
    }
    
    /**
     * Enable or disable pitch variation for sounds
     * @param {boolean} enabled - Whether to enable pitch variation
     */
    setPitchVariation(enabled) {
        this.enablePitchVariation = enabled;
    }
    
    /**
     * Set the amount of pitch variation (0.0 to 1.0)
     * @param {number} amount - Variation amount (e.g., 0.05 for ±5%)
     */
    setPitchVariationAmount(amount) {
        this.pitchVariationAmount = Math.max(0, Math.min(1, amount));
    }
}

// Create global instance
window.audioManager = new AudioManager();

// Auto-initialize on first user interaction
document.addEventListener('click', () => {
    if (!window.audioManager.initialized) {
        window.audioManager.init();
    }
}, { once: true });

document.addEventListener('keydown', () => {
    if (!window.audioManager.initialized) {
        window.audioManager.init();
    }
}, { once: true });