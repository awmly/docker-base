<?php

function mkclassname($string) {

	$string = str_replace(array("-", "_", ":"), " ", $string);
  $string = ucwords($string);
  $string = str_replace(" ", "", $string);

  return $string;

}

function mkfilename($file,$allowSlash=false,$allowCaps=false,$allowCurly=false,$allowDots=false){ // MAKE FILENAME

	if(!$allowSlash) $file=str_replace("/","-",$file);
	if(!$allowCurly) $file=str_replace("{","",$file);
	if(!$allowCurly) $file=str_replace("}","",$file);
	if(!$allowDots)  $file=str_replace(".","",$file);

	$file=str_replace(" ","-",$file);
	$file=str_replace("&#39;","",$file);
	$file=str_replace("&#039;","",$file);
	$file=preg_replace("/[^A-Za-z0-9\\.\\}\\{\\/\\_\\-]/i", "", $file);
	$file=str_replace("-amp-","-and-",$file);
	$file=str_replace("---","-",$file);
	$file=str_replace("--","-",$file);
	$file=stripslashes($file);
	if(!$allowCaps) $file=strtolower($file);
	return $file;

}

function mkparamname($file){ // MAKE FILENAME

	if(empty($allowSlash)) $file=str_replace("/","-",$file);

	$file=str_replace(" ","_",$file);
	$file=str_replace("&#39;","",$file);
	$file=str_replace("&#039;","",$file);
	$file=preg_replace("/[^A-Za-z0-9\\,\\.\\-\\_]/i", "", $file);
	$file=stripslashes($file);
	$file=strtolower($file);
	return $file;

}

function mkurl($string) {

 	$string = preg_replace("/[^A-Za-z0-9\\:\\@\\%\\/\\|\\&\\;\\+\\.\\,\\-\\ \\_]/i", "",	$string );

	return $string;

}

function dateConvert($date,$formatin,$formatout){

		$time=mkunixtime($date,$formatin);

		$date=mkdate($time,$formatout);

		return $date;

}

function mkdate($time,$format){

	if($format=='timedate') $date=date("H:i jS M Y",$time);

	if($format=='date') $date=date("jS M Y",$time);

	if($format=='picker') $date=date("d/m/Y",$time);

	if($format=='fulldate') $date=date("l jS F Y",$time);

	if($format=='time') $date=date("H:i",$time);

  if($format=='shorttimedate') $date=date("H:i - d/m/Y",$time);

	if($format=='mmm-yy') $date=date("F y",$time);

	if($format=='dmY') $date=date("d/m/Y",$time);

	if($format=='dow') $date=date("l",$time);

	return $date;

}

function mkunixtime($date,$format){

	if($date){

		if($format=='d/m/y'){

				$parts=explode("/",$date);
				$date=@mktime(0,0,0,$parts[1],$parts[0],$parts[2]);

		}else if($format=='yyyy-mm'){

				$parts=explode("-",$date);
				$date=@mktime(0,0,0,$parts[1],1,$parts[0]);

		}

	}

	if(!$date) $date=0;

	return $date;

}

function mkkey($max){

	$genkey = '';
	
	for($x=0;$x<$max;$x++){
		$r=rand(0,strlen(RANDOM)-1);
		$genkey.=substr(RANDOM,$r,1);
	}

	return(md5(time().$genkey));
}


function mkpass($max){

	for($x=0;$x<$max;$x++){
		$r=rand(0,strlen(RANDOM)-1);
		$genkey.=substr(RANDOM,$r,1);
	}

	return($genkey);
}
/*
function mkurl($url,$id=0,$prefix=false,$title=false){

	$url=mkfilename($url,true,true);

	if($prefix){
		if(!strstr($url,$prefix)) $url=$prefix.mkfilename($title);
	}

	if(substr($url,0,1)!='/') $url='/'.$url;

	$url=str_replace("//","/",$url);

	$url=explode("/",$url,5);

	if($url[4]) array_pop($url);

	$url=implode("/",$url);

	$x = Item($url,'url');

	if($x && $x->said!=$id) $url=$url."-".rand();

	return $url;
}

function mkslug($slug,$id=0, $satype=false){

	$slug = mkfilename($slug);

	$x=Item($slug, 'slug', $satype);

	if($x && $x->said!=$id) $slug=$slug."-".rand();

	return $slug;
}
*/
