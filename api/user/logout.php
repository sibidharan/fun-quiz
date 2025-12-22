<?php

use ZealPHP\G;

$logout = function() {
    $g = G::instance();

    session_start();
    session_destroy();

    return [
        'success' => true,
        'message' => 'Logged out successfully'
    ];
};
