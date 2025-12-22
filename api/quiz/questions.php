<?php

use ZealPHP\G;
use FunQuiz\QuizTopics;
use FunQuiz\Database;

$questions = function($request) {
    $g = G::instance();
    session_start();

    // Check if user is registered
    if (empty($g->session['user_name']) || empty($g->session['user_age'])) {
        return [
            'success' => false,
            'message' => 'Please register first',
            'redirect' => '/'
        ];
    }

    $userAge = (int)$g->session['user_age'];
    $answeredQuestions = $g->session['answered_questions'] ?? [];

    // Determine difficulty based on age
    $difficulty = 'easy';
    if ($userAge >= 12 && $userAge <= 14) {
        $difficulty = 'medium';
    } elseif ($userAge > 14) {
        $difficulty = 'hard';
    }

    // Check if mixed topics mode
    $mixedMode = isset($g->get['mixed']);
    $count = min((int)($g->get['count'] ?? 10), 20);

    // Get available topics
    $topics = QuizTopics::getAll();
    $topicKeys = array_keys($topics);

    // Get database instance
    $db = Database::getInstance();

    // Build filter for MongoDB
    $difficultyOrder = ['easy' => 1, 'medium' => 2, 'hard' => 3];
    $targetDiff = $difficultyOrder[$difficulty] ?? 1;

    // Get allowed difficulties (current level and below)
    $allowedDifficulties = [];
    foreach ($difficultyOrder as $diff => $level) {
        if ($level <= $targetDiff) {
            $allowedDifficulties[] = $diff;
        }
    }

    $filter = [
        'difficulty' => ['$in' => $allowedDifficulties]
    ];

    // Exclude already answered questions
    if (!empty($answeredQuestions)) {
        $excludeIds = [];
        foreach ($answeredQuestions as $id) {
            try {
                $excludeIds[] = new \MongoDB\BSON\ObjectId($id);
            } catch (\Exception $e) {
                // Skip invalid ObjectIds (might be from old JSON format)
            }
        }
        if (!empty($excludeIds)) {
            $filter['_id'] = ['$nin' => $excludeIds];
        }
    }

    // Get total count for stats
    $totalAvailable = $db->count('questions');

    if ($mixedMode) {
        // Mixed mode: get random questions from different topics
        $selectedQuestions = $db->random('questions', $count, $filter);
    } else {
        // Single topic mode
        $topic = $g->get['topic'] ?? null;

        if ($topic && !isset($topics[$topic])) {
            $topic = null;
        }

        if (!$topic) {
            $topic = $topicKeys[array_rand($topicKeys)];
        }

        // Add topic filter
        $filter['topic'] = $topic;

        // Get random questions for this topic
        $selectedQuestions = $db->random('questions', $count, $filter);

        // If not enough questions from this topic, get more from other topics
        if (count($selectedQuestions) < $count) {
            $remaining = $count - count($selectedQuestions);
            $existingIds = array_map(function($q) {
                return new \MongoDB\BSON\ObjectId($q['_id']);
            }, $selectedQuestions);

            $otherFilter = [
                'difficulty' => ['$in' => $allowedDifficulties],
                'topic' => ['$ne' => $topic]
            ];

            if (!empty($existingIds) || !empty($answeredQuestions)) {
                $allExclude = $existingIds;
                foreach ($answeredQuestions as $id) {
                    try {
                        $allExclude[] = new \MongoDB\BSON\ObjectId($id);
                    } catch (\Exception $e) {
                        // Skip invalid ObjectIds
                    }
                }
                $otherFilter['_id'] = ['$nin' => $allExclude];
            }

            $moreQuestions = $db->random('questions', $remaining, $otherFilter);
            $selectedQuestions = array_merge($selectedQuestions, $moreQuestions);
        }
    }

    // Format questions for frontend
    $formattedQuestions = array_map(function($q) {
        return [
            'id' => $q['_id'],
            'topic' => $q['topic'],
            'question' => $q['question'],
            'options' => $q['options'],
            'correct' => $q['correct'],
            'explanation' => $q['explanation'] ?? '',
            'difficulty' => $q['difficulty']
        ];
    }, $selectedQuestions);

    return [
        'success' => true,
        'mixed' => $mixedMode,
        'difficulty' => $difficulty,
        'count' => count($formattedQuestions),
        'total_available' => $totalAvailable,
        'questions' => $formattedQuestions
    ];
};
