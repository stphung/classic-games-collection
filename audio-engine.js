/**
 * Shared Audio Engine for Classic Games Collection
 * Preserves exact sound characteristics of each game
 */
class AudioEngine {
    constructor() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Failed to create AudioContext:', e);
            throw e;
        }
        this.sounds = new Map();
        this.musicLoops = new Map();
        this.musicIntervals = new Map();
        this.globalMuted = window.isGloballyMuted ? window.isGloballyMuted() : false;
        
        console.log('AudioEngine initialized', {
            state: this.context.state,
            globalMuted: this.globalMuted
        });
        
        // Listen for global mute changes
        window.addEventListener('globalMuteToggle', (e) => {
            this.globalMuted = e.detail.isMuted;
            console.log('Global mute toggled:', this.globalMuted);
            if (this.globalMuted) {
                this.stopAllMusic();
            }
        });
    }
    
    /**
     * Register a game's sound configuration
     * @param {string} gameId - Unique identifier for the game
     * @param {Object} soundConfig - Configuration object with all game sounds
     */
    registerGame(gameId, soundConfig) {
        const soundNames = Object.keys(soundConfig);
        Object.entries(soundConfig).forEach(([soundName, config]) => {
            this.sounds.set(`${gameId}.${soundName}`, config);
        });
        console.log(`Registered ${gameId} with sounds:`, soundNames);
    }
    
    /**
     * Play a sound effect
     * @param {string} soundId - Format: "gameId.soundName"
     */
    playSound(soundId) {
        console.log(`Playing sound: ${soundId}, muted: ${this.globalMuted}, context: ${this.context.state}`);
        
        if (this.globalMuted) {
            console.log('Sound blocked: globally muted');
            return;
        }
        
        // Resume context if suspended (happens on user interaction)
        if (this.context.state === 'suspended') {
            this.context.resume().then(() => {
                console.log('AudioContext resumed');
                this._playSoundInternal(soundId);
            }).catch(err => {
                console.error('Failed to resume AudioContext:', err);
            });
            return;
        }
        
        this._playSoundInternal(soundId);
    }
    
    _playSoundInternal(soundId) {
        const config = this.sounds.get(soundId);
        if (!config) {
            console.warn(`Sound not found: ${soundId}`);
            console.log('Available sounds:', Array.from(this.sounds.keys()));
            return;
        }
        
        const now = this.context.currentTime;
        
        switch (config.type) {
            case 'oscillator':
                this._playOscillator(config, now);
                break;
            case 'sequence':
                this._playSequence(config, now);
                break;
            case 'noise':
                this._playNoise(config, now);
                break;
            case 'custom':
                // For complex sounds that need custom implementation
                if (config.play) {
                    config.play(this.context, now);
                }
                break;
        }
    }
    
    /**
     * Play a single oscillator sound
     */
    _playOscillator(config, startTime) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        // Set oscillator type
        osc.type = config.waveform || 'sine';
        
        // Set frequency
        if (typeof config.frequency === 'object') {
            osc.frequency.setValueAtTime(config.frequency.start, startTime);
            if (config.frequency.ramp === 'exponential') {
                osc.frequency.exponentialRampToValueAtTime(
                    config.frequency.end,
                    startTime + config.duration
                );
            } else {
                osc.frequency.linearRampToValueAtTime(
                    config.frequency.end,
                    startTime + config.duration
                );
            }
        } else {
            osc.frequency.value = config.frequency;
        }
        
        // Set gain
        if (typeof config.gain === 'object') {
            gain.gain.setValueAtTime(config.gain.start, startTime);
            if (config.gain.ramp === 'exponential') {
                gain.gain.exponentialRampToValueAtTime(
                    config.gain.end,
                    startTime + config.duration
                );
            } else {
                gain.gain.linearRampToValueAtTime(
                    config.gain.end,
                    startTime + config.duration
                );
            }
        } else {
            gain.gain.value = config.gain || 0.1;
        }
        
        // Apply filter if specified
        if (config.filter) {
            const filter = this.context.createBiquadFilter();
            filter.type = config.filter.type;
            filter.frequency.value = config.filter.frequency;
            if (config.filter.Q) filter.Q.value = config.filter.Q;
            
            osc.connect(filter);
            filter.connect(gain);
        } else {
            osc.connect(gain);
        }
        
        gain.connect(this.context.destination);
        
        osc.start(startTime);
        osc.stop(startTime + config.duration);
    }
    
    /**
     * Play a sequence of notes
     */
    _playSequence(config, startTime) {
        config.notes.forEach((note) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.type = config.waveform || 'sine';
            osc.frequency.value = note.frequency;
            
            const noteStart = startTime + (note.delay || 0);
            const noteGain = note.gain || config.gain || {};
            
            gain.gain.setValueAtTime(
                noteGain.start || 0.08,
                noteStart
            );
            gain.gain.exponentialRampToValueAtTime(
                noteGain.end || 0.01,
                noteStart + note.duration
            );
            
            osc.connect(gain);
            gain.connect(this.context.destination);
            
            osc.start(noteStart);
            osc.stop(noteStart + note.duration);
        });
    }
    
    /**
     * Play noise-based sound (for explosions, etc)
     */
    _playNoise(config, startTime) {
        const bufferSize = this.context.sampleRate * config.duration;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const source = this.context.createBufferSource();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        
        source.buffer = buffer;
        
        // Apply filter
        filter.type = config.filter?.type || 'lowpass';
        filter.frequency.value = config.filter?.frequency || 1000;
        
        // Set gain envelope
        const gainConfig = config.gain || {};
        gain.gain.setValueAtTime(gainConfig.start || 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(
            gainConfig.end || 0.01,
            startTime + config.duration
        );
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.context.destination);
        
        source.start(startTime);
        source.stop(startTime + config.duration);
    }
    
    /**
     * Start a music loop
     * @param {string} gameId - Game identifier
     * @param {Object} musicConfig - Music configuration
     */
    startMusic(gameId, musicConfig) {
        if (this.globalMuted) return;
        
        this.stopMusic(gameId);
        
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        
        const playLoop = () => {
            if (this.globalMuted) return;
            
            const now = this.context.currentTime;
            musicConfig.play(this.context, now);
        };
        
        // Play immediately
        playLoop();
        
        // Set up interval for looping
        if (musicConfig.interval) {
            const intervalId = setInterval(playLoop, musicConfig.interval);
            this.musicIntervals.set(gameId, intervalId);
        }
    }
    
    /**
     * Stop music for a specific game
     */
    stopMusic(gameId) {
        const intervalId = this.musicIntervals.get(gameId);
        if (intervalId) {
            clearInterval(intervalId);
            this.musicIntervals.delete(gameId);
        }
    }
    
    /**
     * Stop all music
     */
    stopAllMusic() {
        this.musicIntervals.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        this.musicIntervals.clear();
    }
    
    /**
     * Resume audio context if suspended
     */
    resume() {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}

// Create and expose singleton instance globally
window.audioEngine = new AudioEngine();