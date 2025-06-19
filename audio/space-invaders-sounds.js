/**
 * Space Invaders Game Audio Configuration
 * Classic arcade invasion sound effects
 */
window.SPACE_INVADERS_SOUNDS = {
    shoot: {
        type: 'oscillator',
        waveform: 'square',
        frequency: {
            start: 1000,
            end: 200,
            ramp: 'exponential'
        },
        duration: 0.1,
        gain: {
            start: 0.15,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    invaderHit: {
        type: 'noise',
        filter: {
            type: 'bandpass',
            frequency: 2000,
            Q: 5
        },
        duration: 0.15,
        gain: {
            start: 0.2,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    playerHit: {
        type: 'noise',
        filter: {
            type: 'lowpass',
            frequency: 500
        },
        duration: 0.3,
        gain: {
            start: 0.3,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    invaderShoot: {
        type: 'oscillator',
        waveform: 'sawtooth',
        frequency: {
            start: 100,
            end: 50,
            ramp: 'linear'
        },
        duration: 0.2,
        gain: {
            start: 0.1,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    ufo: {
        type: 'oscillator',
        waveform: 'sine',
        frequency: {
            values: [400, 500, 400, 500, 400, 500],
            duration: 0.1
        },
        duration: 0.6,
        gain: {
            start: 0.15,
            end: 0.15
        }
    },
    
    ufoHit: {
        type: 'sequence',
        waveform: 'square',
        notes: [
            {
                frequency: 800,
                delay: 0,
                duration: 0.05,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 600,
                delay: 0.05,
                duration: 0.05,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 400,
                delay: 0.1,
                duration: 0.05,
                gain: { start: 0.2, end: 0.1 }
            },
            {
                frequency: 200,
                delay: 0.15,
                duration: 0.1,
                gain: { start: 0.2, end: 0.01 }
            }
        ]
    },
    
    nextWave: {
        type: 'sequence',
        waveform: 'sine',
        notes: [
            {
                frequency: 261.63, // C4
                delay: 0,
                duration: 0.15,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 329.63, // E4
                delay: 0.1,
                duration: 0.15,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 392.00, // G4
                delay: 0.2,
                duration: 0.15,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 523.25, // C5
                delay: 0.3,
                duration: 0.3,
                gain: { start: 0.25, end: 0.01 }
            }
        ]
    },
    
    gameOver: {
        type: 'sequence',
        waveform: 'square',
        notes: [
            {
                frequency: 440.00, // A4
                delay: 0,
                duration: 0.3,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 415.30, // G#4
                delay: 0.25,
                duration: 0.3,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 392.00, // G4
                delay: 0.5,
                duration: 0.3,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 349.23, // F4
                delay: 0.75,
                duration: 0.5,
                gain: { start: 0.25, end: 0.01 }
            }
        ]
    }
};