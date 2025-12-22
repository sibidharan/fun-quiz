<?php

use ZealPHP\G;

$register = function($request) {
    $g = G::instance();

    // Get POST data from form submission
    $data = $request->post ?? [];

    $name = trim($data['name'] ?? '');
    $age = (int)($data['age'] ?? 0);

    // Validate name
    if (strlen($name) < 2 || strlen($name) > 50) {
        return [
            'success' => false,
            'message' => 'Name must be between 2 and 50 characters'
        ];
    }

    // Validate age
    if ($age < 8 || $age > 16) {
        return [
            'success' => false,
            'message' => 'Age must be between 8 and 16 years'
        ];
    }

    // Store user in session
    session_start();
    $g->session['user_name'] = $name;
    $g->session['user_age'] = $age;
    $g->session['answered_questions'] = [];
    $g->session['total_score'] = 0;
    $g->session['games_played'] = 0;
    $g->session['registered_at'] = time();

    return [
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'name' => $name,
            'age' => $age
        ]
    ];
};
