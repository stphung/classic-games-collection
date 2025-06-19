/**
 * Asteroids Game Audio Configuration
 * Classic vector-based space sounds
 */
window.ASTEROIDS_SOUNDS = {
    thrust: {
        type: 'noise',
        filter: {
            type: 'lowpass',
            frequency: 200
        },
        duration: 0.1,
        gain: {
            start: 0.15,
            end: 0.1
        }
    },
    
    fire: {
        type: 'oscillator',
        waveform: 'sawtooth',
        frequency: {
            start: 600,
            end: 100,
            ramp: 'exponential'
        },
        duration: 0.15,
        gain: {
            start: 0.2,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    explodeLow: {
        type: 'noise',
        filter: {
            type: 'lowpass',
            frequency: 150
        },
        duration: 0.4,
        gain: {
            start: 0.3,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    explodeMedium: {
        type: 'noise',
        filter: {
            type: 'bandpass',
            frequency: 300,
            Q: 2
        },
        duration: 0.3,
        gain: {
            start: 0.25,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    explodeHigh: {
        type: 'noise',
        filter: {
            type: 'highpass',
            frequency: 800
        },
        duration: 0.2,
        gain: {
            start: 0.2,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    ufo: {
        type: 'custom',
        play: function(context, startTime) {
            const duration = 2;
            const osc = context.createOscillator();
            const gain = context.createGain();
            const lfo = context.createOscillator();
            const lfoGain = context.createGain();
            
            // Main oscillator
            osc.type = 'sine';
            osc.frequency.value = 200;
            
            // LFO for frequency modulation
            lfo.type = 'sine';
            lfo.frequency.value = 8;
            lfoGain.gain.value = 50;
            
            // Connect LFO to main oscillator frequency
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            // Set up gain envelope
            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.setValueAtTime(0.15, startTime + duration - 0.1);
            gain.gain.linearRampToValueAtTime(0, startTime + duration);
            
            osc.connect(gain);
            gain.connect(context.destination);
            
            osc.start(startTime);
            lfo.start(startTime);
            osc.stop(startTime + duration);
            lfo.stop(startTime + duration);
        }
    },
    
    ufoHit: {
        type: 'sequence',
        waveform: 'square',
        notes: [
            {
                frequency: 400,
                delay: 0,
                duration: 0.1,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 300,
                delay: 0.08,
                duration: 0.1,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 200,
                delay: 0.16,
                duration: 0.1,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 100,
                delay: 0.24,
                duration: 0.2,
                gain: { start: 0.2, end: 0.01 }
            }
        ]
    },
    
    hyperspace: {
        type: 'oscillator',
        waveform: 'sine',
        frequency: {
            start: 100,
            end: 2000,
            ramp: 'exponential'
        },
        duration: 0.5,
        gain: {
            start: 0.2,
            end: 0.01,
            ramp: 'exponential'
        },
        filter: {
            type: 'highpass',
            frequency: 1000
        }
    },
    
    gameOver: {
        type: 'sequence',
        waveform: 'square',
        notes: [
            {
                frequency: 220.00, // A3
                delay: 0,
                duration: 0.3,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 196.00, // G3
                delay: 0.25,
                duration: 0.3,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 174.61, // F3
                delay: 0.5,
                duration: 0.3,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 146.83, // D3
                delay: 0.75,
                duration: 0.5,
                gain: { start: 0.25, end: 0.01 }
            }
        ]
    }
};