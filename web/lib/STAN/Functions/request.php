<?php

function sa_br2nl($v){
  $v=str_replace(array("<br/>","<br />", "&lt;br /&gt;", "&lt;br/&gt;"), "\r\n", $v);
  return $v;
}

function sa_nl2br($v, $delimiter = "<br/>"){
  $v=str_replace(array("\r\n", "\n\r", "\r", "\n"), $delimiter, $v);
  return $v;
}


function sa_get($x,$return=false){ // GET MIXED CHAR STRING FROM GET/POST


  $v=$_REQUEST[$x];

  // if(get_magic_quotes_gpc()==1) $v=stripslashes($v);
  $v=trim($v);
  $v=htmlentities($v,ENT_QUOTES,"utf-8");
  $v=sa_nl2br($v);
  $v=stripslashes($v);

  //STUPID WORD CHARS ‘ ’ “ ” -
  $v=str_replace("&amp;#8217;","&#39;",$v);
  $v=str_replace("&amp;#8216;","&#39;",$v);
  $v=str_replace("&amp;#8220;",'"',$v);
  $v=str_replace("&amp;#8221;",'"',$v);
  $v=str_replace("&amp;#8211;","-",$v);
  $v=str_replace("&amp;#8226;","&bull;",$v);
  $v=str_replace("&amp;#8230;","...",$v);

  return $v;

}

function sa_getcms($x,$return=false){

  $v=$_REQUEST[$x];
  $v=str_replace(array("\r\n", "\n\r", "\r", "\n"), "", $v);

  if(get_magic_quotes_gpc()==1) $v=stripslashes($v);

  //$v=htmlentities($v,ENT_QUOTES,"utf-8");
  $v=str_replace("'","&#39;",$v);
  $v=stripslashes($v);

  return $v;

}
