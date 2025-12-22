/**
 * MascotController - Animated Quiz Mascot System
 * Manages multiple cute cartoon mascots that react to quiz answers
 * with topic-specific animations and random emotion varieties
 */
class MascotController {
    constructor() {
        this.wormElement = document.getElementById('worm-character');
        this.mascotContainer = document.getElementById('mascot-container');
        this.sceneBackground = document.getElementById('scene-background');
        this.particlesContainer = document.getElementById('reaction-particles');
        this.speechBubble = null;

        this.currentTopic = null;
        this.currentState = 'idle';
        this.currentMascot = 'worm'; // Default mascot
        this.reactionTimeout = null;

        // Available mascots
        this.mascots = ['worm', 'bunny', 'owl', 'cat', 'robot'];

        // Happy emotion varieties with weights (higher = more likely)
        this.happyEmotions = [
            { name: 'happy', weight: 30, messages: ['YAY!', 'WOOHOO!', 'AWESOME!', 'GREAT!'] },
            { name: 'excited', weight: 25, messages: ['WOW!', 'AMAZING!', 'PERFECT!', 'YES!'] },
            { name: 'giggling', weight: 15, messages: ['Hehe!', 'Teehee!', '*giggle*', 'Haha!'] },
            { name: 'proud', weight: 15, messages: ['Genius!', 'So smart!', 'Brilliant!', 'Nailed it!'] },
            { name: 'dancing', weight: 15, messages: ['*dance*', 'Party!', 'Wooo!', 'Yeah!'] }
        ];

        // Sad emotion varieties with weights
        this.sadEmotions = [
            { name: 'sad', weight: 35, messages: ['Oops!', 'Aww...', 'Oh no!', 'Hmm...'] },
            { name: 'crying', weight: 20, messages: ['*sniff*', 'Waah!', 'So sad...', '*sob*'] },
            { name: 'confused', weight: 25, messages: ['Huh?', 'What?', '???', 'Umm...'] },
            { name: 'surprised', weight: 20, messages: ['Oh!', 'Whoa!', 'Really?', 'Wait...'] }
        ];

        // Topic-specific particle configurations
        this.topicParticles = {
            'space_astronomy': {
                happy: ['⭐', '✨', '🌟', '💫', '🚀', '🪐'],
                sad: ['💨', '🌑', '☄️'],
                colors: ['#FFD700', '#87CEEB', '#FFFFFF', '#9C27B0']
            },
            'environment': {
                happy: ['🍃', '🦋', '🌸', '🌺', '🌻', '🌈'],
                sad: ['💧', '🌧️', '🍂'],
                colors: ['#81C784', '#4CAF50', '#E91E63', '#8BC34A']
            },
            'animals': {
                happy: ['🐾', '🦁', '🐘', '🦅', '🦋', '🐬'],
                sad: ['💨', '🐢', '😿'],
                colors: ['#FF9800', '#8D6E63', '#FFC107', '#795548']
            },
            'technology': {
                happy: ['1', '0', '💻', '⚡', '🤖', '💾'],
                sad: ['💥', '📴', '❌'],
                colors: ['#00BCD4', '#4CAF50', '#2196F3', '#9C27B0']
            },
            'indian_history': {
                happy: ['🇮🇳', '🦚', '🎆', '✨', '🏛️', '⚔️'],
                sad: ['📜', '🕊️', '💨'],
                colors: ['#FF9933', '#FFFFFF', '#138808', '#000080']
            },
            'tamil_history': {
                happy: ['🌺', '🔔', '💃', '🎭', '🛕', '🪷'],
                sad: ['🪷', '💨', '🕯️'],
                colors: ['#E91E63', '#9C27B0', '#FFD700', '#FF5722']
            },
            'world_history': {
                happy: ['🌍', '🧭', '⚓', '🏴', '🗺️', '🏰'],
                sad: ['❓', '🌫️', '📜'],
                colors: ['#2196F3', '#FFECB3', '#5D4037', '#607D8B']
            },
            'science_nature': {
                happy: ['⚗️', '🧬', '✨', '💡', '🔬', '🧪'],
                sad: ['💨', '🧪', '💔'],
                colors: ['#9C27B0', '#4CAF50', '#2196F3', '#FF5722']
            },
            'geography': {
                happy: ['🏔️', '🗺️', '🚩', '🌊', '🌋', '🏝️'],
                sad: ['💫', '🌀', '🌧️'],
                colors: ['#5D4037', '#2196F3', '#4CAF50', '#FF9800']
            },
            'sports': {
                happy: ['🏆', '⚽', '🏏', '🎾', '🥇', '🎯'],
                sad: ['😓', '📉', '🥈'],
                colors: ['#FFD700', '#F44336', '#4CAF50', '#2196F3']
            },
            'mathematics': {
                happy: ['✓', '+', '=', '∞', '🔢', '📊'],
                sad: ['✗', '−', '❌'],
                colors: ['#4CAF50', '#9C27B0', '#FFEB3B', '#2196F3']
            },
            'indian_culture': {
                happy: ['🪔', '✨', '🌸', '🎆', '💃', '🎶'],
                sad: ['💨', '🕯️', '🌙'],
                colors: ['#FF5722', '#E91E63', '#FFEB3B', '#FF9800']
            },
            'famous_people': {
                happy: ['⭐', '📸', '🎬', '🏅', '👑', '🌟'],
                sad: ['💨', '🎭', '📷'],
                colors: ['#FFD700', '#FFFFFF', '#F44336', '#9C27B0']
            },
            'current_affairs': {
                happy: ['📰', '✓', '📡', '🌐', '📺', '💯'],
                sad: ['📴', '❌', '📉'],
                colors: ['#C62828', '#FFFFFF', '#3F51B5', '#4CAF50']
            },
            'mythology': {
                happy: ['✨', '🏹', '🌟', '🪷', '⚡', '🐒'],
                sad: ['⚡', '🌧️', '🌙'],
                colors: ['#FFD700', '#E91E63', '#FF9800', '#9C27B0']
            },
            'literature': {
                happy: ['📚', '✍️', '📖', '🎭', '🖋️', '📝'],
                sad: ['📄', '💨', '📕'],
                colors: ['#673AB7', '#FFFFFF', '#FFD700', '#795548']
            },
            'music_arts': {
                happy: ['♪', '♫', '🎨', '🎵', '🎸', '🎹'],
                sad: ['♭', '💔', '🎼'],
                colors: ['#FFEB3B', '#E91E63', '#9C27B0', '#2196F3']
            },
            'food_nutrition': {
                happy: ['🍎', '🥕', '🍇', '😋', '🥗', '🍰'],
                sad: ['💨', '🔥', '😖'],
                colors: ['#F44336', '#4CAF50', '#FF9800', '#8BC34A']
            },
            'inventions': {
                happy: ['💡', '⚙️', '✨', '🔧', '🚀', '⚡'],
                sad: ['💥', '🔩', '💨'],
                colors: ['#FFEB3B', '#78909C', '#FF9800', '#607D8B']
            },
            'monuments': {
                happy: ['🏛️', '🏰', '🚩', '📸', '🗽', '🗿'],
                sad: ['💨', '🪨', '🌫️'],
                colors: ['#8D6E63', '#FFD700', '#78909C', '#BCAAA4']
            }
        };

        // Comic effect messages by emotion type
        this.happyEffects = ['POW!', 'BOOM!', 'WOW!', 'YAY!', 'SUPER!', 'EPIC!'];
        this.sadEffects = ['OOPS!', 'UH OH!', 'NOPE!', 'AWW!', 'MISS!'];

        // Initialize if elements exist
        if (this.wormElement) {
            this.init();
        }
    }

    init() {
        // Set initial idle state
        this.wormElement.classList.add('idle');

        // Create speech bubble element
        this.createSpeechBubble();

        // Get all mascot elements
        this.mascotElements = {
            worm: document.getElementById('worm-character'),
            bunny: document.getElementById('bunny-character'),
            owl: document.getElementById('owl-character'),
            cat: document.getElementById('cat-character'),
            robot: document.getElementById('robot-character')
        };

        // Randomly select initial mascot (50% chance for non-worm mascot)
        if (Math.random() < 0.5) {
            const randomMascot = this.getRandomMascot();
            this.switchMascot(randomMascot);
        } else {
            // Initialize worm as default active mascot
            this.currentMascot = 'worm';
            this.activeMascotElement = this.wormElement;
        }

        console.log('MascotController initialized with enhanced emotions and mascot variety!');
    }

    /**
     * Create the speech bubble element
     */
    createSpeechBubble() {
        this.speechBubble = document.createElement('div');
        this.speechBubble.className = 'speech-bubble';
        this.speechBubble.id = 'mascot-speech-bubble';

        const animationLayer = document.getElementById('worm-animation-layer');
        if (animationLayer) {
            animationLayer.appendChild(this.speechBubble);
        }
    }

    /**
     * Get a random mascot
     */
    getRandomMascot() {
        return this.mascots[Math.floor(Math.random() * this.mascots.length)];
    }

    /**
     * Switch to a different mascot
     */
    switchMascot(mascotName) {
        if (!this.mascots.includes(mascotName)) return;

        // Hide all mascots
        Object.keys(this.mascotElements).forEach(key => {
            const el = this.mascotElements[key];
            if (el) {
                // Remove all state classes
                el.classList.remove('idle', 'happy', 'excited', 'sad', 'crying', 'active');

                // Hide worm with display, others use CSS .active class
                if (key === 'worm') {
                    el.style.display = 'none';
                }
            }
        });

        // Show the selected mascot
        const selectedMascot = this.mascotElements[mascotName];
        if (selectedMascot) {
            if (mascotName === 'worm') {
                // Worm doesn't have .mascot class, use display
                selectedMascot.style.display = 'block';
            } else {
                // Other mascots use .active class (CSS opacity/transform)
                selectedMascot.classList.add('active');
            }
            selectedMascot.classList.add('idle');
        }

        // Update current mascot reference
        this.currentMascot = mascotName;
        this.activeMascotElement = selectedMascot;

        console.log(`Switched to mascot: ${mascotName}`);
    }

    /**
     * Get the currently active mascot element
     */
    getActiveMascotElement() {
        return this.activeMascotElement || this.wormElement;
    }

    /**
     * Get a weighted random emotion from the list
     */
    getRandomEmotion(emotionList) {
        const totalWeight = emotionList.reduce((sum, e) => sum + e.weight, 0);
        let random = Math.random() * totalWeight;

        for (const emotion of emotionList) {
            random -= emotion.weight;
            if (random <= 0) {
                return emotion;
            }
        }
        return emotionList[0];
    }

    /**
     * React to a correct answer with random happy animation
     * @param {string} topic - The current topic slug
     */
    reactHappy(topic) {
        const mascot = this.getActiveMascotElement();
        if (!mascot) return;

        // Clear any existing reaction
        this.clearReaction();

        // Occasionally switch mascot on correct answer (10% chance)
        if (Math.random() < 0.1) {
            this.switchMascot(this.getRandomMascot());
        }

        // Get random happy emotion
        const emotion = this.getRandomEmotion(this.happyEmotions);

        // Remove all state classes from current mascot
        const allClasses = ['idle', 'sad', 'crying', 'confused', 'surprised', 'sleepy', 'happy', 'excited', 'giggling', 'proud', 'dancing'];
        allClasses.forEach(cls => mascot.classList.remove(cls));
        mascot.classList.add(emotion.name);
        this.currentState = emotion.name;

        // Show speech bubble with random message
        const message = emotion.messages[Math.floor(Math.random() * emotion.messages.length)];
        this.showSpeechBubble(message);

        // Spawn happy particles
        this.spawnParticles('happy', topic || this.currentTopic);

        // Spawn floating sparkles for extra effect
        this.spawnSparkles(5);

        // Show action word for extra pizzazz (30% chance)
        if (Math.random() < 0.3) {
            this.showActionWord(this.happyEffects[Math.floor(Math.random() * this.happyEffects.length)]);
        }

        // Spawn emoji burst
        this.spawnEmojiBurst(topic || this.currentTopic, 'happy');

        // Return to idle after animation
        this.reactionTimeout = setTimeout(() => {
            this.returnToIdle();
            this.hideSpeechBubble();
        }, 2000);
    }

    /**
     * React to an incorrect answer with random sad animation
     * @param {string} topic - The current topic slug
     */
    reactSad(topic) {
        const mascot = this.getActiveMascotElement();
        if (!mascot) return;

        // Clear any existing reaction
        this.clearReaction();

        // Get random sad emotion
        const emotion = this.getRandomEmotion(this.sadEmotions);

        // Remove all state classes from current mascot
        const allClasses = ['idle', 'sad', 'crying', 'confused', 'surprised', 'sleepy', 'happy', 'excited', 'giggling', 'proud', 'dancing'];
        allClasses.forEach(cls => mascot.classList.remove(cls));
        mascot.classList.add(emotion.name);
        this.currentState = emotion.name;

        // Show tears for crying emotion (worm specific)
        if ((emotion.name === 'crying' || emotion.name === 'sad') && this.currentMascot === 'worm') {
            const tears = mascot.querySelectorAll('.worm-tear');
            tears.forEach(tear => {
                tear.style.opacity = '1';
            });
        }

        // Show speech bubble with random message
        const message = emotion.messages[Math.floor(Math.random() * emotion.messages.length)];
        this.showSpeechBubble(message);

        // Spawn sad particles
        this.spawnParticles('sad', topic || this.currentTopic);

        // Show sweat drop effect for confused
        if (emotion.name === 'confused') {
            this.spawnSweatDrop();
        }

        // Show action word (20% chance)
        if (Math.random() < 0.2) {
            this.showActionWord(this.sadEffects[Math.floor(Math.random() * this.sadEffects.length)]);
        }

        // Return to idle after animation
        this.reactionTimeout = setTimeout(() => {
            this.returnToIdle();
            this.hideSpeechBubble();
        }, 2000);
    }

    /**
     * Show speech bubble with message
     */
    showSpeechBubble(message) {
        if (!this.speechBubble) return;

        this.speechBubble.textContent = message;
        this.speechBubble.classList.add('show');
    }

    /**
     * Hide speech bubble
     */
    hideSpeechBubble() {
        if (!this.speechBubble) return;
        this.speechBubble.classList.remove('show');
    }

    /**
     * Show action word (POW, BOOM, etc.)
     */
    showActionWord(word) {
        const actionWord = document.createElement('div');
        actionWord.className = 'action-word';
        actionWord.textContent = word;

        // Position near the active mascot
        const mascot = this.getActiveMascotElement();
        const mascotRect = mascot ? mascot.getBoundingClientRect() : { right: window.innerWidth - 100, top: 200 };
        actionWord.style.position = 'fixed';
        actionWord.style.right = `${window.innerWidth - mascotRect.right + 50}px`;
        actionWord.style.top = `${mascotRect.top - 50}px`;

        document.body.appendChild(actionWord);

        // Trigger animation
        requestAnimationFrame(() => {
            actionWord.classList.add('show');
        });

        // Remove after animation
        setTimeout(() => {
            actionWord.remove();
        }, 1500);
    }

    /**
     * Spawn floating sparkles
     */
    spawnSparkles(count) {
        const mascot = this.getActiveMascotElement();
        if (!mascot) return;

        const mascotRect = mascot.getBoundingClientRect();

        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'floating-sparkle';

            const offsetX = (Math.random() - 0.5) * 150;
            const offsetY = (Math.random() - 0.5) * 100;

            sparkle.style.position = 'fixed';
            sparkle.style.left = `${mascotRect.right - 80 + offsetX}px`;
            sparkle.style.top = `${mascotRect.top + 50 + offsetY}px`;
            sparkle.style.animationDelay = `${Math.random() * 0.5}s`;

            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 2000);
        }
    }

    /**
     * Spawn sweat drop effect
     */
    spawnSweatDrop() {
        const mascot = this.getActiveMascotElement();
        if (!mascot) return;

        const mascotRect = mascot.getBoundingClientRect();
        const sweatDrop = document.createElement('div');
        sweatDrop.className = 'sweat-drop';

        sweatDrop.style.position = 'fixed';
        sweatDrop.style.left = `${mascotRect.right - 30}px`;
        sweatDrop.style.top = `${mascotRect.top + 10}px`;

        document.body.appendChild(sweatDrop);

        requestAnimationFrame(() => {
            sweatDrop.classList.add('show');
        });

        setTimeout(() => sweatDrop.remove(), 1500);
    }

    /**
     * Spawn emoji burst effect
     */
    spawnEmojiBurst(topic, type) {
        const mascot = this.getActiveMascotElement();
        if (!mascot || !this.particlesContainer) return;

        const config = this.topicParticles[topic] || this.topicParticles['indian_history'];
        const emojis = type === 'happy' ? config.happy : config.sad;
        const mascotRect = mascot.getBoundingClientRect();

        for (let i = 0; i < 3; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-burst';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const offsetX = (Math.random() - 0.5) * 100;
            emoji.style.position = 'fixed';
            emoji.style.left = `${mascotRect.right - 80 + offsetX}px`;
            emoji.style.top = `${mascotRect.top + 20}px`;
            emoji.style.animationDelay = `${i * 0.15}s`;

            document.body.appendChild(emoji);

            requestAnimationFrame(() => {
                emoji.classList.add('show');
            });

            setTimeout(() => emoji.remove(), 1500);
        }
    }

    /**
     * Clear current reaction state
     */
    clearReaction() {
        if (this.reactionTimeout) {
            clearTimeout(this.reactionTimeout);
            this.reactionTimeout = null;
        }
    }

    /**
     * Return mascot to idle state
     */
    returnToIdle() {
        const mascot = this.getActiveMascotElement();
        if (!mascot) return;

        // Remove all emotion classes
        const emotionClasses = [
            'happy', 'excited', 'giggling', 'proud', 'dancing',
            'sad', 'crying', 'confused', 'surprised', 'sleepy'
        ];
        emotionClasses.forEach(cls => mascot.classList.remove(cls));

        mascot.classList.add('idle');
        this.currentState = 'idle';

        // Hide tears if worm
        if (this.currentMascot === 'worm') {
            const tears = mascot.querySelectorAll('.worm-tear');
            tears.forEach(tear => {
                tear.style.opacity = '0';
            });
        }
    }

    /**
     * Update the scene background for a new topic
     * @param {string} topicSlug - The topic slug to switch to
     */
    updateScene(topicSlug) {
        if (!topicSlug) return;

        this.currentTopic = topicSlug;

        // Update body class for theme styling
        // Remove old theme classes
        document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();
        document.body.classList.add(`theme-${topicSlug}`);

        // Also update the worm animation layer if it exists
        const animationLayer = document.getElementById('worm-animation-layer');
        if (animationLayer) {
            animationLayer.className = animationLayer.className.replace(/theme-\S+/g, '').trim();
            animationLayer.classList.add('worm-animation-layer', `theme-${topicSlug}`);
        }

        // 30% chance to switch mascot on topic change for variety
        if (Math.random() < 0.3) {
            const randomMascot = this.getRandomMascot();
            if (randomMascot !== this.currentMascot) {
                this.switchMascot(randomMascot);
            }
        }

        console.log(`Scene updated to: ${topicSlug}`);
    }

    /**
     * Spawn particles based on reaction type and topic
     * @param {string} type - 'happy' or 'sad'
     * @param {string} topic - Current topic slug
     */
    spawnParticles(type, topic) {
        if (!this.particlesContainer) return;

        const config = this.topicParticles[topic] || this.topicParticles['indian_history'];
        const symbols = type === 'happy' ? config.happy : config.sad;
        const colors = config.colors;
        const count = type === 'happy' ? 10 : 6;

        // Get mascot position for particle origin
        const mascot = this.getActiveMascotElement();
        const mascotRect = mascot ? mascot.getBoundingClientRect() : { right: window.innerWidth - 100, bottom: window.innerHeight - 150 };

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}-particle`;

            // Random symbol from topic config
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            particle.textContent = symbol;

            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.color = color;

            // Position near the mascot with more spread
            const offsetX = (Math.random() - 0.5) * 150;
            const offsetY = (Math.random() - 0.5) * 80;
            particle.style.left = `${mascotRect.right - 80 + offsetX}px`;
            particle.style.top = `${mascotRect.bottom - 80 + offsetY}px`;

            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 0.4}s`;

            // Style
            particle.style.position = 'fixed';
            particle.style.fontSize = `${20 + Math.random() * 16}px`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1001';
            particle.style.textShadow = `0 0 12px ${color}`;

            // Add appropriate animation
            if (type === 'happy') {
                particle.style.animation = `particle-float-up ${1.2 + Math.random() * 0.6}s ease-out forwards`;
            } else {
                particle.style.animation = `particle-float-down ${1 + Math.random() * 0.5}s ease-in forwards`;
            }

            this.particlesContainer.appendChild(particle);

            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 2500);
        }
    }

    /**
     * Set visibility of the worm character
     * @param {boolean} visible
     */
    setVisible(visible) {
        if (this.wormElement) {
            this.wormElement.style.display = visible ? 'block' : 'none';
        }

        const layer = document.getElementById('worm-animation-layer');
        if (layer) {
            layer.style.display = visible ? 'block' : 'none';
        }
    }

    /**
     * Get the current state
     * @returns {string}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Get the current topic
     * @returns {string}
     */
    getTopic() {
        return this.currentTopic;
    }

    /**
     * Get current mascot name
     * @returns {string}
     */
    getMascot() {
        return this.currentMascot;
    }
}

// Create global instance when DOM is ready
// Keep backward compatibility with old name
let wormCharacter = null;
let mascotController = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mascot controller if the element exists
    if (document.getElementById('worm-character')) {
        mascotController = new MascotController();
        wormCharacter = mascotController; // Backward compatibility
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MascotController;
}
