// Shared home button component for game pages
function initializeHomeButton() {
    // Check if button already exists with our specific ID
    if (document.querySelector('#shared-home-button')) {
        return;
    }
    
    // Create button HTML
    const button = document.createElement('a');
    button.href = '../index.html';
    button.className = 'home-button';
    button.id = 'shared-home-button';
    button.title = 'Press ESC to go back';
    button.innerHTML = `
        <span class="home-icon">🏠</span>
        <span>HOME</span>
    `;
    
    // Add click handler to use transition
    button.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof transitionToMenu === 'function') {
            transitionToMenu();
        } else {
            window.location.href = '../index.html';
        }
    });
    
    // Add to body
    document.body.appendChild(button);
    
    // Force visibility
    button.style.display = 'flex';
    button.style.visibility = 'visible';
    button.style.opacity = '1';
    
    console.log('Home button created:', button);
    
    // Add styles if not already present
    if (!document.querySelector('#home-button-styles')) {
        const style = document.createElement('style');
        style.id = 'home-button-styles';
        style.textContent = `
            .home-button {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(255, 255, 255, 0.02);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 12px 20px;
                z-index: 1000;
                transition: all 0.3s ease;
                text-decoration: none;
                color: #999;
                font-size: 13px;
                letter-spacing: 1px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .home-button:hover {
                background: rgba(255, 255, 255, 0.04);
                border-color: rgba(255, 255, 255, 0.08);
                color: #fff;
                transform: translateY(-1px);
            }
            
            .home-button:active {
                transform: translateY(0);
            }
            
            .home-icon {
                font-size: 16px;
            }
            
            /* Add visual feedback when ESC is pressed */
            .home-button.escape-hint {
                animation: pulse-hint 0.6s ease;
            }
            
            @keyframes pulse-hint {
                0%, 100% {
                    transform: scale(1) translateY(0);
                }
                50% {
                    transform: scale(1.05) translateY(-1px);
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.1);
                }
            }
            
            @media (max-width: 768px) {
                .home-button {
                    top: 10px;
                    left: 10px;
                    font-size: 12px;
                    padding: 10px 16px;
                }
                
                .home-icon {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add escape key hint animation
    let escapeKeyHandler = (e) => {
        if (e.key === 'Escape') {
            const homeBtn = document.querySelector('.home-button');
            if (homeBtn) {
                homeBtn.classList.add('escape-hint');
                setTimeout(() => {
                    homeBtn.classList.remove('escape-hint');
                }, 600);
            }
        }
    };
    
    // Add the visual feedback before the transition
    const originalKeyHandler = window.onkeydown;
    window.addEventListener('keydown', escapeKeyHandler, false);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomeButton);
} else {
    initializeHomeButton();
}

// Also try to initialize after a short delay as a fallback
setTimeout(initializeHomeButton, 100);