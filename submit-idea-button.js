// Shared submit idea button component
function initializeSubmitIdeaButton() {
    // Check if button already exists
    if (document.querySelector('.submit-idea')) {
        return;
    }
    
    // Create button HTML
    const button = document.createElement('a');
    button.href = 'https://github.com/stphung/classic-games-collection/issues/new';
    button.target = '_blank';
    button.className = 'submit-idea';
    button.innerHTML = `
        <span class="submit-idea-icon">💡</span>
        <span>Submit Idea</span>
    `;
    
    // Add to body
    document.body.appendChild(button);
    
    // Add styles if not already present
    if (!document.querySelector('#submit-idea-styles')) {
        const style = document.createElement('style');
        style.id = 'submit-idea-styles';
        style.textContent = `
            .submit-idea {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.02);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 12px 20px;
                z-index: 20;
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
            
            .submit-idea:hover {
                background: rgba(255, 255, 255, 0.04);
                border-color: rgba(255, 255, 255, 0.08);
                color: #fff;
                transform: translateY(-1px);
            }
            
            .submit-idea-icon {
                font-size: 16px;
            }
            
            @media (max-width: 768px) {
                .submit-idea {
                    position: absolute;
                    top: 160px;
                    right: auto;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 12px;
                    padding: 10px 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSubmitIdeaButton);
} else {
    initializeSubmitIdeaButton();
}