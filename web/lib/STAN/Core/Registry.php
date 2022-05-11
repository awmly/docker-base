<?php

/**
* STAN Class
*
* Handle class registry
*
* @author Andrew Womersley
* @package STAN 4.1
*/

namespace STAN\Core;

class Registry {

   public static $Registry = array();

   public static function __callStatic($instance, $args)
   {

		if($args){

			self::$Registry[$instance]=array(
				'closure'=>$args[0],
				'object'=>false
			);

		}else{

			if(empty(self::$Registry[$instance]['object']) && !empty(self::$Registry[$instance]['closure']) && is_callable(self::$Registry[$instance]['closure'])){
				self::$Registry[$instance]['object'] = call_user_func(self::$Registry[$instance]['closure']);
			}

      		// Return class or return StdClass if not set - avoid unwanted errors!
			return (self::$Registry[$instance]['object']) ?? false;

		}

	}

}
