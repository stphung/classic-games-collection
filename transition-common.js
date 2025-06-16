// Common transition code for all game pages
function initializeTransitions() {
    // Create transition overlay if it doesn't exist
    if (!document.querySelector('.transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-icon"></div>
                <div class="transition-text">Returning to Menu...</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    // Add transition CSS if not already present
    if (!document.querySelector('#transition-styles')) {
        const style = document.createElement('style');
        style.id = 'transition-styles';
        style.textContent = `
            .transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .transition-overlay.active {
                opacity: 1;
                pointer-events: all;
            }
            
            .transition-content {
                text-align: center;
                transform: scale(0.9);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
            }
            
            .transition-overlay.active .transition-content {
                transform: scale(1);
                opacity: 1;
            }
            
            .transition-icon {
                width: 60px;
                height: 60px;
                margin: 0 auto 20px;
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                position: relative;
                animation: pulse-ring 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse-ring {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.7;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            .transition-icon::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 30px;
                height: 30px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                transform: translate(-50%, -50%);
                border-radius: 50%;
            }
            
            .transition-text {
                font-size: 14px;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.6);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            body.transitioning {
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add fade-in animation on page load
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.8s ease-out';
        document.body.style.opacity = '1';
    });
}

// Function to transition back to menu
function transitionToMenu() {
    const overlay = document.querySelector('.transition-overlay');
    if (overlay) {
        document.body.classList.add('transitioning');
        overlay.classList.add('active');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    } else {
        // Fallback if overlay doesn't exist
        window.location.href = 'index.html';
    }
}

// Initialize transitions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTransitions);
} else {
    initializeTransitions();
}

// Override escape key navigation
const originalKeyHandler = window.onkeydown;
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        transitionToMenu();
        return false;
    }
}, true);