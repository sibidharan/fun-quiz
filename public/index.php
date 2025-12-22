<?php

use ZealPHP\App;
use ZealPHP\G;

$g = G::instance();
session_start();

App::render('_master', [
    'title' => 'Fun Quiz - Test Your Knowledge!',
    'session' => $g->session
]);
