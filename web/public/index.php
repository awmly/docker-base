<?php

// Init
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') {
  session_set_cookie_params(time() + 60*60*24*100, '/; samesite=lax', $_SERVER['SERVER_NAME'], true, true);
}
session_start(['read_and_close' => true]);
define('STAN_START', microtime(true));

// Include paths
include($_SERVER["DOCUMENT_ROOT"] . "/paths.php");

// Load and start the autoloader
include(PATH_LIB . 'STAN/Core/Autoload.php');
\STAN\Core\Autoload::Init();

// Load vendors
include(PATH_LIB . 'vendor/autoload.php');

// Init STAN
$STAN = new STAN\Core\Core;

// // Load
$STAN->load();

//change port when running local php server outside of docker
if(php_sapi_name() == 'cli-server'){
  $_ENV['LOCAL_MYSQL_HOST'] = $_ENV['LOCAL_MYSQL_HOST_PHP'];
}

// Check install
$STAN->install();