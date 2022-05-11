<?php

namespace STAN\Core;

use STAN;

class Router{

  public function __construct(){ }

  public function getURL(){

    $this->url = html_entity_decode(urldecode(reset(explode("?",$_SERVER['REQUEST_URI'] ?: ($_SERVER['REDIRECT_URL'] ?: $_SERVER['SCRIPT_NAME'])))));

    $this->url = mkurl($this->url);

    $this->initRoute();

  }

  public function setURL($url){

    $this->url = $url;

    $this->initRoute();

  }

  public function initRoute() {

    // Get URL
    $ReqUrl = $Url = $this->url;


    // Get controller from route
    foreach (getVar('Config.Routes') as $Pattern => $Class) {
      if (preg_match("/^" . $Pattern . "/i", $this->url)) {
        $app = $Class;
      }
    }

    $this->app = new $app();
    Register('App', $this->app);

  }


  public function init() {

    $this->parse($this->url);

    $this->app->init();

    //$this->app->preWP();

  }


  public function parse($string){

    if (!empty(STAN::Request()->get->filter))
    {
      $string .= STAN::Request()->get->filter;
    }

    $parts = explode("/", html_entity_decode($string));

    foreach($parts as $id => $part){

      if ($part) {
        STAN::Vars()->Set('Route.$' . $id, urldecode($part));
      }

    }
    STAN::Vars()->Set('Route.params',   []);
    STAN::Vars()->Set('Route.url',      $this->url);
    STAN::Vars()->Set('Route.full_url', getVar('App.url') . $this->url);
    STAN::Vars()->Set('Route.referer',  str_replace("http://" . $_SERVER['HTTP_HOST'], "", $_SERVER['HTTP_REFERER'] ?? ''));

  }

}
