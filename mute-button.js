// Reusable mute button component for all games
(function() {
    // Global mute state shared across all games
    let globalMuteState = localStorage.getItem('gameMuted') === 'true';
    
    // Function to create and inject mute button
    function createMuteButton() {
        // Check if button already exists
        if (document.getElementById('globalMuteButton')) return;
        
        // Create button HTML
        const muteButton = document.createElement('button');
        muteButton.className = 'mute-button';
        muteButton.id = 'globalMuteButton';
        muteButton.innerHTML = `<span id="muteIcon" class="mute-icon">${globalMuteState ? '🔇' : '🔊'}</span>`;
        
        // Apply initial state
        if (globalMuteState) {
            muteButton.classList.add('muted');
        }
        
        // Add click handler
        muteButton.addEventListener('click', toggleGlobalMute);
        
        // Add to page
        document.body.appendChild(muteButton);
        
        // Add styles if not already present
        if (!document.getElementById('muteButtonStyles')) {
            const style = document.createElement('style');
            style.id = 'muteButtonStyles';
            style.textContent = `
                .mute-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 100;
                }

                .mute-icon {
                    font-size: 28px;
                    line-height: 1;
                }

                .mute-button:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                    transform: scale(1.05);
                }

                .mute-button.muted {
                    color: #666;
                }

                .mute-button:not(.muted) {
                    color: #60a5fa;
                }

                @media (max-width: 768px) {
                    .mute-button {
                        width: 50px;
                        height: 50px;
                        bottom: 15px;
                        right: 15px;
                    }

                    .mute-icon {
                        font-size: 24px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Toggle mute function
    function toggleGlobalMute() {
        globalMuteState = !globalMuteState;
        localStorage.setItem('gameMuted', globalMuteState);
        
        const muteIcon = document.getElementById('muteIcon');
        const muteButton = document.getElementById('globalMuteButton');
        
        if (globalMuteState) {
            muteIcon.textContent = '🔇';
            muteButton.classList.add('muted');
        } else {
            muteIcon.textContent = '🔊';
            muteButton.classList.remove('muted');
        }
        
        // Dispatch custom event for games to listen to
        window.dispatchEvent(new CustomEvent('globalMuteToggle', { 
            detail: { isMuted: globalMuteState } 
        }));
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMuteButton);
    } else {
        createMuteButton();
    }
    
    // Expose global mute state getter for games to check on initialization
    window.isGloballyMuted = function() {
        return globalMuteState;
    };
    
    // Expose function to update mute state programmatically
    window.setGlobalMute = function(muted) {
        if (globalMuteState !== muted) {
            toggleGlobalMute();
        }
    };
})();