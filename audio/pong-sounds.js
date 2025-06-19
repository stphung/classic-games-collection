/**
 * Pong Game Audio Configuration
 * Classic table tennis sound effects
 */
window.PONG_SOUNDS = {
    paddleHit: {
        type: 'oscillator',
        waveform: 'square',
        frequency: 220,
        duration: 0.1,
        gain: {
            start: 0.2,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    wallHit: {
        type: 'oscillator',
        waveform: 'triangle',
        frequency: 440,
        duration: 0.05,
        gain: {
            start: 0.15,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    score: {
        type: 'sequence',
        waveform: 'sine',
        notes: [
            {
                frequency: 523.25, // C5
                delay: 0,
                duration: 0.15,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 659.25, // E5
                delay: 0.1,
                duration: 0.15,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 783.99, // G5
                delay: 0.2,
                duration: 0.2,
                gain: { start: 0.25, end: 0.01 }
            }
        ]
    },
    
    gameOver: {
        type: 'sequence',
        waveform: 'sine',
        notes: [
            {
                frequency: 523.25, // C5
                delay: 0,
                duration: 0.3,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 493.88, // B4
                delay: 0.25,
                duration: 0.3,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 440.00, // A4
                delay: 0.5,
                duration: 0.3,
                gain: { start: 0.2, end: 0.01 }
            },
            {
                frequency: 392.00, // G4
                delay: 0.75,
                duration: 0.5,
                gain: { start: 0.25, end: 0.01 }
            }
        ]
    }
};