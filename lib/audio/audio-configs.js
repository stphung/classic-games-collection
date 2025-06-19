// Audio configurations for each game
// Preserves the exact sound parameters from the original implementations

const AUDIO_CONFIGS = {
    tetris: {
        sounds: {
            rotate: () => {
                audioManager.playSound(800, 0.03, 'square', 0.03);
                audioManager.playSound(1600, 0.02, 'sine', 0.02);
                audioManager.playSound(400, 0.04, 'triangle', 0.02, { reverb: true, reverbAmount: 0.15 });
            },
            move: () => {
                audioManager.playSound(200, 0.02, 'sine', 0.015);
                audioManager.playSound(400, 0.01, 'triangle', 0.01);
            },
            lock: () => {
                audioManager.playSound(80, 0.15, 'sine', 0.1);
                audioManager.playSound(120, 0.1, 'square', 0.05);
                audioManager.playSound(40, 0.2, 'sine', 0.08);
                setTimeout(() => audioManager.playSound(200, 0.05, 'triangle', 0.03), 20);
            },
            lineClear: (linesCleared = 1) => {
                const baseFreq = 300;
                const freqMultiplier = 1 + (linesCleared * 0.3);
                
                for (let i = 0; i < linesCleared; i++) {
                    setTimeout(() => {
                        const freq = baseFreq * freqMultiplier * (1 + i * 0.5);
                        audioManager.playSound(freq, 0.3, 'sawtooth', 0.1, { reverb: true });
                        audioManager.playSound(freq * 1.5, 0.2, 'square', 0.05, { reverb: true });
                        audioManager.playSound(freq * 2, 0.15, 'sine', 0.08, { reverb: true });
                    }, i * 50);
                }
                
                // Sparkle effect
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        audioManager.playSound(1000 + Math.random() * 1000, 0.1, 'sine', 0.02, { reverb: true });
                    }, i * 30);
                }
            },
            tetris: () => {
                const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                melody.forEach((freq, i) => {
                    setTimeout(() => {
                        audioManager.playSound(freq, 0.4, 'square', 0.15, { reverb: true });
                        audioManager.playSound(freq * 0.5, 0.4, 'sine', 0.1, { reverb: true });
                        audioManager.playSound(freq * 2, 0.2, 'triangle', 0.05, { reverb: true });
                    }, i * 80);
                });
                setTimeout(() => audioManager.playSound(65.41, 0.8, 'sine', 0.2), 100);
            },
            levelUp: () => {
                const fanfare = [
                    { freq: 523.25, delay: 0 },
                    { freq: 659.25, delay: 100 },
                    { freq: 783.99, delay: 200 },
                    { freq: 1046.50, delay: 300 },
                    { freq: 783.99, delay: 400 },
                    { freq: 1046.50, delay: 500 },
                    { freq: 1318.51, delay: 600 }
                ];
                
                fanfare.forEach(({ freq, delay }) => {
                    setTimeout(() => {
                        audioManager.playSound(freq, 0.3, 'square', 0.12, { reverb: true });
                        audioManager.playSound(freq * 0.5, 0.3, 'triangle', 0.08);
                        audioManager.playSound(freq * 2, 0.15, 'sine', 0.04, { reverb: true });
                    }, delay);
                });
                
                // Timpani roll
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => audioManager.playSound(82.41, 0.05, 'sine', 0.1), i * 50);
                }
            },
            gameOver: () => {
                const notes = [
                    { freq: 1046.50, delay: 0 },
                    { freq: 830.61, delay: 200 },
                    { freq: 698.46, delay: 400 },
                    { freq: 523.25, delay: 600 },
                    { freq: 415.30, delay: 800 },
                    { freq: 349.23, delay: 1000 },
                    { freq: 261.63, delay: 1200 },
                    { freq: 130.81, delay: 1400 }
                ];
                
                notes.forEach(({ freq, delay }) => {
                    setTimeout(() => {
                        audioManager.playSound(freq, 0.5, 'sine', 0.15, { reverb: true });
                        audioManager.playSound(freq * 0.5, 0.5, 'triangle', 0.1);
                    }, delay);
                });
                
                setTimeout(() => audioManager.playSound(55, 1.5, 'sine', 0.2), 500);
            },
            softDrop: () => {
                audioManager.playSound(400, 0.1, 'triangle', 0.02, {
                    frequencyEnd: 100,
                    frequencyRamp: 'exponential'
                });
            },
            hardDrop: () => {
                audioManager.playSound(40, 0.3, 'sine', 0.2);
                audioManager.playSound(80, 0.2, 'square', 0.1);
                audioManager.playSound(160, 0.1, 'sawtooth', 0.05);
                
                setTimeout(() => {
                    audioManager.playSound(1200, 0.4, 'triangle', 0.03, { reverb: true });
                    audioManager.playSound(2400, 0.3, 'sine', 0.02, { reverb: true });
                }, 50);
                
                setTimeout(() => audioManager.playSound(40, 0.2, 'sine', 0.05), 100);
            },
            warning: () => {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        audioManager.playSound(880, 0.1, 'square', 0.05);
                        audioManager.playSound(440, 0.1, 'sawtooth', 0.03);
                    }, i * 150);
                }
            }
        },
        music: {
            volume: 0.06,
            loopInterval: 32000, // Loop every 32 seconds
            layers: [
                {
                    name: 'melody',
                    waveType: 'sine',
                    gain: 0.03,
                    attack: 0.1,
                    vibrato: { rate: 5, depth: 2 },
                    notes: [
                        { freq: 659.25, duration: 1.0 },
                        { freq: 0, duration: 0.5 },
                        { freq: 493.88, duration: 0.5 },
                        { freq: 523.25, duration: 0.5 },
                        { freq: 587.33, duration: 1.0 },
                        { freq: 0, duration: 0.5 },
                        { freq: 493.88, duration: 0.5 },
                        { freq: 440.00, duration: 1.5 },
                        { freq: 0, duration: 1.0 },
                        { freq: 523.25, duration: 0.5 },
                        { freq: 659.25, duration: 1.0 },
                        { freq: 0, duration: 0.5 },
                        { freq: 523.25, duration: 0.5 },
                        { freq: 493.88, duration: 2.0 },
                        { freq: 0, duration: 1.0 },
                        { freq: 587.33, duration: 1.0 },
                        { freq: 659.25, duration: 1.0 },
                        { freq: 523.25, duration: 1.0 },
                        { freq: 440.00, duration: 2.0 },
                        { freq: 0, duration: 2.0 }
                    ]
                },
                {
                    name: 'bass',
                    waveType: 'triangle',
                    gain: 0.04,
                    notes: [
                        { freq: 164.81, duration: 0.5 },
                        { freq: 164.81, duration: 0.5 },
                        { freq: 164.81, duration: 0.5 },
                        { freq: 164.81, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 },
                        { freq: 123.47, duration: 0.5 },
                        { freq: 123.47, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 164.81, duration: 0.5 },
                        { freq: 110.00, duration: 0.5 },
                        { freq: 110.00, duration: 0.5 },
                        { freq: 110.00, duration: 0.5 },
                        { freq: 110.00, duration: 0.5 }
                    ]
                },
                {
                    name: 'harmony',
                    waveType: 'triangle',
                    gain: 0.03,
                    notes: [
                        { freq: 329.63, duration: 1.0 },
                        { freq: 329.63, duration: 1.0 },
                        { freq: 293.66, duration: 1.0 },
                        { freq: 293.66, duration: 1.0 },
                        { freq: 261.63, duration: 1.0 },
                        { freq: 261.63, duration: 1.0 },
                        { freq: 246.94, duration: 1.0 },
                        { freq: 246.94, duration: 1.0 },
                        { freq: 220.00, duration: 2.0 }
                    ]
                }
            ]
        }
    },
    
    frogger: {
        sounds: {
            hop: () => {
                audioManager.playSound(400, 0.1, 'square', 0.15, {
                    frequencyEnd: 600,
                    frequencyRamp: 'exponential'
                });
            },
            crash: () => {
                audioManager.playNoise(0.3, 0.3);
            },
            splash: () => {
                // Plop sound
                audioManager.playSound(200, 0.1, 'sine', 0.4, {
                    frequencyEnd: 50,
                    frequencyRamp: 'exponential'
                });
                // Splash noise
                audioManager.playNoise(0.5, 0.5, {
                    filter: {
                        type: 'bandpass',
                        frequencyStart: 1500,
                        frequencyEnd: 400,
                        Q: 2
                    }
                });
            },
            success: () => {
                audioManager.playNoteSequence([523, 659, 784, 1047], 'square', 0.2, 0.1);
            }
        },
        music: {
            volume: 0.04,
            loopInterval: 32000,
            layers: [
                {
                    name: 'melody',
                    waveType: 'sine',
                    gain: 0.04,
                    filter: { type: 'lowpass', frequency: 4000, Q: 0.5 },
                    notes: [
                        { freq: 440, duration: 2.0 },
                        { freq: 523, duration: 2.4 },
                        { freq: 392, duration: 1.6 },
                        { freq: 349, duration: 3.0 },
                        { freq: 330, duration: 2.0 },
                        { freq: 440, duration: 4.0 }
                    ]
                },
                {
                    name: 'bass',
                    waveType: 'sine',
                    gain: 0.05,
                    notes: [
                        { freq: 55, duration: 8.0 },
                        { freq: 65.5, duration: 8.0 },
                        { freq: 49, duration: 8.0 },
                        { freq: 55, duration: 8.0 }
                    ]
                },
                {
                    name: 'texture',
                    waveType: 'triangle',
                    gain: 0.025,
                    notes: [
                        { freq: 220, duration: 4.0 },
                        { freq: 262, duration: 4.0 },
                        { freq: 330, duration: 4.0 },
                        { freq: 262, duration: 4.0 },
                        { freq: 220, duration: 4.0 },
                        { freq: 196, duration: 4.0 },
                        { freq: 175, duration: 4.0 },
                        { freq: 220, duration: 4.0 }
                    ]
                },
                {
                    name: 'shimmer',
                    waveType: 'sine',
                    gain: 0.015,
                    notes: [
                        { freq: 880, duration: 6.0 },
                        { freq: 1047, duration: 6.0 },
                        { freq: 784, duration: 6.0 },
                        { freq: 698, duration: 6.0 },
                        { freq: 880, duration: 8.0 }
                    ]
                }
            ]
        }
    },
    
    missileCommand: {
        sounds: {
            launch: () => {
                audioManager.playSound(200, 0.2, 'sawtooth', 0.3, {
                    frequencyEnd: 600,
                    frequencyRamp: 'exponential'
                });
            },
            explosion: () => {
                audioManager.playNoise(0.5, 0.5, {
                    envelope: 5,
                    filter: {
                        type: 'lowpass',
                        frequencyStart: 3000,
                        frequencyEnd: 400
                    }
                });
            },
            impact: () => {
                audioManager.playSound(150, 0.1, 'sine', 0.3, {
                    frequencyEnd: 50,
                    frequencyRamp: 'exponential'
                });
            },
            waveComplete: () => {
                audioManager.playNoteSequence([523, 659, 784, 1047], 'square', 0.2, 0.1);
            }
        },
        music: {
            volume: 0.1,
            loopInterval: 1600,
            layers: [
                {
                    name: 'bass',
                    waveType: 'triangle',
                    gain: 0.1,
                    attack: 0.01,
                    notes: [
                        { freq: 55, duration: 0.2 },
                        { freq: 0, duration: 0.2 },
                        { freq: 55, duration: 0.2 },
                        { freq: 0, duration: 0.2 },
                        { freq: 82.5, duration: 0.2 },
                        { freq: 0, duration: 0.2 },
                        { freq: 82.5, duration: 0.2 },
                        { freq: 0, duration: 0.2 }
                    ]
                },
                {
                    name: 'pad',
                    waveType: 'sawtooth',
                    gain: 0.03,
                    filter: { type: 'lowpass', frequency: 200 },
                    notes: [
                        { freq: 110, duration: 1.6 }
                    ]
                }
            ]
        }
    },
    
    lunarLander: {
        sounds: {
            thrust: () => {
                audioManager.playNoise(0.1, 0.1, {
                    filter: { type: 'lowpass', frequency: 400 }
                });
            },
            landing: () => {
                audioManager.playSound(400, 0.2, 'sine', 0.2, {
                    frequencyEnd: 800,
                    frequencyRamp: 'exponential'
                });
            },
            crash: () => {
                audioManager.playSound(150, 0.5, 'sawtooth', 0.3, {
                    frequencyEnd: 50,
                    frequencyRamp: 'exponential'
                });
            },
            beep: () => {
                audioManager.playSound(880, 0.05, 'sine', 0.1);
            }
        },
        music: {
            volume: 0.08,
            loopInterval: 4000,
            layers: [
                {
                    name: 'sequence',
                    waveType: 'square',
                    gain: 0.08,
                    attack: 0.01,
                    notes: [
                        { freq: 110, duration: 0.5 },
                        { freq: 123.47, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 },
                        { freq: 123.47, duration: 0.5 },
                        { freq: 110, duration: 0.5 },
                        { freq: 98, duration: 0.5 }
                    ]
                }
            ]
        }
    },
    
    jezzBall: {
        sounds: {
            bounce: () => {
                audioManager.playSound(150, 0.03, 'sine', 0.05, {
                    frequencyEnd: 120,
                    frequencyRamp: 'exponential'
                });
            },
            wallComplete: () => {
                audioManager.playSound(400, 0.2, 'sine', 0.3, {
                    frequencyEnd: 800,
                    frequencyRamp: 'exponential'
                });
            },
            lifeLost: () => {
                audioManager.playSound(400, 0.3, 'sawtooth', 0.4, {
                    frequencyEnd: 100,
                    frequencyRamp: 'exponential'
                });
            },
            levelComplete: () => {
                audioManager.playNoteSequence([523.25, 659.25, 783.99, 1046.50], 'square', 0.2, 0.1);
            },
            gameOver: () => {
                audioManager.playNoteSequence([262, 247, 233, 220], 'square', 0.3, 0.2);
            }
        },
        music: {
            volume: 0.1,
            loopInterval: 2000,
            layers: [
                {
                    name: 'melody',
                    waveType: 'triangle',
                    gain: 0.1,
                    attack: 0.01,
                    notes: [
                        { freq: 261.63, duration: 0.25 },
                        { freq: 293.66, duration: 0.25 },
                        { freq: 329.63, duration: 0.25 },
                        { freq: 349.23, duration: 0.25 },
                        { freq: 392.00, duration: 0.25 },
                        { freq: 349.23, duration: 0.25 },
                        { freq: 329.63, duration: 0.25 },
                        { freq: 293.66, duration: 0.25 }
                    ]
                }
            ]
        }
    },
    
    minesweeper: {
        sounds: {
            reveal: () => {
                audioManager.playSound(800, 0.1, 'sine', 0.2, {
                    frequencyEnd: 400,
                    frequencyRamp: 'exponential'
                });
            },
            flag: () => {
                audioManager.playSound(600, 0.05, 'square', 0.1);
            },
            mine: () => {
                audioManager.playSound(100, 0.3, 'sawtooth', 0.3, {
                    frequencyEnd: 50,
                    frequencyRamp: 'exponential'
                });
                audioManager.playNoise(0.3, 0.3);
            },
            win: () => {
                audioManager.playNoteSequence([523.25, 659.25, 783.99, 1046.50], 'square', 0.1, 0.1);
            }
        },
        music: {
            volume: 0.1,
            loopInterval: 4000,
            layers: [
                {
                    name: 'sequence',
                    waveType: 'square',
                    gain: 0.1,
                    attack: 0.01,
                    notes: [
                        { freq: 130.81, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 164.81, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 },
                        { freq: 174.61, duration: 0.5 },
                        { freq: 164.81, duration: 0.5 },
                        { freq: 146.83, duration: 0.5 },
                        { freq: 130.81, duration: 0.5 }
                    ]
                }
            ]
        }
    }
};

// Make it globally available
window.AUDIO_CONFIGS = AUDIO_CONFIGS;