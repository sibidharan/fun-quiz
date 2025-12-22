<?php

require 'vendor/autoload.php';

use ZealPHP\App;
use ZealPHP\G;

// Disable superglobals for full OpenSwoole coroutine support
App::superglobals(false);

$app = App::init('0.0.0.0', 8080);

// Play route - main quiz page (no category selection needed)
$app->route('/play', function() {
    $g = G::instance();
    session_start();

    // Redirect to home if not registered
    if (empty($g->session['user_name'])) {
        header('Location: /');
        return;
    }

    App::render('/quiz/play', [
        'session' => $g->session
    ]);
});

// Results route
$app->route('/results', function() {
    $g = G::instance();
    session_start();

    App::render('/quiz/results', [
        'session' => $g->session,
        'score' => $g->get['score'] ?? ($g->session['last_score'] ?? 0),
        'total' => $g->get['total'] ?? ($g->session['last_total'] ?? 0),
        'topic' => $g->get['topic'] ?? ($g->session['last_topic'] ?? 'mixed')
    ]);
});

// Leaderboard route
$app->route('/leaderboard', function() {
    $g = G::instance();
    session_start();

    App::render('/quiz/leaderboard', [
        'session' => $g->session
    ]);
});

$app->run();
