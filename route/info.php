<?php

use ZealPHP\App;
use ZealPHP\G;

$app = App::instance();

$app->route('/info', function() {
    phpinfo();
});

// API to get leaderboard data (demonstrating async capabilities)
$app->route('/api/leaderboard', function() {
    $g = G::instance();

    // In a real app, this would fetch from database using coroutines
    $leaderboard = [
        ['name' => 'QuizMaster42', 'score' => 9800, 'games' => 50],
        ['name' => 'BrainiacPro', 'score' => 8750, 'games' => 45],
        ['name' => 'TriviaKing', 'score' => 8200, 'games' => 42],
        ['name' => 'SmartCookie', 'score' => 7650, 'games' => 38],
        ['name' => 'WisdomSeeker', 'score' => 7100, 'games' => 35],
    ];

    return $leaderboard;
});
