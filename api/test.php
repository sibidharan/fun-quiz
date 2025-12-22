<?php

use ZealPHP\G;

$test = function() {
    $g = G::instance();

    return [
        'status' => 'ok',
        'message' => 'Fun Quiz API is running!',
        'framework' => 'ZealPHP',
        'superglobals' => 'disabled',
        'coroutines' => 'enabled',
        'session_id' => session_id(),
        'timestamp' => date('Y-m-d H:i:s')
    ];
};
