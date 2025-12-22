<?php
use ZealPHP\App;

// Load leaderboard from file storage
$leaderboardFile = __DIR__ . '/../../scripts/leaderboard.json';
$leaderboard = [];

if (file_exists($leaderboardFile)) {
    $leaderboard = json_decode(file_get_contents($leaderboardFile), true) ?? [];
}

// Sort by score descending
usort($leaderboard, function($a, $b) {
    return ($b['score'] ?? 0) - ($a['score'] ?? 0);
});

// Take top 20
$leaderboard = array_slice($leaderboard, 0, 20);

// Check if current user is on leaderboard
$currentUserName = $session['user_name'] ?? null;
$currentUserRank = null;
if ($currentUserName) {
    foreach ($leaderboard as $index => $player) {
        if ($player['name'] === $currentUserName) {
            $currentUserRank = $index + 1;
            break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<?php App::render('/index/_head', ['title' => 'Leaderboard - Fun Quiz']); ?>
<body>
    <div class="app">
        <header class="header">
            <div class="header-content">
                <a href="/" class="logo">
                    <span class="logo-icon">🎯</span>
                    <span class="logo-text">Fun Quiz</span>
                </a>
                <?php if (!empty($session['user_name'])): ?>
                <div class="user-info">
                    <span class="user-name"><?= htmlspecialchars($session['user_name']) ?></span>
                    <span class="user-score"><?= (int)($session['total_score'] ?? 0) ?> pts</span>
                </div>
                <?php endif; ?>
                <nav class="nav">
                    <a href="/" class="nav-link">Home</a>
                    <a href="/leaderboard" class="nav-link active">Leaderboard</a>
                </nav>
            </div>
        </header>

        <main class="main">
            <div class="leaderboard-container">
                <div class="leaderboard-header">
                    <h1>Leaderboard</h1>
                    <p>Top quiz champions</p>
                </div>

                <?php if (!empty($session['user_name'])): ?>
                <div class="your-stats">
                    <h3>Your Stats</h3>
                    <div class="stats-row">
                        <div class="stat-item">
                            <span class="stat-value"><?= (int)($session['total_score'] ?? 0) ?></span>
                            <span class="stat-label">Points</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value"><?= (int)($session['games_played'] ?? 0) ?></span>
                            <span class="stat-label">Games</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value"><?= count($session['answered_questions'] ?? []) ?></span>
                            <span class="stat-label">Questions</span>
                        </div>
                        <?php if ($currentUserRank): ?>
                        <div class="stat-item">
                            <span class="stat-value">#<?= $currentUserRank ?></span>
                            <span class="stat-label">Rank</span>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if (empty($leaderboard)): ?>
                <div class="empty-leaderboard">
                    <p>No scores yet! Be the first to play and claim the top spot!</p>
                </div>
                <?php else: ?>
                <ul class="leaderboard-list">
                    <?php foreach ($leaderboard as $index => $player):
                        $isCurrentUser = ($currentUserName && $player['name'] === $currentUserName);
                    ?>
                    <li class="leaderboard-item <?= $isCurrentUser ? 'current-user' : '' ?>">
                        <span class="rank rank-<?= $index + 1 ?>">
                            <?php if ($index === 0): ?>
                                <span class="medal">1</span>
                            <?php elseif ($index === 1): ?>
                                <span class="medal">2</span>
                            <?php elseif ($index === 2): ?>
                                <span class="medal">3</span>
                            <?php else: ?>
                                #<?= $index + 1 ?>
                            <?php endif; ?>
                        </span>
                        <div class="player-info">
                            <span class="player-name"><?= htmlspecialchars($player['name']) ?></span>
                            <span class="player-meta">Age: <?= (int)($player['age'] ?? 0) ?> | Games: <?= (int)($player['games'] ?? 0) ?></span>
                        </div>
                        <span class="player-score"><?= number_format($player['score'] ?? 0) ?> pts</span>
                    </li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>

                <div style="text-align: center; margin-top: 2rem;">
                    <?php if (empty($session['user_name'])): ?>
                    <a href="/" class="btn btn-primary">Register & Play!</a>
                    <?php else: ?>
                    <a href="/play" class="btn btn-primary">Play Again</a>
                    <?php endif; ?>
                </div>
            </div>
        </main>

        <?php App::render('/index/_footer'); ?>
    </div>
</body>
</html>
