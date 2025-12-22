<?php
use ZealPHP\App;
use FunQuiz\QuizTopics;

$percentage = $total > 0 ? round(($score / $total) * 100) : 0;
$topics = QuizTopics::getAll();
$topicInfo = $topics[$topic] ?? null;

$icon = '🎉';
$message = 'Amazing! You\'re a quiz master!';
if ($percentage < 30) {
    $icon = '😅';
    $message = 'Keep practicing! You\'ll get better!';
} elseif ($percentage < 50) {
    $icon = '🤔';
    $message = 'Not bad! Room for improvement!';
} elseif ($percentage < 70) {
    $icon = '😊';
    $message = 'Good job! You know your stuff!';
} elseif ($percentage < 90) {
    $icon = '🌟';
    $message = 'Excellent! Almost perfect!';
}

// Calculate points earned
$pointsEarned = $score * 10;
if ($score === $total && $total > 0) {
    $pointsEarned += 50;
} elseif ($total > 0 && $score >= $total * 0.8) {
    $pointsEarned += 20;
}
?>
<!DOCTYPE html>
<html lang="en">
<?php App::render('/index/_head', ['title' => 'Quiz Results - Fun Quiz']); ?>
<body>
    <div class="app theme-<?= htmlspecialchars($topic) ?>">
        <header class="header">
            <div class="header-content">
                <a href="/" class="logo">
                    <span class="logo-icon">🎯</span>
                    <span class="logo-text">Fun Quiz</span>
                </a>
                <div class="user-info">
                    <span class="user-name"><?= htmlspecialchars($session['user_name'] ?? 'Guest') ?></span>
                    <span class="user-score">Total: <?= (int)($session['total_score'] ?? 0) ?> pts</span>
                </div>
                <nav class="nav">
                    <a href="/" class="nav-link">Home</a>
                    <a href="/leaderboard" class="nav-link">Leaderboard</a>
                </nav>
            </div>
        </header>

        <main class="main">
            <div class="results-container">
                <div class="results-icon"><?= $icon ?></div>
                <h1>Quiz Complete!</h1>

                <?php if ($topicInfo): ?>
                <div class="topic-badge">
                    <span class="topic-icon"><?= $topicInfo['icon'] ?></span>
                    <span class="topic-name"><?= $topicInfo['name'] ?></span>
                </div>
                <?php endif; ?>

                <div class="results-score"><?= $percentage ?>%</div>
                <p class="results-message"><?= $message ?></p>

                <div class="results-stats">
                    <div class="stat">
                        <div class="stat-value"><?= $score ?></div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value"><?= $total - $score ?></div>
                        <div class="stat-label">Incorrect</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">+<?= $pointsEarned ?></div>
                        <div class="stat-label">Points</div>
                    </div>
                </div>

                <div class="session-stats">
                    <p>Games Played: <?= (int)($session['games_played'] ?? 1) ?></p>
                    <p>Questions Answered: <?= count($session['answered_questions'] ?? []) ?></p>
                </div>

                <div class="quiz-actions" style="justify-content: center;">
                    <a href="/play" class="btn btn-primary">Play Again</a>
                    <a href="/" class="btn btn-secondary">Back Home</a>
                    <a href="/leaderboard" class="btn btn-outline">Leaderboard</a>
                </div>
            </div>
        </main>

        <?php App::render('/index/_footer'); ?>
    </div>

    <?php if ($percentage >= 80): ?>
    <script>
        // Celebration confetti for high scores
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a78bfa', '#34d399'][Math.floor(Math.random() * 5)];
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    </script>
    <?php endif; ?>
</body>
</html>
