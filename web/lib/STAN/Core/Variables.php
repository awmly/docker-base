<?php

namespace STAN\Core;

use STAN;

class Variables{

	public function Replace($str, $removeIfEmpty = true){

	preg_match_all("/{{([a-zA-Z0-9][a-zA-Z0-9\\|\\+\\$\\_\\.\\-\\&\\;\\ ]+)}}/i", $str, $vars);

	  foreach($vars[1] as $var){

			if (strstr($var, "|")) {
				$parts = explode("|", $var);
				$replace = STAN::Vars()->Get($parts[0]);
				if (!$replace) $replace = STAN::Vars()->Get($parts[1]) ?: $parts[1];
			} else {
				$replace = STAN::Vars()->Get($var);
			}

			if (!is_string($replace) && !is_numeric($replace) && !is_int($replace)) $replace = false;

			if (strstr($var, 'Popup.')) $removeIfEmpty = false;
			if (strstr($var, 'Video.')) $removeIfEmpty = false;
			
			if ($replace || $removeIfEmpty) {

				if (strstr($str, "<p>{{" . $var . "}}</p>") && substr($replace, 0, 1) == '<' )
				{
					$str = str_replace("<p>{{" . $var . "}}</p>", $replace, $str);
				}
				else if (strstr($str, ">{{" . $var . "}}</p>") && substr($replace, 0, 1) == '<' )
				{
					$str = str_replace("{{" . $var . "}}", strip_tags($replace), $str);
				}
				else
				{
					$str = str_replace("{{" . $var . "}}", $replace, $str);
				}

			}

	  }

	  return $str;

	}

	public function Reset($var){
		$this->{$var} = false;
	}

	public function Add($vars){

		foreach($vars as $var=>$val){

			$this->Set($var, $val);

		}

	}

	public function Set($var,$val){

		$tmp = explode(".", $var);

		if(count($tmp)==1){

			$this->{$tmp[0]} = $val;

		}else if(count($tmp)==2){

			if( isset($this->{$tmp[0]}) && is_object($this->{$tmp[0]}) ){
				$this->{$tmp[0]}->{$tmp[1]} = $val;
			}else{
				$this->{$tmp[0]}[$tmp[1]] = $val;
			}

		}else if(count($tmp)==3){

			if( is_object($this->{$tmp[0]} ?? '') ){
				$this->{$tmp[0]}->{$tmp[1]}->{$tmp[2]} = $val;
			}else{
				$this->{$tmp[0]}[$tmp[1]][$tmp[2]] = $val;
			}

		}

	}

	public function Append($var,$val){

		$tmp = explode(".", $var);

		if(count($tmp)==1){

				$this->{$tmp[0]} ?? $this->{$tmp[0]} = '';
				$this->{$tmp[0]} .= $val;

		}else if(count($tmp)==2){
				
				$this->{$tmp[0]}[$tmp[1]] ?? $this->{$tmp[0]}[$tmp[1]] = '';
				$this->{$tmp[0]}[$tmp[1]] .= $val;

		}else if(count($tmp)==3){

				$this->{$tmp[0]}[$tmp[1]][$tmp[2]] ?? $this->{$tmp[0]}[$tmp[1]][$tmp[2]] = '';
				$this->{$tmp[0]}[$tmp[1]][$tmp[2]] .= $val;

		}

	}


	public function Push($var,$val){

		if(!$val) return;

		$tmp = explode(".", $var);

		if(count($tmp)==1){

			if(!$this->{$tmp[0]}) $this->{$tmp[0]}=array();
			array_push($this->{$tmp[0]}, $val);

		}else if(count($tmp)==2){

			if(!$this->{$tmp[0]}[$tmp[1]]) $this->{$tmp[0]}[$tmp[1]]=array();
			array_push($this->{$tmp[0]}[$tmp[1]], $val);

		}else if(count($tmp)==3){

			if(!$this->{$tmp[0]}[$tmp[1]][$tmp[2]]) $this->{$tmp[0]}[$tmp[1]][$tmp[2]]=array();
			array_push($this->{$tmp[0]}[$tmp[1]][$tmp[2]], $val);

		}

	}

	public function Merge($var,$vals){

		if(is_array($vals)){
			foreach($vals as $val){
				$this->Push($var,$val);
			}
		}

	}

	public function Get($var, $convert = true)
	{

		$var = str_replace(array("{","}"), "", $var);

		$tmp = explode(".", $var);

		$val = '';

		if(count($tmp)==1){

			$val = $this->{$tmp[0]} ?? '';

		}else if(count($tmp)==2){

			if( isset($this->{$tmp[0]}) && is_object($this->{$tmp[0]}) ){
				$val = $this->{$tmp[0]}->{$tmp[1]};
			}else{
				$val = $this->{$tmp[0]}[$tmp[1]] ?? '';
			}

		}else if(count($tmp)==3){
			
			if( isset($this->{$tmp[0]}) && is_object($this->{$tmp[0]}) ){
				$val = $this->{$tmp[0]}->{$tmp[1]}->{$tmp[2]};
			}else{
				$val = $this->{$tmp[0]}[$tmp[1]][$tmp[2]] ?? '';
			}

		}

		if(is_string($val) && $convert)
		{
			if(strstr($val, "{{"))
			{
				return STAN::Vars()->Replace($val);
			}
			else
			{
				return $val;
			}
		}
		else
		{
			return $val;
		}

	}

}
