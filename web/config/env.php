<?php

$env = Dotenv\Dotenv::createMutable(PATH_BASE . 'environments', 'server.env');
$env->load();

$env = Dotenv\Dotenv::createMutable(PATH_BASE . 'environments', 'core.env');
$env->load();

$env = Dotenv\Dotenv::createMutable(PATH_BASE . 'environments', strtolower($_SERVER['SERVER']) . '.env');
$env->load();

if (!empty($_SERVER['HTTP_X_FIREBASE']))
{
    $env = Dotenv\Dotenv::createMutable(PATH_BASE . 'environments', 'firebase.env');
    $env->load();
}
