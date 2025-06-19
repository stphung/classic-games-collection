/**
 * Snake Game Audio Configuration
 * Exact sound parameters extracted from original implementation
 */
window.SNAKE_SOUNDS = {
    eat: {
        type: 'oscillator',
        waveform: 'sine',
        frequency: {
            start: 400,
            end: 800,
            ramp: 'exponential'
        },
        duration: 0.05,
        gain: {
            start: 0.1,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    turn: {
        type: 'oscillator',
        waveform: 'triangle',
        frequency: 200,
        duration: 0.01,
        gain: {
            start: 0.03,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    gameOver: {
        type: 'sequence',
        waveform: 'sine',
        notes: [
            {
                frequency: 400,
                delay: 0,
                duration: 0.2,
                gain: { start: 0.08, end: 0.01 }
            },
            {
                frequency: 300,
                delay: 0.15,
                duration: 0.2,
                gain: { start: 0.08, end: 0.01 }
            },
            {
                frequency: 200,
                delay: 0.3,
                duration: 0.2,
                gain: { start: 0.08, end: 0.01 }
            }
        ]
    }
};