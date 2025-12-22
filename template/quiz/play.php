<?php
use ZealPHP\App;
use FunQuiz\QuizTopics;

$topics = QuizTopics::getAll();

// Cartoon icons per topic
$topicCartoons = [
    'indian_history' => ['🏛️', '⚔️', '👑', '🇮🇳', '📜'],
    'tamil_history' => ['🏛️', '📿', '🎭', '🛕', '🌺'],
    'world_history' => ['🌍', '⚔️', '🏰', '👑', '📜'],
    'science_nature' => ['🔬', '🧪', '🧬', '🌿', '⚗️'],
    'geography' => ['🗺️', '🏔️', '🌊', '🌋', '🏝️'],
    'space_astronomy' => ['🚀', '🌟', '🪐', '🌙', '☄️'],
    'sports' => ['🏏', '⚽', '🏀', '🎾', '🏆'],
    'technology' => ['💻', '🤖', '📱', '🎮', '💡'],
    'mathematics' => ['🔢', '➕', '📐', '🧮', '📊'],
    'indian_culture' => ['🪔', '🎭', '💃', '🎶', '🛕'],
    'environment' => ['🌳', '🌍', '♻️', '🌊', '🦋'],
    'famous_people' => ['👨‍🔬', '🎨', '📚', '🎭', '🏅'],
    'current_affairs' => ['📰', '🌐', '📺', '🗞️', '📡'],
    'mythology' => ['🏹', '🐒', '🦚', '🐘', '⚡'],
    'literature' => ['📚', '✍️', '📖', '🎭', '📝'],
    'music_arts' => ['🎵', '🎨', '🎸', '🎹', '🎻'],
    'animals' => ['🦁', '🐘', '🦋', '🐬', '🦅'],
    'food_nutrition' => ['🍎', '🥗', '🍚', '🥛', '🥕'],
    'inventions' => ['💡', '⚙️', '🔧', '🚂', '✈️'],
    'monuments' => ['🏰', '🗽', '🕌', '🏯', '🗿']
];
?>
<!DOCTYPE html>
<html lang="en">
<?php App::render('/index/_head', ['title' => 'Play Quiz - Fun Quiz']); ?>
<body>
    <!-- Worm Animation Layer (Full Page Background) -->
    <div class="worm-animation-layer" id="worm-animation-layer">
        <!-- Full-page scene background -->
        <div class="scene-background" id="scene-background">
            <div class="scene-element elem-1"></div>
            <div class="scene-element elem-2"></div>
            <div class="scene-element elem-3"></div>
            <div class="scene-element elem-4"></div>
            <div class="scene-element elem-5"></div>
            <div class="scene-element elem-6"></div>
            <div class="scene-element elem-7"></div>
            <div class="scene-element elem-8"></div>
        </div>

        <!-- The worm character (default active mascot) -->
        <div class="worm-character idle" id="worm-character">
            <div class="worm-antenna left"></div>
            <div class="worm-antenna right"></div>
            <div class="worm-body">
                <div class="worm-segment seg-1"></div>
                <div class="worm-segment seg-2"></div>
                <div class="worm-segment seg-3"></div>
                <div class="worm-segment seg-4"></div>
            </div>
            <div class="worm-head">
                <div class="worm-eye left">
                    <div class="worm-pupil"></div>
                    <div class="worm-sparkle"></div>
                </div>
                <div class="worm-eye right">
                    <div class="worm-pupil"></div>
                    <div class="worm-sparkle"></div>
                </div>
                <div class="worm-blush left"></div>
                <div class="worm-blush right"></div>
                <div class="worm-mouth"></div>
                <div class="worm-tear left"></div>
                <div class="worm-tear right"></div>
            </div>
            <!-- Topic-specific accessories -->
            <div class="worm-accessory"></div>
        </div>

        <!-- Additional Mascot Characters Container (for future random selection) -->
        <div class="mascot-container" id="mascot-container">
            <!-- Bunny Mascot -->
            <div class="bunny-character mascot" id="bunny-character">
                <div class="bunny-ear left"></div>
                <div class="bunny-ear right"></div>
                <div class="bunny-head">
                    <div class="bunny-eye left">
                        <div class="bunny-pupil"></div>
                        <div class="bunny-sparkle"></div>
                    </div>
                    <div class="bunny-eye right">
                        <div class="bunny-pupil"></div>
                        <div class="bunny-sparkle"></div>
                    </div>
                    <div class="bunny-blush left"></div>
                    <div class="bunny-blush right"></div>
                    <div class="bunny-nose"></div>
                    <div class="bunny-mouth"></div>
                </div>
                <div class="bunny-body"></div>
                <div class="bunny-foot left"></div>
                <div class="bunny-foot right"></div>
                <div class="bunny-tail"></div>
            </div>

            <!-- Owl Mascot -->
            <div class="owl-character mascot" id="owl-character">
                <div class="owl-tuft left"></div>
                <div class="owl-tuft right"></div>
                <div class="owl-head">
                    <div class="owl-eye-ring left">
                        <div class="owl-eye">
                            <div class="owl-pupil"></div>
                            <div class="owl-sparkle"></div>
                        </div>
                    </div>
                    <div class="owl-eye-ring right">
                        <div class="owl-eye">
                            <div class="owl-pupil"></div>
                            <div class="owl-sparkle"></div>
                        </div>
                    </div>
                    <div class="owl-beak"></div>
                </div>
                <div class="owl-body">
                    <div class="owl-belly"></div>
                </div>
                <div class="owl-wing left"></div>
                <div class="owl-wing right"></div>
                <div class="owl-foot left"></div>
                <div class="owl-foot right"></div>
            </div>

            <!-- Cat Mascot -->
            <div class="cat-character mascot" id="cat-character">
                <div class="cat-ear left"></div>
                <div class="cat-ear right"></div>
                <div class="cat-head">
                    <div class="cat-eye left">
                        <div class="cat-pupil"></div>
                        <div class="cat-sparkle"></div>
                    </div>
                    <div class="cat-eye right">
                        <div class="cat-pupil"></div>
                        <div class="cat-sparkle"></div>
                    </div>
                    <div class="cat-nose"></div>
                    <div class="cat-mouth"></div>
                    <div class="cat-whisker left-1"></div>
                    <div class="cat-whisker left-2"></div>
                    <div class="cat-whisker left-3"></div>
                    <div class="cat-whisker right-1"></div>
                    <div class="cat-whisker right-2"></div>
                    <div class="cat-whisker right-3"></div>
                </div>
                <div class="cat-body"></div>
                <div class="cat-tail"></div>
                <div class="cat-paw left"></div>
                <div class="cat-paw right"></div>
            </div>

            <!-- Robot Mascot -->
            <div class="robot-character mascot" id="robot-character">
                <div class="robot-antenna"></div>
                <div class="robot-head">
                    <div class="robot-eye left">
                        <div class="robot-pupil"></div>
                    </div>
                    <div class="robot-eye right">
                        <div class="robot-pupil"></div>
                    </div>
                    <div class="robot-mouth"></div>
                </div>
                <div class="robot-body"></div>
                <div class="robot-arm left"></div>
                <div class="robot-arm right"></div>
                <div class="robot-leg left"></div>
                <div class="robot-leg right"></div>
            </div>
        </div>

        <!-- Particle container -->
        <div class="reaction-particles" id="reaction-particles"></div>
    </div>

    <div class="app" id="quiz-app">
        <header class="header">
            <div class="header-content">
                <a href="/" class="logo">
                    <span class="logo-icon">🎯</span>
                    <span class="logo-text">Fun Quiz</span>
                </a>
                <div class="user-info">
                    <span class="user-name"><?= htmlspecialchars($session['user_name'] ?? 'Guest') ?></span>
                    <span class="user-score"><?= (int)($session['total_score'] ?? 0) ?> pts</span>
                </div>
                <nav class="nav">
                    <a href="/" class="nav-link">Home</a>
                    <a href="/leaderboard" class="nav-link">Leaderboard</a>
                </nav>
            </div>
        </header>

        <main class="main">
            <!-- Loading State -->
            <div class="quiz-container loading-state" id="loading-container">
                <div class="loading-spinner"></div>
                <p style="color: var(--gray);">Preparing your quiz adventure...</p>
            </div>

            <!-- Quiz Container -->
            <div class="quiz-container" id="quiz-container" style="display: none;">
                <!-- Cartoon Background -->
                <div class="cartoon-bg" id="cartoon-bg">
                    <div class="cartoon-element" id="cartoon-1"></div>
                    <div class="cartoon-element" id="cartoon-2"></div>
                    <div class="cartoon-element" id="cartoon-3"></div>
                    <div class="cartoon-element" id="cartoon-4"></div>
                    <div class="cartoon-element" id="cartoon-5"></div>
                </div>

                <!-- Quiz Header Row -->
                <div class="quiz-header">
                    <div class="quiz-header-left">
                        <div class="topic-badge" id="topic-badge">
                            <span class="topic-icon" id="topic-icon"></span>
                            <span class="topic-name" id="topic-name"></span>
                        </div>
                        <div class="difficulty-badge" id="difficulty-badge">
                            <span class="difficulty-icon"></span>
                            <span class="difficulty-text">Easy</span>
                        </div>
                    </div>
                    <div class="quiz-header-right">
                        <span class="question-counter" id="question-num">1/10</span>
                        <div class="timer-container">
                            <svg class="timer-ring" viewBox="0 0 54 54">
                                <circle class="timer-ring-bg" cx="27" cy="27" r="25"/>
                                <circle class="timer-ring-progress" id="timer-ring" cx="27" cy="27" r="25"/>
                            </svg>
                            <div class="timer-text">
                                <span class="timer" id="timer">30</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Question Progress -->
                <div class="question-progress-bar">
                    <div class="question-progress-fill" id="progress"></div>
                </div>

                <!-- Question Content -->
                <div class="question-wrapper" id="question-container">
                    <p class="question-text" id="question">Loading question...</p>
                    <div class="options" id="options"></div>
                    <div class="explanation-box" id="explanation-box">
                        <div class="explanation-icon">💡</div>
                        <div class="explanation-content">
                            <h4>Did you know?</h4>
                            <p id="explanation-text"></p>
                        </div>
                    </div>
                </div>

                <!-- Quiz Actions -->
                <div class="quiz-actions">
                    <button class="btn btn-skip" onclick="skipQuestion()">
                        <span class="btn-icon">⏭️</span>
                        <span>Skip</span>
                    </button>
                    <button class="btn btn-next" id="next-btn" onclick="nextQuestion()" disabled>
                        <span>Next</span>
                        <span class="btn-icon">➡️</span>
                    </button>
                </div>
            </div>
        </main>

        <!-- Generation Status Indicator -->
        <div class="generation-status generating" id="generation-status" style="display: none;">
            <div class="spinner-small"></div>
            <span class="status-text" id="status-text">Generating more questions...</span>
        </div>
    </div>

    <script>
        // Topic data from PHP
        const topicsData = <?= json_encode($topics) ?>;
        const topicCartoons = <?= json_encode($topicCartoons) ?>;

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
            'monuments-wonders': 'monuments'
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

        // Quiz state
        let currentQuestion = 0;
        let score = 0;
        let questions = [];
        let selectedAnswer = null;
        let timer = null;
        let timeLeft = 30;
        let answeredIds = [];
        let currentTopic = null;
        let isGenerating = false;

        // Load questions from API with mixed topics
        async function loadQuestions() {
            try {
                const response = await fetch('/api/quiz/questions?count=10&mixed=1');
                const data = await response.json();

                if (!data.success) {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    }
                    return;
                }

                questions = data.questions;

                if (questions.length === 0) {
                    // No questions available, trigger generation
                    showGenerationStatus('No questions found. Generating new ones...');
                    await triggerQuestionGeneration();
                    return;
                }

                // Show quiz container
                document.getElementById('loading-container').style.display = 'none';
                document.getElementById('quiz-container').style.display = 'flex';

                showQuestion();

                // Start background generation if we have few questions
                if (questions.length < 10) {
                    triggerBackgroundGeneration();
                }
            } catch (error) {
                console.error('Error loading questions:', error);
                showGenerationStatus('Loading failed. Retrying...');
                setTimeout(loadQuestions, 2000);
            }
        }

        // Trigger Python CLI to generate questions
        async function triggerQuestionGeneration() {
            showGenerationStatus('AI is creating questions for you...');
            try {
                const response = await fetch('/api/quiz/generate', { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                    hideGenerationStatus();
                    loadQuestions();
                }
            } catch (error) {
                console.error('Generation error:', error);
                hideGenerationStatus();
            }
        }

        // Background generation
        async function triggerBackgroundGeneration() {
            if (isGenerating) return;
            isGenerating = true;
            showGenerationStatus('Preparing more questions...');

            try {
                await fetch('/api/quiz/generate?background=1', { method: 'POST' });
            } catch (error) {
                console.error('Background generation error:', error);
            }

            isGenerating = false;
            hideGenerationStatus();
        }

        function showGenerationStatus(text) {
            const status = document.getElementById('generation-status');
            document.getElementById('status-text').textContent = text;
            status.style.display = 'flex';
        }

        function hideGenerationStatus() {
            document.getElementById('generation-status').style.display = 'none';
        }

        // Update cartoon elements based on topic
        function updateCartoons(topicSlug) {
            const cartoons = topicCartoons[topicSlug] || ['❓', '❗', '💭', '✨', '🌟'];
            for (let i = 1; i <= 5; i++) {
                const el = document.getElementById(`cartoon-${i}`);
                if (el) {
                    el.textContent = cartoons[i - 1] || cartoons[0];
                    // Randomize position slightly
                    el.style.animationDelay = `${Math.random() * 3}s`;
                }
            }
        }

        // Apply topic theme to quiz
        function applyTopicTheme(topicSlug, topicInfo) {
            // Normalize topic slug using the mapping function
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

            // Update topic badge - use topicInfo if available, or lookup from normalized slug
            const displayInfo = topicInfo || topicsData[normalizedSlug];
            if (displayInfo) {
                document.getElementById('topic-icon').textContent = displayInfo.icon || '📚';
                document.getElementById('topic-name').textContent = displayInfo.name || normalizedSlug;
            } else {
                // Fallback for unmapped topics
                document.getElementById('topic-icon').textContent = '📚';
                document.getElementById('topic-name').textContent = topicSlug.replace(/[_-]/g, ' ');
            }

            // Update cartoon elements
            updateCartoons(normalizedSlug);

            // Update worm character scene (if initialized)
            if (typeof wormCharacter !== 'undefined' && wormCharacter) {
                wormCharacter.updateScene(normalizedSlug);
            }
        }

        function showQuestion() {
            if (currentQuestion >= questions.length) {
                finishQuiz();
                return;
            }

            const q = questions[currentQuestion];

            // Each question can have different topic!
            // Normalize topic slug using the mapping function
            const normalizedTopic = normalizeTopicSlug(q.topic);
            if (q.topic !== currentTopic) {
                currentTopic = q.topic;
                const topicInfo = topicsData[normalizedTopic];
                applyTopicTheme(q.topic, topicInfo);
            }

            document.getElementById('question').textContent = q.question;
            document.getElementById('question-num').textContent = `${currentQuestion + 1}/${questions.length}`;
            document.getElementById('progress').style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

            // Show difficulty with fun styling
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
                btn.onclick = () => selectOption(index);
                optionsContainer.appendChild(btn);
            });

            // Hide explanation
            document.getElementById('explanation-box').classList.remove('show');

            selectedAnswer = null;
            document.getElementById('next-btn').disabled = true;
            startTimer();
        }

        function selectOption(index) {
            if (selectedAnswer !== null) return;

            selectedAnswer = index;
            const options = document.querySelectorAll('.option');
            const q = questions[currentQuestion];

            options.forEach((opt, i) => {
                opt.classList.remove('selected');
                if (i === index) {
                    opt.classList.add('selected');
                }
            });

            // Check answer after short delay
            setTimeout(() => {
                stopTimer();
                options.forEach((opt, i) => {
                    if (i === q.correct) {
                        opt.classList.add('correct');
                    } else if (i === index && i !== q.correct) {
                        opt.classList.add('incorrect');
                    }
                    opt.disabled = true;
                });

                if (index === q.correct) {
                    score++;
                    showConfetti();
                    // Worm celebrates!
                    if (typeof wormCharacter !== 'undefined' && wormCharacter) {
                        wormCharacter.reactHappy(currentTopic);
                    }
                } else {
                    // Worm is sad
                    if (typeof wormCharacter !== 'undefined' && wormCharacter) {
                        wormCharacter.reactSad(currentTopic);
                    }
                }

                // Track answered question
                answeredIds.push(q.id);

                // Show explanation if available
                if (q.explanation) {
                    document.getElementById('explanation-text').textContent = q.explanation;
                    document.getElementById('explanation-box').classList.add('show');
                }

                document.getElementById('next-btn').disabled = false;
            }, 400);
        }

        function nextQuestion() {
            currentQuestion++;
            showQuestion();
        }

        function skipQuestion() {
            stopTimer();
            const q = questions[currentQuestion];
            answeredIds.push(q.id);
            currentQuestion++;
            showQuestion();
        }

        const TIMER_DURATION = 30;
        const TIMER_CIRCUMFERENCE = 2 * Math.PI * 25; // 157

        function startTimer() {
            timeLeft = TIMER_DURATION;
            updateTimerDisplay();

            // Reset progress bars
            const timerRing = document.getElementById('timer-ring');
            if (timerRing) {
                timerRing.style.strokeDashoffset = '0';
                timerRing.classList.remove('warning', 'danger');
            }

            timer = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    stopTimer();
                    // Auto-skip on timeout - worm is sad
                    if (typeof wormCharacter !== 'undefined' && wormCharacter) {
                        wormCharacter.reactSad(currentTopic);
                    }
                    const q = questions[currentQuestion];
                    answeredIds.push(q.id);
                    currentQuestion++;
                    showQuestion();
                }
            }, 1000);
        }

        function stopTimer() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        function updateTimerDisplay() {
            const timerEl = document.getElementById('timer');
            const timerRing = document.getElementById('timer-ring');

            // Update number display
            timerEl.textContent = timeLeft;
            timerEl.className = 'timer';

            // Calculate progress (0 = full, 1 = empty)
            const progress = 1 - (timeLeft / TIMER_DURATION);

            // Update circular ring
            if (timerRing) {
                const offset = progress * TIMER_CIRCUMFERENCE;
                timerRing.style.strokeDashoffset = offset;
                timerRing.classList.remove('warning', 'danger');
            }

            // Warning states
            if (timeLeft <= 10) {
                timerEl.classList.add('warning');
                if (timerRing) timerRing.classList.add('warning');
            }
            if (timeLeft <= 5) {
                timerEl.classList.add('danger');
                if (timerRing) timerRing.classList.add('danger');
            }
        }

        function showConfetti() {
            const colors = ['#ff6b6b', '#ffa94d', '#ffd43b', '#51cf66', '#4dabf7', '#da77f2', '#f783ac'];
            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 0.3 + 's';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }
        }

        async function finishQuiz() {
            stopTimer();
            try {
                const formData = new FormData();
                formData.append('topic', 'mixed');
                formData.append('score', score);
                formData.append('total', questions.length);
                formData.append('answered_ids', JSON.stringify(answeredIds));

                await fetch('/api/quiz/submit', {
                    method: 'POST',
                    body: formData
                });
                window.location.href = `/results?score=${score}&total=${questions.length}&topic=mixed`;
            } catch (error) {
                window.location.href = `/results?score=${score}&total=${questions.length}&topic=mixed`;
            }
        }

        // Start the quiz
        loadQuestions();
    </script>
    <!-- Mascot Controller - Manages all quiz mascots -->
    <script src="/js/mascot-controller.js"></script>
</body>
</html>
