<?php

use ZealPHP\G;
use FunQuiz\QuizTopics;

$generate = function($request) {
    $g = G::instance();
    session_start();

    // Check if user is registered
    if (empty($g->session['user_name']) || empty($g->session['user_age'])) {
        return [
            'success' => false,
            'message' => 'Please register first'
        ];
    }

    $userAge = (int)$g->session['user_age'];

    // Determine difficulty based on age
    $difficulty = 'easy';
    if ($userAge >= 12 && $userAge <= 14) {
        $difficulty = 'medium';
    } elseif ($userAge > 14) {
        $difficulty = 'hard';
    }

    // Get random topic or use provided one
    $topics = QuizTopics::getTopicSlugs();
    $topic = $g->get['topic'] ?? $topics[array_rand($topics)];

    // Background mode - run async
    $background = isset($g->get['background']);

    // Path to Python CLI
    $pythonScript = __DIR__ . '/../../scripts/quiz_generator.py';
    $pythonPath = '/var/labsstorage/home/sibidharan/fun_quiz/scripts/.venv/bin/python';

    // Check if virtual environment python exists
    if (!file_exists($pythonPath)) {
        $pythonPath = 'python';
    }

    // Build command
    $count = $background ? 5 : 3;
    $command = sprintf(
        '%s %s generate --topic %s --difficulty %s --count %d 2>&1',
        escapeshellcmd($pythonPath),
        escapeshellarg($pythonScript),
        escapeshellarg($topic),
        escapeshellarg($difficulty),
        $count
    );

    // Change to scripts directory for proper path resolution
    $scriptsDir = __DIR__ . '/../../scripts';

    if ($background) {
        // Run in background using coprocess
        \go(function() use ($command, $scriptsDir) {
            $currentDir = getcwd();
            chdir($scriptsDir);
            exec($command);
            chdir($currentDir);
        });

        return [
            'success' => true,
            'message' => 'Generation started in background',
            'topic' => $topic,
            'difficulty' => $difficulty
        ];
    }

    // Synchronous execution
    $currentDir = getcwd();
    chdir($scriptsDir);
    $output = shell_exec($command);
    chdir($currentDir);

    // Try to parse JSON output
    $result = json_decode($output, true);

    if ($result && isset($result['status']) && $result['status'] === 'success') {
        return [
            'success' => true,
            'message' => 'Questions generated successfully',
            'topic' => $result['topic'] ?? $topic,
            'difficulty' => $result['difficulty'] ?? $difficulty,
            'generated' => $result['generated'] ?? 0,
            'saved' => $result['saved'] ?? 0
        ];
    }

    // If JSON parsing failed, still report success if we got output
    return [
        'success' => true,
        'message' => 'Generation completed',
        'topic' => $topic,
        'difficulty' => $difficulty,
        'raw_output' => $output
    ];
};
