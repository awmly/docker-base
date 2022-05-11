<?php

setVar('Config.Routes', [
    '\\/.*'                           => 'STAN\App\Frontend\AppFrontend',
    '\\/module\\/.*'                  => 'STAN\App\Frontend\AppFrontendModule'
  ]);