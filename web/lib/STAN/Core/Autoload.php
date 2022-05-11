<?php

namespace STAN\Core;

class Autoload{

	public static function Init(){

		spl_autoload_extensions('.php');

		spl_autoload_register('self::Stan');

		spl_autoload_register('self::Lib');

		self::Functions(PATH_LIB."STAN/Functions/");

	}

	public static function Functions($dir){

		$files=scandir($dir);

		foreach($files as $f){

			self::Load($dir.$f);

		}

	}

	public static function Load($file){

		if(is_file($file)) return include($file); else return false;

	}


	public static function Lib($class){

		$file=PATH_LIB.str_replace("\\","/",$class).'.php';

		return self::Load($file);

	}

	public static function Stan($class){

		$file=PATH_LIB.$class.'.php';

		return self::Load($file);

	}

}
