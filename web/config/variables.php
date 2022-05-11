<?php

// Applied
define('APLD_IP',            '94.175.202.34');

// Random string used for key generation
define('KEY',                '*kObROsWoWfJguM_awc^_GL23vt4qFGiP?jmOC82d#qkm2andcj=JVXr++amAHv+HFha7=3_8?b?2bm5ew0N^C5#y6fZsAUZ620T');
define('RANDOM',             'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_');
define('PROCESS_ID',         rand(100000, 999999));
define("LOCAL_USER_ID",      1);



// Dates
$DateVars=array(
    'Date.day'            => date("l"),
    'Date.month'          => date("F"),
    'Date.year'           => date("Y"),
    'Date.dmy'            => date('d/m/Y'),
    'Time.hm'             => date('H:i'),
    'Time.now'            => time(),
    'Time.day.start'      => mktime(0,  0,  0,  date('m'),  date('d'),             date('Y')),
    'Time.day.end'        => mktime(23, 59, 59, date('m'),  date('d'),             date('Y')),
    'Time.week.start'     => mktime(0,  0,  0,  date('m'),  date('j')-date('N')+1, date('Y')),
    'Time.week.end'       => mktime(23, 59, 59, date('m'),  date('j')-date('N')+7, date('Y')),
    'Time.month.start'    => mktime(0,  0,  0,  date('m'),  1,                     date('Y')),
    'Time.month.end'      => mktime(23, 59, 59, date('m'),  date('t'),             date('Y')),
    'Time.year.start'     => mktime(0,  0,  0,  1,          1,                     date('Y')),
    'Time.year.end'       => mktime(23, 59, 59, 12,         31,                    date('Y')),
    'Time.30days.ago'     => time() - (60*60*24*30),
    'Time.60days.ago'     => time() - (60*60*24*61),
    'Time.90days.ago'     => time() - (60*60*24*92),
    'Time.180days.ago'    => time() - (60*60*24*183)
);

foreach($DateVars as $var=>$val){

  STAN::Vars()->Set($var, $val);

}

// Fonts
$Fonts=array(
    'Font.bold'=>        "<span class='bold'>",
    'Font.italic'=>      "<span class='italic'>",
    'Font.underline'=>   "<span class='underline'>",
    'Font.lg'=>          "<span class='lg'>",
    'Font.sm'=>          "<span class='sm'>",
    'Font.end' =>        "</span>"
);

foreach($Fonts as $var=>$val){

  STAN::Vars()->Set($var, $val);

}
