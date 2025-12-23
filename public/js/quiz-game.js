/**
 * Quiz Game Module
 * Core quiz gameplay logic for Fun Quiz
 */

// Map inconsistent DB topic names to valid CSS theme names
const topicMapping = {
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
    // Sports variants (all individual sports -> sports)
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
    'monuments-wonders': 'monuments',
    // Cyber security variants
    'cybersecurity': 'cyber_security',
    'cyber-security': 'cyber_security',
    'online_safety': 'internet_safety',
    'internet_awareness': 'internet_safety',
    'cyber_awareness': 'cyber_crime_awareness',
    'fraud_awareness': 'online_fraud_awareness',
    'police': 'police_awareness',
    'police_safety': 'police_awareness',
    'computer_basics': 'digital_literacy',
    'computer_literacy': 'digital_literacy',
    'networking': 'network_basics',
    'wifi_basics': 'network_basics',
    'digital_citizenship': 'safe_online_culture',
    'online_culture': 'safe_online_culture'
};

// Normalize topic slug: handles hyphens and maps variants to valid themes
function normalizeTopicSlug(slug) {
    // First convert hyphens to underscores
    let normalized = slug.replace(/-/g, '_');
    // Then check if there's a mapping for this topic
    if (topicMapping[normalized]) {
        normalized = topicMapping[normalized];
    }
    // Also check original slug in case it has spaces
    if (topicMapping[slug]) {
        normalized = topicMapping[slug];
    }
    return normalized;
}

// Quiz Game Class
class QuizGame {
    constructor(topicsData, topicCartoons) {
        this.topicsData = topicsData;
        this.topicCartoons = topicCartoons;
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.selectedAnswer = null;
        this.timer = null;
        this.timeLeft = 30;
        this.answeredIds = [];
        this.currentTopic = null;
        this.isGenerating = false;

        this.TIMER_DURATION = 30;
        this.TIMER_CIRCUMFERENCE = 2 * Math.PI * 25; // 157
    }

    async loadQuestions() {
        try {
            const response = await fetch('/api/quiz/questions?count=10&mixed=1');
            const data = await response.json();

            if (!data.success) {
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
                return;
            }

            this.questions = data.questions;

            if (this.questions.length === 0) {
                // No questions available, trigger generation
                this.showGenerationStatus('No questions found. Generating new ones...');
                await this.triggerQuestionGeneration();
                return;
            }

            // Show quiz container
            document.getElementById('loading-container').style.display = 'none';
            document.getElementById('quiz-container').style.display = 'flex';

            this.showQuestion();

            // Start background generation if we have few questions
            if (this.questions.length < 10) {
                this.triggerBackgroundGeneration();
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showGenerationStatus('Loading failed. Retrying...');
            setTimeout(() => this.loadQuestions(), 2000);
        }
    }

    async triggerQuestionGeneration() {
        this.showGenerationStatus('AI is creating questions for you...');
        try {
            const response = await fetch('/api/quiz/generate', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                this.hideGenerationStatus();
                this.loadQuestions();
            }
        } catch (error) {
            console.error('Generation error:', error);
            this.hideGenerationStatus();
        }
    }

    async triggerBackgroundGeneration() {
        if (this.isGenerating) return;
        this.isGenerating = true;
        this.showGenerationStatus('Preparing more questions...');

        try {
            await fetch('/api/quiz/generate?background=1', { method: 'POST' });
        } catch (error) {
            console.error('Background generation error:', error);
        }

        this.isGenerating = false;
        this.hideGenerationStatus();
    }

    showGenerationStatus(text) {
        const status = document.getElementById('generation-status');
        document.getElementById('status-text').textContent = text;
        status.style.display = 'flex';
    }

    hideGenerationStatus() {
        document.getElementById('generation-status').style.display = 'none';
    }

    updateCartoons(topicSlug) {
        const cartoons = this.topicCartoons[topicSlug] || ['❓', '❗', '💭', '✨', '🌟'];
        for (let i = 1; i <= 5; i++) {
            const el = document.getElementById(`cartoon-${i}`);
            if (el) {
                el.textContent = cartoons[i - 1] || cartoons[0];
                el.style.animationDelay = `${Math.random() * 3}s`;
            }
        }
    }

    applyTopicTheme(topicSlug, topicInfo) {
        const normalizedSlug = normalizeTopicSlug(topicSlug);

        const container = document.getElementById('quiz-container');
        const animationLayer = document.getElementById('worm-animation-layer');

        // Remove previous theme classes from all elements
        container.className = container.className.replace(/theme-\S+/g, '');
        container.classList.add(`theme-${normalizedSlug}`);

        // Apply theme to body for CSS scene selectors
        document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();
        document.body.classList.add(`theme-${normalizedSlug}`);

        // Apply theme to animation layer for scene backgrounds
        if (animationLayer) {
            animationLayer.className = animationLayer.className.replace(/theme-\S+/g, '').trim();
            animationLayer.classList.add('worm-animation-layer', `theme-${normalizedSlug}`);
        }

        // Update topic badge
        const displayInfo = topicInfo || this.topicsData[normalizedSlug];
        if (displayInfo) {
            document.getElementById('topic-icon').textContent = displayInfo.icon || '📚';
            document.getElementById('topic-name').textContent = displayInfo.name || normalizedSlug;
        } else {
            document.getElementById('topic-icon').textContent = '📚';
            document.getElementById('topic-name').textContent = topicSlug.replace(/[_-]/g, ' ');
        }

        // Update cartoon elements
        this.updateCartoons(normalizedSlug);

        // Update worm character scene
        if (typeof wormCharacter !== 'undefined' && wormCharacter) {
            wormCharacter.updateScene(normalizedSlug);
        }
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
            return;
        }

        const q = this.questions[this.currentQuestion];

        // Each question can have different topic
        const normalizedTopic = normalizeTopicSlug(q.topic);
        if (q.topic !== this.currentTopic) {
            this.currentTopic = q.topic;
            const topicInfo = this.topicsData[normalizedTopic];
            this.applyTopicTheme(q.topic, topicInfo);
        }

        document.getElementById('question').textContent = q.question;
        document.getElementById('question-num').textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
        document.getElementById('progress').style.width = `${((this.currentQuestion + 1) / this.questions.length) * 100}%`;

        // Show difficulty
        const diffBadge = document.getElementById('difficulty-badge');
        const diffText = diffBadge.querySelector('.difficulty-text');
        if (diffText) {
            diffText.textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
        }
        diffBadge.className = `difficulty-badge ${q.difficulty}`;

        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = option;
            btn.onclick = () => this.selectOption(index);
            optionsContainer.appendChild(btn);
        });

        // Hide explanation
        document.getElementById('explanation-box').classList.remove('show');

        this.selectedAnswer = null;
        document.getElementById('next-btn').disabled = true;
        this.startTimer();
    }

    selectOption(index) {
        if (this.selectedAnswer !== null) return;

        this.selectedAnswer = index;
        const options = document.querySelectorAll('.option');
        const q = this.questions[this.currentQuestion];

        options.forEach((opt, i) => {
            opt.classList.remove('selected');
            if (i === index) {
                opt.classList.add('selected');
            }
        });

        // Check answer after short delay
        setTimeout(() => {
            this.stopTimer();
            options.forEach((opt, i) => {
                if (i === q.correct) {
                    opt.classList.add('correct');
                } else if (i === index && i !== q.correct) {
                    opt.classList.add('incorrect');
                }
                opt.disabled = true;
            });

            if (index === q.correct) {
                this.score++;
                if (typeof showConfetti === 'function') {
                    showConfetti();
                }
                // Worm celebrates!
                if (typeof wormCharacter !== 'undefined' && wormCharacter) {
                    wormCharacter.reactHappy(this.currentTopic);
                }
            } else {
                // Worm is sad
                if (typeof wormCharacter !== 'undefined' && wormCharacter) {
                    wormCharacter.reactSad(this.currentTopic);
                }
            }

            // Track answered question
            this.answeredIds.push(q.id);

            // Show explanation if available
            if (q.explanation) {
                document.getElementById('explanation-text').textContent = q.explanation;
                document.getElementById('explanation-box').classList.add('show');
            }

            document.getElementById('next-btn').disabled = false;
        }, 400);
    }

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    }

    skipQuestion() {
        this.stopTimer();
        const q = this.questions[this.currentQuestion];
        this.answeredIds.push(q.id);
        this.currentQuestion++;
        this.showQuestion();
    }

    startTimer() {
        this.timeLeft = this.TIMER_DURATION;
        this.updateTimerDisplay();

        const timerRing = document.getElementById('timer-ring');
        if (timerRing) {
            timerRing.style.strokeDashoffset = '0';
            timerRing.classList.remove('warning', 'danger');
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) {
                this.stopTimer();
                // Auto-skip on timeout
                if (typeof wormCharacter !== 'undefined' && wormCharacter) {
                    wormCharacter.reactSad(this.currentTopic);
                }
                const q = this.questions[this.currentQuestion];
                this.answeredIds.push(q.id);
                this.currentQuestion++;
                this.showQuestion();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimerDisplay() {
        const timerEl = document.getElementById('timer');
        const timerRing = document.getElementById('timer-ring');

        timerEl.textContent = this.timeLeft;
        timerEl.className = 'timer';

        const progress = 1 - (this.timeLeft / this.TIMER_DURATION);

        if (timerRing) {
            const offset = progress * this.TIMER_CIRCUMFERENCE;
            timerRing.style.strokeDashoffset = offset;
            timerRing.classList.remove('warning', 'danger');
        }

        if (this.timeLeft <= 10) {
            timerEl.classList.add('warning');
            if (timerRing) timerRing.classList.add('warning');
        }
        if (this.timeLeft <= 5) {
            timerEl.classList.add('danger');
            if (timerRing) timerRing.classList.add('danger');
        }
    }

    async finishQuiz() {
        this.stopTimer();
        try {
            const formData = new FormData();
            formData.append('topic', 'mixed');
            formData.append('score', this.score);
            formData.append('total', this.questions.length);
            formData.append('answered_ids', JSON.stringify(this.answeredIds));

            await fetch('/api/quiz/submit', {
                method: 'POST',
                body: formData
            });
            window.location.href = `/results?score=${this.score}&total=${this.questions.length}&topic=mixed`;
        } catch (error) {
            window.location.href = `/results?score=${this.score}&total=${this.questions.length}&topic=mixed`;
        }
    }
}

// Global quiz game instance - will be initialized in the page
let quizGame = null;

// Global functions for onclick handlers
function nextQuestion() {
    if (quizGame) quizGame.nextQuestion();
}

function skipQuestion() {
    if (quizGame) quizGame.skipQuestion();
}
