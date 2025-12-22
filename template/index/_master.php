<?php
use ZealPHP\App;
?>
<!DOCTYPE html>
<html lang="en">
<?php App::render('_head', ['title' => $title]); ?>
<body>
    <div class="app">
        <header class="header">
            <div class="header-content">
                <a href="/" class="logo">
                    <span class="logo-icon">🎯</span>
                    <span class="logo-text">Fun Quiz</span>
                </a>
                <nav class="nav">
                    <a href="/" class="nav-link">Home</a>
                    <a href="/leaderboard" class="nav-link">Leaderboard</a>
                </nav>
            </div>
        </header>

        <main class="main">
            <?php App::render('content', [
                'categories' => $categories ?? [],
                'session' => $session ?? []
            ]); ?>
        </main>

        <?php App::render('_footer'); ?>
    </div>
</body>
</html>
