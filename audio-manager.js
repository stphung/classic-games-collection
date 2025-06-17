/**
 * Audio Manager for Classic Games Collection
 * Centralized audio handling with 8-bit sound effects and music
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isMuted = false;
        this.musicMuted = false;
        this.masterVolume = 0.3;
        this.musicVolume = 0.1;
        this.effectsVolume = 0.2;
        this.backgroundMusic = null;
        this.musicInterval = null;
        this.initialized = false;
        
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
     * Common 8-bit sound effects
     */
    playSound(type, options = {}) {
        if (!this.initialized || this.isMuted) return;
        
        const now = this.audioContext.currentTime;
        const volume = options.volume || this.effectsVolume;
        
        switch(type) {
            case 'beep':
                this.playBeep(options.frequency || 800, options.duration || 0.1, volume);
                break;
            case 'click':
                this.playClick(volume);
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
                this.playJump(volume);
                break;
            case 'collect':
                this.playCollect(volume);
                break;
            case 'thrust':
                this.playThrust(volume);
                break;
            case 'laser':
                this.playLaser(volume);
                break;
            default:
                console.warn('Unknown sound type:', type);
        }
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
    playClick(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);
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
    playJump(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        
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
    playCollect(volume = 0.2) {
        const now = this.audioContext.currentTime;
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        osc1.frequency.value = 800;
        osc2.frequency.value = 1200;
        
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
        this.effectsVolume = this.masterVolume * 0.7;
        this.musicVolume = this.masterVolume * 0.3;
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