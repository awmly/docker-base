<?php

function Encode($str, $prefix = false) {

    $key=$_ENV['ENCRYPTION_KEY'];

    $hash=$cnt=NULL;

    if (!$str) return;

    if(is_array($str)) $str=json_encode($str);

    for ($i=0;$i<strlen($str);$i++) {

        $hash.=chr(ord(substr($str,$i,1))+ord(substr($key,$cnt,1)));

        $cnt=(strlen($key)-1==$cnt) ? 0 : $cnt+1;

    }

    // return url safe hash
    $hash = str_replace(array('/','+','='),array('_','-',''),base64_encode($hash));

    if ($prefix) {
      $hash = 'Enc::' . $hash;
    }

    return $hash;

}

function Decode($hash,$array=false) {

    $key=$_ENV['ENCRYPTION_KEY'];

    $str=$cnt=NULL;

    if (!$hash) return;

    $hash = str_replace("Enc::", "", $hash);

    // revert url safe chars
    $hash=base64_decode(str_replace(array('_','-'),array('/','+'),$hash));

    for($i=0;$i<strlen($hash);$i++){

        $str.=chr(ord(substr($hash,$i,1))-ord(substr($key,$cnt,1)));

        $cnt=(strlen($key)-1==$cnt) ? 0 : $cnt+1;

    }

    if($array) $str=json_decode($str,true);

    return $str;

}

function MakeHash($pass,$salt){

    // Encrypt the string and salt using sha512
    $hash=crypt($pass,'$6$rounds=10$'.Decode($salt).'$');

    // return
    return Encode($hash);

}

function CheckHash($hash,$pass,$salt){

    if($hash==MakeHash($pass,$salt)) return true; else return false;

}
