<?php

namespace STAN\Core;

use STAN;

class Core{

	public function __construct(){


	}


	public function load(){

		// Vars
		$vars = new \STAN\Core\Variables;
		Register('Vars', $vars);

		// Config
		$this->config = new \STAN\Core\Config();
		Register('Config', $this->config);

		$this->config->load('php');
		$this->config->load('env');


	}

	public function install() {

		if ($_ENV['SERVER'] == 'LOCAL') {

			$dbh = new \PDO('mysql:host='.$_ENV['LOCAL_MYSQL_HOST'].';dbname=' . $_ENV['LOCAL_MYSQL_DATABASE'], $_ENV['LOCAL_MYSQL_USER'], $_ENV['LOCAL_MYSQL_PASSWORD'], [
				\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION
			]);

			try{
				$dbh->query('select * from items');
			} catch (\PDOException $e) {
				echo "Database not installed - run <b>base db install</b> and refresh";
				exit;
			}

		}

		// Load remaing configs
		$this->config->load('config');

		// Requests
		$this->request = new STAN\Utils\Request();
		Register('Request', $this->request);

		// Router
		$this->router = new \STAN\Core\Router();
		$this->config->load('routes');

	}

	public function setRoute($route = false) {
		
		if ($route)
		{
			$this->router->setURL($route);
		}
		else
		{
			$this->router->getURL();
		}

		Register('Router', $this->router);

		// load page and controller classes
		$this->router->init();

	}

}
