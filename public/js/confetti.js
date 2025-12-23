/**
 * Confetti Animation Module
 * Creates celebratory confetti effects
 */

/**
 * Show confetti animation
 * @param {number} count - Number of confetti pieces (default: 30)
 * @param {string[]} colors - Array of colors to use
 */
function showConfetti(count = 30, colors = null) {
    const defaultColors = ['#ff6b6b', '#ffa94d', '#ffd43b', '#51cf66', '#4dabf7', '#da77f2', '#f783ac'];
    const confettiColors = colors || defaultColors;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

/**
 * Show celebration confetti for high scores
 * Creates a staggered confetti effect over time
 * @param {number} count - Total number of confetti pieces
 * @param {number} delay - Delay between each piece in ms
 */
function showCelebrationConfetti(count = 50, delay = 50) {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a78bfa', '#34d399'];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * delay);
    }
}
