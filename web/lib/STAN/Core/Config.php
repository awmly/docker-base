<?php

namespace STAN\Core;

use STAN;

class Config{

  public $vars = [];

  public function __construct(){

    setVar('Config', []);

  }

  public function load($file) {

    include_once(PATH_BASE . "config/" . $file . ".php");

  }

}
