<?php

use ZealPHP\G;

$submit = function($request) {
    $g = G::instance();
    session_start();

    // Get POST data from form submission
    $data = $request->post ?? [];

    $topic = $data['topic'] ?? 'mixed';
    $score = (int)($data['score'] ?? 0);
    $total = (int)($data['total'] ?? 10);

    // answered_ids is sent as JSON string in FormData
    $answeredIdsRaw = $data['answered_ids'] ?? '[]';
    $answeredIds = is_string($answeredIdsRaw) ? json_decode($answeredIdsRaw, true) : $answeredIdsRaw;
    $answeredIds = $answeredIds ?? [];

    // Store in session
    $g->session['last_score'] = $score;
    $g->session['last_total'] = $total;
    $g->session['last_topic'] = $topic;

    // Track answered questions to prevent repeats
    $existingAnswered = $g->session['answered_questions'] ?? [];
    $g->session['answered_questions'] = array_unique(array_merge($existingAnswered, $answeredIds));

    // Calculate points (10 points per correct answer + bonus for streaks)
    $points = $score * 10;
    if ($score === $total && $total > 0) {
        $points += 50; // Perfect score bonus
    } elseif ($total > 0 && $score >= $total * 0.8) {
        $points += 20; // High score bonus
    }

    // Update total score in session
    $g->session['total_score'] = ($g->session['total_score'] ?? 0) + $points;
    $g->session['games_played'] = ($g->session['games_played'] ?? 0) + 1;

    // Update leaderboard
    $userName = $g->session['user_name'] ?? null;
    $userAge = $g->session['user_age'] ?? 0;

    if ($userName) {
        $leaderboardFile = __DIR__ . '/../../scripts/leaderboard.json';
        $leaderboard = [];

        if (file_exists($leaderboardFile)) {
            $leaderboard = json_decode(file_get_contents($leaderboardFile), true) ?? [];
        }

        // Find or create user entry
        $userIndex = null;
        foreach ($leaderboard as $index => $player) {
            if ($player['name'] === $userName) {
                $userIndex = $index;
                break;
            }
        }

        if ($userIndex !== null) {
            // Update existing entry
            $leaderboard[$userIndex]['score'] = $g->session['total_score'];
            $leaderboard[$userIndex]['games'] = $g->session['games_played'];
            $leaderboard[$userIndex]['age'] = $userAge;
        } else {
            // Add new entry
            $leaderboard[] = [
                'name' => $userName,
                'age' => $userAge,
                'score' => $g->session['total_score'],
                'games' => $g->session['games_played']
            ];
        }

        // Save leaderboard
        file_put_contents($leaderboardFile, json_encode($leaderboard, JSON_PRETTY_PRINT));
    }

    return [
        'success' => true,
        'score' => $score,
        'total' => $total,
        'points_earned' => $points,
        'total_score' => $g->session['total_score'],
        'games_played' => $g->session['games_played'],
        'total_answered' => count($g->session['answered_questions'])
    ];
};
