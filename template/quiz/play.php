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
    'literature' => ['📚', '✍️', '📖', '🎭', '📝'],
    'music_arts' => ['🎵', '🎨', '🎸', '🎹', '🎻'],
    'animals' => ['🦁', '🐘', '🦋', '🐬', '🦅'],
    'food_nutrition' => ['🍎', '🥗', '🍚', '🥛', '🥕'],
    'inventions' => ['💡', '⚙️', '🔧', '🚂', '✈️'],
    'monuments' => ['🏰', '🗽', '🕌', '🏯', '🗿'],
    // Cyber Security & Police Topics
    'cyber_security' => ['🔒', '🛡️', '🔐', '🔑', '🏰'],
    'internet_safety' => ['🛡️', '✅', '🌐', '👁️', '🔒'],
    'cyber_crime_awareness' => ['⚠️', '🚨', '👤', '🎣', '🐛'],
    'online_fraud_awareness' => ['🚨', '💳', '📱', '💸', '🎭'],
    'police_awareness' => ['👮', '🚔', '🏅', '📞', '🚧'],
    'digital_literacy' => ['💻', '⌨️', '🖱️', '💡', '📚'],
    'network_basics' => ['📡', '📶', '🔌', '🌐', '📦'],
    'safe_online_culture' => ['🌐', '💙', '🤝', '⭐', '✅']
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
            <!-- Background layers (theme-specific elements) -->
            <div class="server-horizon"></div>
            <div class="hex-mesh"></div>
            <div class="fortress-shield"></div>
            <div class="circuit-traces"></div>

            <!-- Ultra-distant and far background layers -->
            <div class="elem-0-ultra"></div>
            <div class="elem-0-far"></div>

            <!-- Animated scene elements -->
            <div class="scene-element elem-1">
                <div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
            <div class="elem-1-fg"></div>
            <div class="scene-element elem-2">
                <div></div><div></div>
            </div>
            <div class="elem-2-valley"></div>
            <div class="scene-element elem-3">
                <div></div>
            </div>
            <div class="scene-element elem-4">
                <div></div>
            </div>
            <div class="scene-element elem-5">
                <div></div><div></div><div></div>
            </div>
            <div class="elem-5-globe"></div>
            <div class="elem-5-globe-stand"></div>
            <div class="elem-5-rope"></div>
            <div class="elem-5-rope"></div>
            <div class="elem-5-rope"></div>
            <div class="scene-element elem-6"></div>
            <div class="elem-6-low"></div>
            <div class="scene-element elem-7"></div>
            <div class="scene-element elem-8"></div>
            <div class="scene-element elem-9"></div>

            <!-- Additional atmospheric elements -->
            <div class="depth-fog"></div>
            <div class="scene-particles"></div>
            <div class="community-ground"></div>

            <!-- Cyber security elements -->
            <div class="check-3"></div>
            <div class="binary-stream-2"></div>
            <div class="protective-aura"></div>

            <!-- Internet safety elements -->
            <div class="scene-element elem-9"></div>
            <div class="scene-element elem-10"></div>
            <div class="safe-ground"></div>

            <!-- Network basics elements -->
            <div class="datacenter-skyline"></div>
            <div class="network-topology"></div>
            <div class="network-switch"></div>
            <div class="small-router"></div>
            <div class="data-packet-trails"></div>
            <div class="global-connections"></div>
            <div class="antenna-tower"></div>
            <div class="network-floor"></div>

            <!-- Theme-specific atmospheric elements -->
            <div class="alert-particles"></div>
            <div class="ambient-glow"></div>
            <div class="ambient-particles"></div>
            <div class="atmosphere"></div>
            <div class="atmosphere-particles"></div>
            <div class="atmosphere-sparkles"></div>
            <div class="background-gears"></div>
            <div class="birds-1"></div>
            <div class="birds-2"></div>
            <div class="blueprint-grid-overlay"></div>
            <div class="blueprint-paper"></div>
            <div class="brass-shimmer"></div>
            <div class="bulb-glow-aura"></div>
            <div class="butterfly-1"></div>
            <div class="butterfly-2"></div>
            <div class="camera-flash"></div>
            <div class="chandelier-glow"></div>
            <div class="clouds-layer"></div>
            <div class="counter-silhouette"></div>
            <div class="danger-ground"></div>
            <div class="data-stream"></div>
            <div class="deer-legs"></div>
            <div class="desk-ground"></div>
            <div class="dishware-layer"></div>
            <div class="distant-clouds"></div>
            <div class="dust-motes"></div>
            <div class="energy-burst-1"></div>
            <div class="energy-burst-2"></div>
            <div class="energy-field"></div>
            <div class="energy-nodes"></div>
            <div class="eureka-burst"></div>
            <div class="fibonacci-overlay"></div>
            <div class="floating-equations"></div>
            <div class="floating-ingredients"></div>
            <div class="floating-pages"></div>
            <div class="floating-papers"></div>
            <div class="fraction-bar"></div>
            <div class="fresh-sparkles"></div>
            <div class="glitter-particle"></div>
            <div class="golden-spiral"></div>
            <div class="grass"></div>
            <div class="pine-forest"></div>
            <div class="cloud-2"></div>
            <div class="cloud-3"></div>
            <div class="grid-overlay"></div>
            <div class="heat-shimmer"></div>
            <div class="herb-particles"></div>
            <div class="idea-particles"></div>
            <div class="ink-drops"></div>
            <div class="knowledge-aura"></div>
            <div class="leaf-particles"></div>
            <div class="light-particles"></div>
            <div class="light-rays"></div>
            <div class="magic-sparkles"></div>
            <div class="magic-trails"></div>
            <div class="math-field"></div>
            <div class="math-symbols"></div>
            <div class="more-equations"></div>
            <div class="more-fruits"></div>
            <div class="music-sparkles"></div>
            <div class="news-icons"></div>
            <div class="news-ticker"></div>
            <div class="number-particles"></div>
            <div class="nutrition-aura"></div>
            <div class="paint-particles"></div>
            <div class="particle-stream"></div>
            <div class="propeller"></div>
            <div class="protective-shield"></div>
            <div class="rhythm-waves"></div>
            <div class="road-ground"></div>
            <div class="scan-beams"></div>
            <div class="scan-effect"></div>
            <div class="signal-waves"></div>
            <div class="sparkle-layer"></div>
            <div class="sparkle-particles"></div>
            <div class="spotlight"></div>
            <div class="spotlight-sweep"></div>
            <div class="stadium-lights"></div>
            <div class="station-antenna"></div>
            <div class="steam-layer-1"></div>
            <div class="steam-layer-2"></div>
            <div class="steam-puffs"></div>
            <div class="street-lamps"></div>
            <div class="trust-stars"></div>
            <div class="turbine-blades"></div>
            <div class="vitamin-glow"></div>
            <div class="warning-particles"></div>
            <div class="workshop-glow"></div>
            <div class="workshop-silhouette"></div>
            <div class="workshop-steam"></div>
            <div class="animation-layer"></div>
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
                    <button class="audio-toggle" id="audio-toggle" onclick="toggleAudio()" title="Toggle Sound">
                        <span class="audio-on">🔊</span>
                        <span class="audio-off" style="display:none;">🔇</span>
                    </button>
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

    <!-- External JS Files -->
    <script src="/js/audio-manager.js"></script>
    <script src="/js/confetti.js"></script>
    <script src="/js/quiz-game.js"></script>
    <script>
        // Audio toggle function
        function toggleAudio() {
            if (typeof audioManager !== 'undefined') {
                const isMuted = audioManager.toggleMute();
                const btn = document.getElementById('audio-toggle');
                const onIcon = btn.querySelector('.audio-on');
                const offIcon = btn.querySelector('.audio-off');

                if (isMuted) {
                    onIcon.style.display = 'none';
                    offIcon.style.display = 'inline';
                } else {
                    onIcon.style.display = 'inline';
                    offIcon.style.display = 'none';
                    // Resume music if quiz is playing
                    if (quizGame && quizGame.questions.length > 0) {
                        audioManager.playMusic('quiz');
                    }
                }
            }
        }

        // Update audio button state on page load based on saved preference
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                if (typeof audioManager !== 'undefined' && audioManager.isMuted) {
                    const btn = document.getElementById('audio-toggle');
                    const onIcon = btn.querySelector('.audio-on');
                    const offIcon = btn.querySelector('.audio-off');
                    onIcon.style.display = 'none';
                    offIcon.style.display = 'inline';
                }
            }, 100);
        });
    </script>
    <script>
        // Topic data from PHP
        const topicsData = <?= json_encode($topics) ?>;
        const topicCartoons = <?= json_encode($topicCartoons) ?>;

        // Initialize and start the quiz (window. for global access in debug panel)
        window.quizGame = new QuizGame(topicsData, topicCartoons);
        window.quizGame.loadQuestions();
    </script>
    <!-- Mascot Controller - Manages all quiz mascots -->
    <script src="/js/mascot-controller.js"></script>

    <!-- Debug Panel for Theme Testing -->
    <div id="debug-panel" style="display:none; position:fixed; bottom:10px; right:10px; background:rgba(0,0,0,0.9); padding:15px; border-radius:8px; z-index:10000; max-height:400px; overflow-y:auto; font-family:monospace; font-size:12px; color:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #444; padding-bottom:8px;">
            <strong style="color:#0f0;">🎨 Theme Debug</strong>
            <button onclick="debugPanel.hide()" style="background:#f44; color:#fff; border:none; padding:2px 8px; border-radius:4px; cursor:pointer;">✕</button>
        </div>
        <div style="margin-bottom:10px;">
            <label style="color:#aaa;">Select Theme:</label>
            <select id="debug-theme-select" onchange="debugPanel.setTheme(this.value)" style="width:100%; padding:5px; margin-top:5px; background:#333; color:#fff; border:1px solid #555; border-radius:4px;">
                <option value="">-- Select Theme --</option>
            </select>
        </div>
        <div style="margin-bottom:10px;">
            <button id="debug-pause-btn" onclick="debugPanel.togglePause()" style="width:100%; padding:8px; background:#ff9800; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">⏸️ Pause Timer</button>
        </div>
        <div id="debug-info" style="color:#aaa; font-size:11px; margin-top:10px;"></div>
    </div>

    <script>
    // Debug Panel for Theme Testing
    const debugPanel = {
        panel: null,
        select: null,
        info: null,
        pauseBtn: null,
        isPaused: false,
        savedTimeLeft: null,

        init() {
            this.panel = document.getElementById('debug-panel');
            this.select = document.getElementById('debug-theme-select');
            this.info = document.getElementById('debug-info');
            this.pauseBtn = document.getElementById('debug-pause-btn');

            // Populate theme dropdown
            const themes = Object.keys(topicsData);
            themes.forEach(theme => {
                const option = document.createElement('option');
                option.value = theme;
                option.textContent = topicsData[theme].name || theme;
                this.select.appendChild(option);
            });

            console.log('%c[Debug] Theme debugger initialized. Press Ctrl+Shift+D to toggle.', 'color: #0f0');
        },

        show() {
            this.panel.style.display = 'block';
            this.updateInfo();
        },

        hide() {
            this.panel.style.display = 'none';
        },

        toggle() {
            if (this.panel.style.display === 'none') {
                this.show();
            } else {
                this.hide();
            }
        },

        setTheme(theme) {
            if (!theme) return;

            // Remove all theme classes from body
            document.body.className = document.body.className.replace(/theme-\S+/g, '').trim();
            document.body.classList.add('theme-' + theme);

            // Update animation layer
            const animLayer = document.getElementById('worm-animation-layer');
            if (animLayer) {
                animLayer.className = animLayer.className.replace(/theme-\S+/g, '').trim();
                animLayer.classList.add('worm-animation-layer', 'theme-' + theme);
            }

            console.log('%c[Debug] Theme set to: ' + theme, 'color: #0f0; font-weight: bold');
            this.updateInfo();
            this.logSceneElements();
        },

        togglePause() {
            console.log('%c[Debug] togglePause called, isPaused=' + this.isPaused + ', quizGame exists=' + !!window.quizGame, 'color: #f0f; font-weight: bold');
            if (!this.isPaused) {
                // Pause the timer
                if (window.quizGame) {
                    this.savedTimeLeft = window.quizGame.timeLeft;
                    window.quizGame.stopTimer();
                    this.isPaused = true;
                    if (this.pauseBtn) {
                        this.pauseBtn.innerHTML = '▶️ Resume Timer';
                        this.pauseBtn.style.background = '#4CAF50';
                    }
                    console.log('%c[Debug] Timer PAUSED at ' + this.savedTimeLeft + 's', 'color: #ff0; font-weight: bold');
                } else {
                    console.error('[Debug] Cannot pause: window.quizGame not found!');
                }
            } else {
                // Resume the timer - restore time and restart
                if (window.quizGame) {
                    window.quizGame.timeLeft = this.savedTimeLeft;
                    window.quizGame.updateTimerDisplay();
                    window.quizGame.timer = setInterval(() => {
                        window.quizGame.timeLeft--;
                        window.quizGame.updateTimerDisplay();
                        if (window.quizGame.timeLeft <= 0) {
                            window.quizGame.stopTimer();
                            window.quizGame.currentQuestion++;
                            window.quizGame.showQuestion();
                        }
                    }, 1000);
                    this.isPaused = false;
                    if (this.pauseBtn) {
                        this.pauseBtn.innerHTML = '⏸️ Pause Timer';
                        this.pauseBtn.style.background = '#ff9800';
                    }
                    console.log('%c[Debug] Timer RESUMED', 'color: #0f0; font-weight: bold');
                } else {
                    console.error('[Debug] Cannot resume: window.quizGame not found!');
                }
            }
        },

        updateInfo() {
            const bodyClasses = document.body.className;
            const animLayer = document.getElementById('worm-animation-layer');
            const animClasses = animLayer ? animLayer.className : 'N/A';
            const sceneEl = document.querySelectorAll('.scene-background > *').length;

            this.info.innerHTML = `
                <div><strong>Body:</strong> ${bodyClasses}</div>
                <div><strong>Anim Layer:</strong> ${animClasses}</div>
                <div><strong>Scene Elements:</strong> ${sceneEl}</div>
            `;
        },

        logSceneElements() {
            const sceneBackground = document.querySelector('.scene-background');
            if (!sceneBackground) {
                console.warn('[Debug] No .scene-background found');
                return;
            }

            const elements = Array.from(sceneBackground.children);
            const visibleElements = elements.filter(el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden';
            });

            console.group('%c[Debug] Scene Elements Analysis', 'color: #ff0');
            console.log('Total elements:', elements.length);
            console.log('Visible elements:', visibleElements.length);

            visibleElements.forEach(el => {
                const style = window.getComputedStyle(el);
                const hasContent = style.content && style.content !== 'none' && style.content !== '""';
                const hasBg = style.background && style.background !== 'none' && !style.background.includes('rgba(0, 0, 0, 0)');
                const hasPseudo = style.getPropertyValue('--has-pseudo') || 'unknown';

                if (hasBg || hasContent || el.children.length > 0) {
                    console.log(`%c${el.className}`, 'color: #0ff', {
                        width: style.width,
                        height: style.height,
                        position: style.position,
                        background: style.background?.substring(0, 50) + '...'
                    });
                }
            });
            console.groupEnd();
        }
    };

    // Initialize debug panel
    document.addEventListener('DOMContentLoaded', () => debugPanel.init());

    // Keyboard shortcut: Ctrl+Shift+D to toggle debug panel
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            debugPanel.toggle();
        }
    });

    // Global function to set theme from console
    window.setTheme = (theme) => debugPanel.setTheme(theme);
    </script>
</body>
</html>
