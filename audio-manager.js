// Centralized Audio Manager for Classic Games Collection
// Handles all sound effects and background music with the global mute system

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.initialized = false;
        this.isMuted = window.isGloballyMuted ? window.isGloballyMuted() : false;
        this.musicInterval = null;
        this.musicPlaying = false;
        
        // Listen for global mute changes
        window.addEventListener('globalMuteToggle', (e) => {
            this.isMuted = e.detail.isMuted;
            if (this.musicGain) {
                this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.audioContext.currentTime);
            }
        });
    }
    
    init() {
        if (this.initialized) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        this.masterGain.connect(this.audioContext.destination);
        
        this.initialized = true;
    }
    
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            return this.audioContext.resume();
        }
        return Promise.resolve();
    }
    
    // Create reverb effect (used by Tetris)
    createReverb() {
        const convolver = this.audioContext.createConvolver();
        const length = this.audioContext.sampleRate * 2;
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        return convolver;
    }
    
    // Generic sound player with all parameters
    playSound(frequency, duration, type = 'sine', gain = 0.1, options = {}) {
        if (this.isMuted || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        
        // Handle frequency changes
        if (options.frequencyEnd) {
            oscillator.frequency.setValueAtTime(frequency, now);
            if (options.frequencyRamp === 'exponential') {
                oscillator.frequency.exponentialRampToValueAtTime(options.frequencyEnd, now + duration);
            } else {
                oscillator.frequency.linearRampToValueAtTime(options.frequencyEnd, now + duration);
            }
        } else {
            oscillator.frequency.setValueAtTime(frequency, now);
        }
        
        // Handle gain envelope
        if (options.attack) {
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(gain, now + options.attack);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        } else {
            gainNode.gain.setValueAtTime(gain, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        }
        
        // Connect with optional filter
        if (options.filter) {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = options.filter.type || 'lowpass';
            filter.frequency.setValueAtTime(options.filter.frequency || 1000, now);
            if (options.filter.Q) filter.Q.value = options.filter.Q;
            
            oscillator.connect(filter);
            filter.connect(gainNode);
        } else {
            oscillator.connect(gainNode);
        }
        
        // Connect with optional reverb
        if (options.reverb && this.reverb) {
            const reverbGain = this.audioContext.createGain();
            reverbGain.gain.setValueAtTime(options.reverbAmount || 0.15, now);
            gainNode.connect(this.reverb);
            this.reverb.connect(reverbGain);
            reverbGain.connect(this.masterGain);
        }
        
        gainNode.connect(this.masterGain);
        
        oscillator.start(now + (options.delay || 0));
        oscillator.stop(now + (options.delay || 0) + duration);
        
        return { oscillator, gainNode };
    }
    
    // Play noise burst (for explosions, crashes, etc.)
    playNoise(duration, gain = 0.3, options = {}) {
        if (this.isMuted || !this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate noise with optional envelope
        for (let i = 0; i < bufferSize; i++) {
            const envelope = options.envelope ? Math.exp(-i / bufferSize * (options.envelope || 5)) : 1;
            data[i] = (Math.random() * 2 - 1) * envelope;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(gain, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        // Optional filter
        if (options.filter) {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = options.filter.type || 'lowpass';
            
            if (options.filter.frequencyStart && options.filter.frequencyEnd) {
                filter.frequency.setValueAtTime(options.filter.frequencyStart, now);
                filter.frequency.exponentialRampToValueAtTime(options.filter.frequencyEnd, now + duration);
            } else {
                filter.frequency.setValueAtTime(options.filter.frequency || 1000, now);
            }
            
            if (options.filter.Q) filter.Q.value = options.filter.Q;
            
            source.connect(filter);
            filter.connect(gainNode);
        } else {
            source.connect(gainNode);
        }
        
        gainNode.connect(this.masterGain);
        source.start(now);
    }
    
    // Play a sequence of notes (for melodies, fanfares, etc.)
    playNoteSequence(notes, noteType = 'square', baseGain = 0.2, noteDuration = 0.1) {
        if (this.isMuted || !this.audioContext) return;
        
        notes.forEach((freq, i) => {
            this.playSound(freq, noteDuration * 3, noteType, baseGain, {
                delay: i * noteDuration
            });
        });
    }
    
    // Background music system
    startBackgroundMusic(config) {
        if (this.musicPlaying || !this.audioContext) return;
        
        this.musicPlaying = true;
        this.musicVolume = config.volume || 0.1;
        
        if (!this.musicGain) {
            this.musicGain = this.audioContext.createGain();
            this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.audioContext.currentTime);
            this.musicGain.connect(this.masterGain);
        }
        
        const playMusic = () => {
            if (!this.musicPlaying || !this.audioContext) return;
            
            const now = this.audioContext.currentTime;
            let currentTime = 0;
            
            // Play each layer
            if (config.layers) {
                config.layers.forEach(layer => {
                    currentTime = 0;
                    layer.notes.forEach(note => {
                        if (note.freq > 0) {
                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();
                            
                            osc.type = layer.waveType || 'sine';
                            osc.frequency.setValueAtTime(note.freq, now + currentTime);
                            
                            // Apply layer-specific options
                            if (layer.vibrato) {
                                const vibrato = this.audioContext.createOscillator();
                                const vibratoGain = this.audioContext.createGain();
                                vibrato.frequency.setValueAtTime(layer.vibrato.rate || 5, now + currentTime);
                                vibratoGain.gain.setValueAtTime(layer.vibrato.depth || 2, now + currentTime);
                                vibrato.connect(vibratoGain);
                                vibratoGain.connect(osc.frequency);
                                vibrato.start(now + currentTime);
                                vibrato.stop(now + currentTime + note.duration);
                            }
                            
                            // Envelope
                            const attackTime = layer.attack || 0.01;
                            const releaseTime = layer.release || 0.1;
                            gain.gain.setValueAtTime(0, now + currentTime);
                            gain.gain.linearRampToValueAtTime(layer.gain || 0.05, now + currentTime + attackTime);
                            gain.gain.setValueAtTime(layer.gain || 0.05, now + currentTime + note.duration - releaseTime);
                            gain.gain.exponentialRampToValueAtTime(0.001, now + currentTime + note.duration);
                            
                            osc.connect(gain);
                            
                            // Optional filter
                            if (layer.filter) {
                                const filter = this.audioContext.createBiquadFilter();
                                filter.type = layer.filter.type || 'lowpass';
                                filter.frequency.setValueAtTime(layer.filter.frequency || 2000, now + currentTime);
                                if (layer.filter.Q) filter.Q.value = layer.filter.Q;
                                gain.connect(filter);
                                filter.connect(this.musicGain);
                            } else {
                                gain.connect(this.musicGain);
                            }
                            
                            osc.start(now + currentTime);
                            osc.stop(now + currentTime + note.duration);
                        }
                        currentTime += note.duration;
                    });
                });
            }
        };
        
        // Initial play
        playMusic();
        
        // Set up loop
        if (config.loopInterval) {
            this.musicInterval = setInterval(playMusic, config.loopInterval);
        }
    }
    
    stopBackgroundMusic() {
        this.musicPlaying = false;
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }
    
    // Common sound effect presets used across games
    
    playExplosion() {
        this.playNoise(0.5, 0.5, {
            envelope: 5,
            filter: {
                type: 'lowpass',
                frequencyStart: 3000,
                frequencyEnd: 400
            }
        });
    }
    
    playLaunch() {
        this.playSound(200, 0.2, 'sawtooth', 0.3, {
            frequencyEnd: 600,
            frequencyRamp: 'exponential'
        });
    }
    
    playSuccess() {
        this.playNoteSequence([523, 659, 784, 1047], 'square', 0.2, 0.1);
    }
    
    playGameOver() {
        this.playNoteSequence([262, 247, 233, 220], 'square', 0.3, 0.2);
    }
    
    playClick() {
        this.playSound(800, 0.05, 'sine', 0.1);
    }
    
    playBounce() {
        this.playSound(150, 0.03, 'sine', 0.05, {
            frequencyEnd: 120,
            frequencyRamp: 'exponential'
        });
    }
}

// Create and export a singleton instance
const audioManager = new AudioManager();

// Make it globally available for all games
window.audioManager = audioManager;