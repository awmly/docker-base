<?php

class STAN{

  public static function __callStatic($instance,$args){

    return \STAN\Core\Registry::$instance();

  }

}
