/**
 * MascotController - Animated Quiz Mascot System
 * Manages multiple cute cartoon mascots that react to quiz answers
 * with topic-specific animations and random emotion varieties
 *
 * Available Mascots:
 * - Worm (Wormy the Bookworm) - A nerdy, glasses-wearing bookworm
 * - Bunny (Hoppy) - An energetic fluffy bunny with expressive ears
 * - Owl (Professor Hoot) - A wise owl who does 360 head spins
 * - Cat (Whiskers) - A playful orange tabby with dramatic tail swishes
 * - Robot (Byte) - A friendly tech bot with LED expressions
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
        this.currentSide = 'right'; // 'left' or 'right'
        this.isHidden = false; // Track if mascot is hiding
        this.consecutiveWrong = 0; // Track consecutive wrong answers
        this.reactionTimeout = null;
        this.hideTimeout = null;

        // Available mascots
        this.mascots = ['worm', 'bunny', 'owl', 'cat', 'robot'];

        // Map inconsistent DB topic names to valid CSS theme names
        this.topicMapping = {
            // Space variants
            'space': 'space_astronomy',
            'space_earth': 'space_astronomy',
            'space_india': 'space_astronomy',
            'space_physics': 'space_astronomy',
            // Science variants
            'human_body': 'science_nature',
            'human body': 'science_nature',
            'human_organs': 'science_nature',
            'biology': 'science_nature',
            'chemistry': 'science_nature',
            'physics': 'science_nature',
            'photosynthesis': 'science_nature',
            'science_general': 'science_nature',
            'science_history': 'science_nature',
            'science_india': 'science_nature',
            // Nature/Environment variants
            'nature': 'environment',
            'nature in India': 'environment',
            'plants': 'environment',
            'plants_india': 'environment',
            'plants_animals': 'animals',
            'earth_science': 'geography',
            'earth_science_india': 'geography',
            'electricity_magnets': 'technology',
            // Animals variants
            'animals_india': 'animals',
            // Sports variants
            'cricket': 'sports',
            'football': 'sports',
            'kabaddi': 'sports',
            'olympics': 'sports',
            'paralympics': 'sports',
            'sports events': 'sports',
            'sports general': 'sports',
            'hockey': 'sports',
            'badminton': 'sports',
            'tennis': 'sports',
            'swimming': 'sports',
            'athletics': 'sports',
            'archery': 'sports',
            'boxing': 'sports',
            'chess': 'sports',
            'volleyball': 'sports',
            'wrestling': 'sports',
            'shooting': 'sports',
            'snooker': 'sports',
            'motorsport': 'sports',
            'martial arts': 'sports',
            'winter sports': 'sports',
            // Technology variants
            'computers': 'technology',
            'internet': 'technology',
            'gadgets': 'technology',
            // Monuments variants
            'monuments_wonders': 'monuments',
            'monuments-wonders': 'monuments'
        };

        // Mascot personalities - affects which emotions they use more
        this.mascotPersonalities = {
            worm: {
                name: 'Wormy',
                favoriteHappy: ['happy', 'excited', 'eureka'],
                favoriteSad: ['sad', 'confused'],
                phrases: {
                    happy: [
                        'I KNEW IT!', 'Book smart!', 'Brilliant!', 'A+ work!',
                        'You\'re on FIRE! 🔥', 'Big brain energy!', 'Bookworm approved!',
                        'That\'s what I call WORM-derful!', 'You\'re a BOOK-oss!',
                        'Smarty pants alert!', 'Reading pays off!', 'Knowledge KING!',
                        'Einstein who?!', 'Your brain is GLOWING!', 'Nailed it like a bookworm!'
                    ],
                    sad: [
                        'Hmm, let me check my books...', 'Back to the library!', 'Study time!',
                        'Even I got that wrong once!', 'Oopsie bookworm!', 'My glasses are foggy!',
                        'Did someone eat my homework?', 'Plot twist!', 'That was a tricky one!',
                        'Let\'s wiggle past this!', 'Mistakes make us smarter!'
                    ]
                }
            },
            bunny: {
                name: 'Hoppy',
                favoriteHappy: ['happy', 'excited', 'giggling'],
                favoriteSad: ['sad', 'crying'],
                phrases: {
                    happy: [
                        'YIPPEE!', 'Hop hop HOORAY!', 'Carrots for everyone!', 'SO HAPPY!',
                        'BUNNY JUMP OF JOY!', 'You\'re HARE-mazing!', 'That was EGG-cellent!',
                        'Hippity hoppity, you got it!', 'Bouncing with happiness!',
                        'You deserve a MILLION carrots!', 'Ears up for YOU!',
                        'That answer was FLUFFY good!', 'Thumper would be proud!',
                        'You\'re SOMEBUNNY special!', 'Lettuce celebrate!'
                    ],
                    sad: [
                        '*sniff sniff*', 'My ears are droopy...', 'Aww carrots!',
                        'Need a carrot hug...', 'My fluff is sad now!', 'Bunny tears!',
                        'Even bunnies make mistakes!', 'Hop over this one!',
                        'Don\'t worry, be HOPPY!', 'Next one will be HARE-fect!',
                        'My whiskers are wiggling sadly...'
                    ]
                }
            },
            owl: {
                name: 'Professor Hoot',
                favoriteHappy: ['happy', 'wise', 'excited'],
                favoriteSad: ['sad', 'surprised', 'thinking'],
                phrases: {
                    happy: [
                        'WHOOO knew!', 'Wise choice!', 'HOOT HOOT!', 'Most impressive!',
                        'You\'re a HOOT-iful genius!', 'Owl be darned, you got it!',
                        'That was OWL-standing!', 'Flying high on knowledge!',
                        'Feathers ruffled with PRIDE!', 'Wisdom level: MAXIMUM!',
                        'You\'re a wise old soul!', 'Night owl approved!',
                        'Owl give you an A+!', 'Twit-twoo BRILLIANT!', 'Owl-ways knew you could do it!'
                    ],
                    sad: [
                        'Hoo could it be?', 'Need more wisdom...', 'Hmm, puzzling...',
                        'Owl think about this...', 'That was a real HEAD-SCRATCHER!',
                        'Even owls miss sometimes!', 'Hoot and learn!',
                        'Don\'t be OWL-ver it!', 'My feathers are ruffled...',
                        'Let me consult my owl books!', 'Twit-twoo... not this time!'
                    ]
                }
            },
            cat: {
                name: 'Whiskers',
                favoriteHappy: ['happy', 'excited', 'mischievous'],
                favoriteSad: ['sad', 'surprised', 'confused'],
                phrases: {
                    happy: [
                        'PURRFECT!', 'Meow-velous!', '*happy purrs*', 'Feline FINE!',
                        'You\'re the cat\'s MEOW!', 'Claw-some answer!',
                        'That was PAWS-itively amazing!', 'I\'m FELINE good about this!',
                        'You\'ve got to be KITTEN me! So smart!', 'Whiskers approved!',
                        'Cat-acular!', 'You\'re PURR-fectly brilliant!',
                        'Meow meow GENIUS!', 'That deserves EXTRA treats!',
                        'You just landed on all FOUR paws!'
                    ],
                    sad: [
                        'Hisss...', 'Not my day...', '*sad meow*', 'Cat-astrophe!',
                        'Need a catnap...', 'My whiskers are drooping!',
                        'Even cats have 9 lives to learn!', 'Fur real though, nice try!',
                        'Time to PAW-se and think!', 'Meow... that was tricky!',
                        'Don\'t be a scaredy cat, try again!'
                    ]
                }
            },
            robot: {
                name: 'Byte',
                favoriteHappy: ['happy', 'excited', 'computing'],
                favoriteSad: ['sad', 'surprised', 'thinking'],
                phrases: {
                    happy: [
                        'BEEP BOOP!', 'Success.exe!', '100% CORRECT!', 'Processing... JOY!',
                        'WINNER.exe ACTIVATED!', 'You are 100% AWESOME!',
                        'Brain.cpu is OVERCLOCKED!', 'Achievement UNLOCKED!',
                        'Initiating HAPPY dance!', 'You\'re a SUPER computer!',
                        'System status: AMAZING!', 'HIGH FIVE PROTOCOL!',
                        'You cracked the CODE!', 'GENIUS MODE: ON!',
                        'Downloading celebration.gif!'
                    ],
                    sad: [
                        'Error 404...', 'Recalculating...', 'System sad...', 'Bzzt...',
                        'Loading retry.exe!', 'Oops! Reboot required!',
                        'Even robots make mistakes!', 'Does not compute... but it\'s okay!',
                        'Brain.exe needs update!', 'Buffering happiness...',
                        'Try again! BEEP BOOP!'
                    ]
                }
            }
        };

        // Happy emotion varieties with weights (higher = more likely)
        this.happyEmotions = [
            { name: 'happy', weight: 30, messages: ['YAY!', 'WOOHOO!', 'AWESOME!', 'GREAT!', 'LEGENDARY!', 'EPIC WIN!'] },
            { name: 'excited', weight: 25, messages: ['WOW!', 'AMAZING!', 'PERFECT!', 'YES YES YES!', 'INCREDIBLE!', 'BOOM!'] },
            { name: 'giggling', weight: 15, messages: ['Hehe!', 'Teehee!', '*giggle*', 'Haha!', 'LOL!', 'Heehee!'] },
            { name: 'proud', weight: 15, messages: ['GENIUS!', 'So smart!', 'Brilliant!', 'Nailed it!', 'BIG BRAIN!', 'SMARTY!'] },
            { name: 'dancing', weight: 15, messages: ['*dance dance*', 'PARTY TIME!', 'Wooo!', 'Yeah!', 'Let\'s GOOO!', 'CELEBRATE!'] }
        ];

        // Sad emotion varieties with weights
        this.sadEmotions = [
            { name: 'sad', weight: 35, messages: ['Oopsie!', 'Aww...', 'Oh noes!', 'Hmm...', 'Uh oh!', 'Whoopsie!'] },
            { name: 'crying', weight: 20, messages: ['*sniff*', 'Waah!', 'So close!', '*sob*', 'Boo hoo!', 'My heart!'] },
            { name: 'confused', weight: 25, messages: ['Huh?!', 'Whaaat?', '???', 'Umm...', 'Brain freeze!', 'Say what?!'] },
            { name: 'surprised', weight: 20, messages: ['Oh!', 'Whoa!', 'Really?!', 'Wait what!', 'Mind blown!', 'No way!'] }
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
        this.happyEffects = ['POW!', 'BOOM!', 'WOW!', 'YAY!', 'SUPER!', 'EPIC!', '10/10!', 'ACE!', 'KABOOM!', 'ZING!', 'WHAM!', 'KA-POW!', 'BAZINGA!', 'KAPOW!', 'BINGO!'];
        this.sadEffects = ['OOPS!', 'UH OH!', 'NOPE!', 'AWW!', 'MISS!', 'BONK!', 'OOF!', 'WHOMP!', 'YIKES!', 'SPLAT!', 'BOING!', 'ZONK!', 'OUCH!', 'DERP!'];

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

        // Randomly select initial mascot (60% chance for non-worm mascot)
        if (Math.random() < 0.6) {
            const randomMascot = this.getRandomMascot();
            this.switchMascot(randomMascot);
        } else {
            // Initialize worm as default active mascot
            this.currentMascot = 'worm';
            this.activeMascotElement = this.wormElement;
        }

        // Randomly choose initial side (50% chance each)
        const initialSide = Math.random() < 0.5 ? 'left' : 'right';
        this.setSide(initialSide);

        console.log(`MascotController initialized! Current mascot: ${this.mascotPersonalities[this.currentMascot].name} on ${this.currentSide} side`);
    }

    /**
     * Set which side of the screen the mascot appears on
     * @param {string} side - 'left' or 'right'
     */
    setSide(side) {
        if (side !== 'left' && side !== 'right') return;

        this.currentSide = side;

        // Update worm element
        if (this.wormElement) {
            this.wormElement.classList.remove('side-left', 'side-right');
            if (side === 'left') {
                this.wormElement.classList.add('side-left');
            }
        }

        // Update mascot container
        if (this.mascotContainer) {
            this.mascotContainer.classList.remove('side-left', 'side-right');
            if (side === 'left') {
                this.mascotContainer.classList.add('side-left');
            }
        }

        // Update speech bubble position
        if (this.speechBubble) {
            this.speechBubble.classList.remove('side-left', 'side-right');
            if (side === 'left') {
                this.speechBubble.classList.add('side-left');
            }
        }

        console.log(`Mascot moved to ${side} side`);
    }

    /**
     * Hide the mascot (slides off screen)
     */
    hideMascot() {
        if (this.isHidden) return;

        const mascot = this.getActiveMascotElement();
        if (!mascot) return;

        // Clear any existing hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Add hiding animation class
        if (this.currentMascot === 'worm') {
            this.wormElement.classList.remove('showing', 'hidden');
            this.wormElement.classList.add('hiding');
        } else {
            this.mascotContainer.classList.remove('showing', 'hidden');
            this.mascotContainer.classList.add('hiding');
        }

        // After animation, set hidden state
        this.hideTimeout = setTimeout(() => {
            if (this.currentMascot === 'worm') {
                this.wormElement.classList.remove('hiding');
                this.wormElement.classList.add('hidden');
            } else {
                this.mascotContainer.classList.remove('hiding');
                this.mascotContainer.classList.add('hidden');
            }
            this.isHidden = true;
        }, 600);

        console.log(`${this.mascotPersonalities[this.currentMascot].name} is hiding!`);
    }

    /**
     * Show the mascot (slides back on screen)
     */
    showMascot() {
        if (!this.isHidden) return;

        // Clear any existing hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Add showing animation class
        if (this.currentMascot === 'worm') {
            this.wormElement.classList.remove('hiding', 'hidden');
            this.wormElement.classList.add('showing');
        } else {
            this.mascotContainer.classList.remove('hiding', 'hidden');
            this.mascotContainer.classList.add('showing');
        }

        // After animation, remove showing class
        this.hideTimeout = setTimeout(() => {
            if (this.currentMascot === 'worm') {
                this.wormElement.classList.remove('showing');
            } else {
                this.mascotContainer.classList.remove('showing');
            }
            this.isHidden = false;
        }, 800);

        console.log(`${this.mascotPersonalities[this.currentMascot].name} is back!`);
    }

    /**
     * Randomly switch to the other side
     */
    switchSide() {
        const newSide = this.currentSide === 'left' ? 'right' : 'left';
        this.setSide(newSide);
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
     * Switch to a different mascot with a fun transition
     */
    switchMascot(mascotName) {
        if (!this.mascots.includes(mascotName)) return;

        // Hide all mascots
        Object.keys(this.mascotElements).forEach(key => {
            const el = this.mascotElements[key];
            if (el) {
                // Remove all state classes
                el.classList.remove('idle', 'happy', 'excited', 'sad', 'crying', 'active',
                    'giggling', 'surprised', 'confused', 'thinking', 'mischievous', 'wise',
                    'computing', 'eureka', 'reading');

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

        const personality = this.mascotPersonalities[mascotName];
        console.log(`Switched to mascot: ${personality.name}!`);
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
     * Get mascot-specific phrase
     */
    getMascotPhrase(type) {
        const personality = this.mascotPersonalities[this.currentMascot];
        const phrases = type === 'happy' ? personality.phrases.happy : personality.phrases.sad;
        return phrases[Math.floor(Math.random() * phrases.length)];
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

        // Reset consecutive wrong counter
        this.consecutiveWrong = 0;

        // Show mascot if it was hiding
        if (this.isHidden) {
            // Maybe switch sides when coming back (30% chance)
            if (Math.random() < 0.3) {
                this.switchSide();
            }
            this.showMascot();
        }

        // Occasionally switch mascot on correct answer (15% chance)
        if (Math.random() < 0.15) {
            this.switchMascot(this.getRandomMascot());
        }

        // Get random happy emotion
        const emotion = this.getRandomEmotion(this.happyEmotions);

        // Remove all state classes from current mascot
        const allClasses = ['idle', 'sad', 'crying', 'confused', 'surprised', 'sleepy', 'happy',
            'excited', 'giggling', 'proud', 'dancing', 'thinking', 'mischievous', 'wise',
            'computing', 'eureka', 'reading'];
        allClasses.forEach(cls => mascot.classList.remove(cls));
        mascot.classList.add(emotion.name);
        this.currentState = emotion.name;

        // Show speech bubble with mascot-specific message (50% chance for personality message)
        let message;
        if (Math.random() < 0.5) {
            message = this.getMascotPhrase('happy');
        } else {
            message = emotion.messages[Math.floor(Math.random() * emotion.messages.length)];
        }
        this.showSpeechBubble(message);

        // Spawn happy particles
        this.spawnParticles('happy', topic || this.currentTopic);

        // Spawn floating sparkles for extra effect
        this.spawnSparkles(6);

        // Show action word for extra pizzazz (35% chance)
        if (Math.random() < 0.35) {
            this.showActionWord(this.happyEffects[Math.floor(Math.random() * this.happyEffects.length)]);
        }

        // Spawn emoji burst
        this.spawnEmojiBurst(topic || this.currentTopic, 'happy');

        // Return to idle after animation
        this.reactionTimeout = setTimeout(() => {
            this.returnToIdle();
            this.hideSpeechBubble();
        }, 2200);
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

        // Increment consecutive wrong counter
        this.consecutiveWrong++;

        // Hide mascot after 2 consecutive wrong answers
        if (this.consecutiveWrong >= 2 && !this.isHidden) {
            // Show sad reaction first, then hide
            this.reactionTimeout = setTimeout(() => {
                this.hideMascot();
            }, 1500);
        }

        // Get random sad emotion
        const emotion = this.getRandomEmotion(this.sadEmotions);

        // Remove all state classes from current mascot
        const allClasses = ['idle', 'sad', 'crying', 'confused', 'surprised', 'sleepy', 'happy',
            'excited', 'giggling', 'proud', 'dancing', 'thinking', 'mischievous', 'wise',
            'computing', 'eureka', 'reading'];
        allClasses.forEach(cls => mascot.classList.remove(cls));
        mascot.classList.add(emotion.name);
        this.currentState = emotion.name;

        // Show tears for crying emotion (all mascots have .{mascot}-tear elements)
        if (emotion.name === 'crying' || emotion.name === 'sad') {
            const tearClass = `.${this.currentMascot}-tear`;
            const tears = mascot.querySelectorAll(tearClass);
            tears.forEach(tear => {
                tear.style.opacity = '1';
            });
        }

        // Show speech bubble with mascot-specific message (50% chance for personality message)
        let message;
        if (Math.random() < 0.5) {
            message = this.getMascotPhrase('sad');
        } else {
            message = emotion.messages[Math.floor(Math.random() * emotion.messages.length)];
        }
        this.showSpeechBubble(message);

        // Spawn sad particles
        this.spawnParticles('sad', topic || this.currentTopic);

        // Show sweat drop effect for confused
        if (emotion.name === 'confused') {
            this.spawnSweatDrop();
        }

        // Show action word (25% chance)
        if (Math.random() < 0.25) {
            this.showActionWord(this.sadEffects[Math.floor(Math.random() * this.sadEffects.length)]);
        }

        // Return to idle after animation
        this.reactionTimeout = setTimeout(() => {
            this.returnToIdle();
            this.hideSpeechBubble();
        }, 2200);
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

        // Position near the active mascot based on current side
        const mascot = this.getActiveMascotElement();
        const mascotRect = mascot ? mascot.getBoundingClientRect() : { right: window.innerWidth - 100, left: 100, top: 200 };
        actionWord.style.position = 'fixed';
        actionWord.style.top = `${mascotRect.top - 50}px`;

        if (this.currentSide === 'left') {
            actionWord.style.left = `${mascotRect.left + 50}px`;
            actionWord.style.right = 'auto';
        } else {
            actionWord.style.right = `${window.innerWidth - mascotRect.right + 50}px`;
            actionWord.style.left = 'auto';
        }

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
            sparkle.style.top = `${mascotRect.top + 50 + offsetY}px`;
            sparkle.style.animationDelay = `${Math.random() * 0.5}s`;

            // Position based on current side
            if (this.currentSide === 'left') {
                sparkle.style.left = `${mascotRect.left + 80 + offsetX}px`;
            } else {
                sparkle.style.left = `${mascotRect.right - 80 + offsetX}px`;
            }

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
        sweatDrop.style.top = `${mascotRect.top + 10}px`;

        // Position based on current side
        if (this.currentSide === 'left') {
            sweatDrop.style.left = `${mascotRect.left + 30}px`;
        } else {
            sweatDrop.style.left = `${mascotRect.right - 30}px`;
        }

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

        for (let i = 0; i < 4; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-burst';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const offsetX = (Math.random() - 0.5) * 120;
            emoji.style.position = 'fixed';
            emoji.style.top = `${mascotRect.top + 20}px`;
            emoji.style.animationDelay = `${i * 0.12}s`;

            // Position based on current side
            if (this.currentSide === 'left') {
                emoji.style.left = `${mascotRect.left + 80 + offsetX}px`;
            } else {
                emoji.style.left = `${mascotRect.right - 80 + offsetX}px`;
            }

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
            'sad', 'crying', 'confused', 'surprised', 'sleepy',
            'thinking', 'mischievous', 'wise', 'computing', 'eureka', 'reading'
        ];
        emotionClasses.forEach(cls => mascot.classList.remove(cls));

        mascot.classList.add('idle');
        this.currentState = 'idle';

        // Hide tears for all mascots
        const tearClass = `.${this.currentMascot}-tear`;
        const tears = mascot.querySelectorAll(tearClass);
        tears.forEach(tear => {
            tear.style.opacity = '0';
        });
    }

    /**
     * Normalize topic slug: converts hyphens to underscores and maps variant names
     * @param {string} slug - The raw topic slug from DB
     * @returns {string} - Normalized slug matching CSS theme names
     */
    normalizeTopicSlug(slug) {
        // First convert hyphens to underscores
        let normalized = slug.replace(/-/g, '_');
        // Then check if there's a mapping for this topic
        if (this.topicMapping[normalized]) {
            normalized = this.topicMapping[normalized];
        }
        // Also check original slug in case it has spaces
        if (this.topicMapping[slug]) {
            normalized = this.topicMapping[slug];
        }
        return normalized;
    }

    /**
     * Update the scene background for a new topic
     * @param {string} topicSlug - The topic slug to switch to
     */
    updateScene(topicSlug) {
        if (!topicSlug) return;

        // Normalize topic slug using the mapping
        const normalizedSlug = this.normalizeTopicSlug(topicSlug);
        this.currentTopic = normalizedSlug;

        // Update body class for theme styling
        // Remove old theme classes
        document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();
        document.body.classList.add(`theme-${normalizedSlug}`);

        // Also update the worm animation layer if it exists
        const animationLayer = document.getElementById('worm-animation-layer');
        if (animationLayer) {
            animationLayer.className = animationLayer.className.replace(/theme-\S+/g, '').trim();
            animationLayer.classList.add('worm-animation-layer', `theme-${normalizedSlug}`);
        }

        // 35% chance to switch mascot on topic change for variety
        if (Math.random() < 0.35) {
            const randomMascot = this.getRandomMascot();
            if (randomMascot !== this.currentMascot) {
                this.switchMascot(randomMascot);
            }
        }

        console.log(`Scene updated to: ${normalizedSlug}`);
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
        const count = type === 'happy' ? 12 : 6;

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
            particle.style.top = `${mascotRect.bottom - 80 + offsetY}px`;

            // Position based on current side
            if (this.currentSide === 'left') {
                particle.style.left = `${mascotRect.left + 80 + offsetX}px`;
            } else {
                particle.style.left = `${mascotRect.right - 80 + offsetX}px`;
            }

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
     * Set visibility of the mascot layer
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

    /**
     * Get current mascot personality info
     * @returns {object}
     */
    getMascotPersonality() {
        return this.mascotPersonalities[this.currentMascot];
    }

    /**
     * Force switch to a specific mascot
     * @param {string} mascotName
     */
    setMascot(mascotName) {
        if (this.mascots.includes(mascotName)) {
            this.switchMascot(mascotName);
        }
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
