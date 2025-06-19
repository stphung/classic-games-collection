/**
 * Breakout Game Audio Configuration
 * Exact sound parameters extracted from original implementation
 */
window.BREAKOUT_SOUNDS = {
    paddleHit: {
        type: 'oscillator',
        waveform: 'sine',
        frequency: 800,  // Fixed frequency, no ramp
        duration: 0.03,
        gain: {
            start: 0.08,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    brickHit: {
        type: 'oscillator',
        waveform: 'triangle',
        frequency: {
            start: 600,
            end: 300,
            ramp: 'exponential'
        },
        duration: 0.02,
        gain: {
            start: 0.1,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    lifeLost: {
        type: 'oscillator',
        waveform: 'sine',
        frequency: {
            start: 300,
            end: 150,
            ramp: 'exponential'
        },
        duration: 0.3,
        gain: {
            start: 0.1,
            end: 0.01,
            ramp: 'exponential'
        }
    },
    
    gameOver: {
        type: 'sequence',
        waveform: 'sine',
        notes: [
            {
                frequency: 300,
                delay: 0,
                duration: 0.3,
                gain: { start: 0.08, end: 0.01 }
            },
            {
                frequency: 250,
                delay: 0.2,
                duration: 0.3,
                gain: { start: 0.08, end: 0.01 }
            },
            {
                frequency: 200,
                delay: 0.4,
                duration: 0.3,
                gain: { start: 0.08, end: 0.01 }
            }
        ]
    }
};

/**
 * Breakout Background Music Configuration
 */
window.BREAKOUT_MUSIC = {
    interval: 8000, // Play every 8 seconds
    play: (audioContext, startTime) => {
        // Simple ambient pad - exact copy from original
        const notes = [130.81, 164.81, 196.00, 164.81]; // C3, E3, G3, E3
        
        notes.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            
            const noteStartTime = startTime + index * 2;
            gain.gain.setValueAtTime(0, noteStartTime);
            gain.gain.linearRampToValueAtTime(0.02, noteStartTime + 0.5);
            gain.gain.setValueAtTime(0.02, noteStartTime + 1.5);
            gain.gain.linearRampToValueAtTime(0, noteStartTime + 2);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.start(noteStartTime);
            osc.stop(noteStartTime + 2);
        });
    }
};