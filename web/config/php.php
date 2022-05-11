<?php

// Errors
ini_set('log_errors',0);
ini_set('display_errors','On');
error_reporting(E_ALL & ~E_STRICT & ~E_NOTICE);


// Time zone
date_default_timezone_set('Europe/London');

// Register shutdown function
function __shutdown()
{
    $error=error_get_last();

    if (isset($error['type']) && $error['type']==1) {

      ob_end_clean();

      if (STAN::User()->isApplied || STAN::User()->permission('developer')) {
        echo $error['message'].'<br/>Line '.$error['line'].' in '.$error['file'];
      } else {
        header("Location: /page-not-found?shutdown");
        exit;
      }

    }
}
register_shutdown_function('__shutdown');
