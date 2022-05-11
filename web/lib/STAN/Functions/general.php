<?php

function appvar($file = 'tmp', $c = false, $append = false) {

  $file = PATH_BASE . 'cache/tmp/var-' . $file;

  if (is_file($file) && !is_writable($file)){
    return;
  }

  if ($c) {

    if ($append && is_file($file)) {
      $c = file_get_contents($file) . "\r" . $c;
    }

    $return = file_put_contents($file, $c);

  } else {

    if (is_file($file)) {
      $return = file_get_contents($file);
    }

  }

  return $return;

}

function formatLink($link) {

  if (substr($link, 0, 4) == 'www.')
  {
    $link = 'http://' . $link;
  }

  return $link;

}

function formatTarget($link) {

  $link = formatLink($link);

  if (strstr($link, 'http://') || strstr($link, 'https://') || strstr($link, 'www.'))
  {
    return '_blank';
  }
  else
  {
    return '_self';
  }

}

function consoleLog($msg) {

  if ($_ENV['CLI']) {
    echo $msg . "\n";
  } else {
    echo "<code>" .$msg . "</code><br/>";
  }

}

function logfile($c, $file = 'tmp', $append = true) {

  $c = date("d-m H:i:s") . ' - ' . PROCESS_ID . ' - ' . $c;

  $file = PATH_PUBLIC . 'cache/tmp/log-' . $file;

  if (is_file($file) && !is_writable($file)){
    return;
  }

  if ($append && is_file($file)) {
    $c = file_get_contents($file) . "\r" . $c;
  }

  file_put_contents($file, $c);

}

function concat($array, $seperator = " ") {

  return implode($seperator, array_filter($array));

}

function append($var, $val, $seperator = " ") {

  if (!$val) return $var;

  if ($var) $var .= $seperator;

  $var .= $val;

  return $var;

}


function dump($var) {

  $highlight = highlight_string('<?php ' . var_export($var, true) . ' ?>', true);

  echo str_replace(array('&lt;?php&nbsp;', '?&gt;'), '', $highlight);

}

function aToButton($text) {

  return str_replace(array("<a","</a>"), array("<span","</span>"), $text);

}

function parseStringOptions($str) {

  $parsedString = false;

  preg_match("/\[(.*)\]/iU", $str, $match);

  if ($match[1]) {

    $options = parseOptions($match[1]);

    $parsedString = str_replace($match[0], "", $str);

  }

  return array(
    'options'       => $options,
    'string'        => $parsedString ?: $str
  );

}

function parseOptions($str){

  $options = array();
  $optionStrings = explode(",", $str);

  foreach ($optionStrings as $option) {

    $varVal = explode("=", $option);

    if ($varVal[1]) {
      $options[$varVal[0]] = $varVal[1];
    } else {
      array_push($options, $varVal[0]);
    }

  }

  return $options;

}

function icon($icon, $options = array()) {

  if (strstr($icon, '.svg')) {

    $html = svg($icon, $options);

  } else if ($icon) {

    if ($options['href']) {
      $target = $options['target'] ? " target='" . $options['target'] . "'" : "";
      $html .= "<a href='" . $options['href'] . "'".$target.">";
    }

    $html .= "<i class='material-icons ".$options['class']."'>".$icon."</i>";

    if ($options['href']) {
      $html .= "</a>";
    }

  }

  return $html;

}

function formatVideoURL(&$video) {
  
  //youtube
   preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $video->video_id, $match);
   if($match){
     $id = $match[1];

     $video->view_url = $video->embed_url = "https://www.youtube.com/";

     $video->view_url .= "watch?v=" . $id;

     $video->embed_url .= "embed/" . $id . "?rel=0";

     $video->image_url = "https://img.youtube.com/vi/" . $id . "/" . ($youtube_image ?? 'hqdefault') . ".jpg";

   } 
   
   if (!$video->view_url) {
     
     //vimeo
     preg_match("/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i", $video->video_id, $match);
     if($match){

       $id = $match[1];

       $video->view_url = "https://vimeo.com/" . $id;

       $video->embed_url = "https://player.vimeo.com/video/" . $id . "?";
     }
   
   }

   if($video->autoplay)
   {
     $video->embed_url .= "&autoplay=1";
   }

   if (!$video->view_url) {
     $video->view_url = $video->video_id;
     $video->embed_url = false;
   }

   //return $video;

}

/*
<?=svg("svg-test.svg", array(
  'width' 	=> 400,
  'height' 	=> 120,
  'class'		=> 'test',
  'attr'		=> 'onclick="alert(12)"',
  'href'		=> '/test',
  'target'	=> '_blank'
)); ?>
*/
function svg($path, $options = []) {

  $style = '';
  $class = '';
  $attr = '';
  $html = '';

  if (strstr($path, "<svg")) {

    $svg = $path;

  } else {

    $file = PATH_IMAGES . $path;

    if (is_file($file)) {

      $svg = file_get_contents($file);

    }

  }


  if (!empty($options['autosize'])){

   preg_match("/viewBox=\"([0-9\\ ]+)\"/U",$svg,$viewBox);
   $coords = explode(" ",$viewBox[1]);

   $options['width'] = $coords[2];
   $options['height'] = $coords[3];

 }

  if (!empty($options['width'])) {
    $style .= "width:" . $options['width'] . "px;";
  }
  if (!empty($options['height'])) {
    $style .= "height:" . $options['height'] . "px;";
  }
  if (!empty($style)) {
    $style = " style='" . $style . "'";
  }

  if (!empty($options['tooltip'])) {
    $html .= "<div class='has-tooltip inline-block'><div class='tooltip'><span>" . $options['tooltip'] . "</span></div>";
    $options['class'] .= " pointer";
  }

  if (!empty($options['popover'])) {
    $html .= "<div class='has-popover touch-hover inline-block'><div class='popover ".$options['popover_class']."'><span>" . $options['popover'] . "</span></div>";
    $options['class'] .= " pointer";
  }

  if (!empty($options['href'])) {
    $target = $options['target'] ? " target='" . $options['target'] . "'" : "";
    $rel = $options['target'] == '_blank' ? " rel='noopener'" : '';
    $ariaLabel = $options['alt'] ? " aria-label='{$options['alt']}'" : '';
    $html .= "<a href='" . $options['href'] . "'".$target.$rel.$ariaLabel.">";
  }

  if (!empty($options['class'])) {
    $class = " class='" . $options['class'] . "'";
  }

  if(!empty($options['attr'])) {
    $attr = " " . $options['attr'];
  }

  $html .= str_replace("<svg", "<svg" . $style . $class . $attr, $svg);

  if (!empty($options['href'])) {
    $html .= "</a>";
  }

  if (!empty($options['tooltip']) || !empty($options['popover'])) {
    $html .= "</div>";
  }

  return $html;

}


// Output pagespeed and retina ready image
/*
<?=img('images/path-to-image-in-front-end-assets.png', array(
	'href'=>'/url'
	'alt'=>'this will also set the title tag',
	'class'=>'class name'
));?>
*/
function img($src, $attributes = []){

	if(!empty($attributes['href'])){
    $target = $attributes['target'] ? " target='" . $attributes['target'] . "' rel='noopener'" : "";
    $title = $attributes['title'] ? " title='" . $attributes['title'] . "'" : "";
		$anchor = array(
			"<a href='" . $attributes['href'] . "'" . $target . $title . ">",
			"</a>"
		);
	}else{
		$anchor = false;
	}

	$img = "<img ";

	if (!empty($_SESSION['retina']) && $_SESSION['retina']>1) {

		// Get extension
		$ext = "." . Ext($src);

		// Get retina source
		$retinaSrc = str_replace($ext, "-2x" . $ext, $src);

		// If retine image exists - update source
		if (is_file(PATH_IMAGES . $retinaSrc)) {
			$retina = true;
			$src = $retinaSrc;
		}

	}

  if (is_file(PATH_IMAGES . $src) && empty($attributes['width']) && empty($attributes['height']) && empty($attributes['nosizes'])) {

  	// Get image properties
  	$props = getimagesize(PATH_IMAGES . $src);

  	if (!empty($retina)) {

  		// Add width/height tags
  		$attributes['width'] = floor($props[0]/2);
  		$attributes['height'] = floor($props[1]/2);

  	}else{

  		// Add width/height tags
  		$attributes['width'] = $props[0] ?? '';
  		$attributes['height'] = $props[1] ?? '';

  	}

  }

	// Set title based on alt
	if (empty($attributes['title'])) {
    $attributes['title'] = $attributes['alt'] ?? '';
  }

  // Set src
  if (!empty($attributes['delay'])) {
    $delay = 'delay';
    if (getVar("App.server") == 'LOCAL' || Ext($src) == 'svg') {
      $attributes['class'] .= ' delay';
    }
  } else {
    $delay = '';
  }

  $loading = '';
  if(empty($attributes['nolazy'])){
    $loading = ' loading="lazy"';
  }
  
  $img .= $delay . "src='" . getVar("App.public_dir") . "images/" . $src . "'" . $loading;

	// Set image attributes from passed array
	foreach($attributes as $attribute=>$value){
		$img.=$attribute . "='" . $value . "' ";
	}

	$img.=" />";

  if (Ext($src) == 'svg') {
    $html = $img;
  } else {
    $html .= "<picture class='" . $delay . "'>";
      if (getVar("App.server") != 'LOCAL') {
        $html .= "<source " . $delay . "srcset='" . str_replace('.' . Ext($src), ".webp", getVar("App.public_dir") . "images/" . $src) . "' type='image/webp'>";
      }
      $html .= "<source " . $delay . "srcset='" . getVar("App.public_dir") . "images/" . $src . "' type='image/" . Ext($src) . "'>";
      $html .= $img;
    $html .= "</picture>";
  }

	return ($anchor) ? $anchor[0].$html.$anchor[1] : $html;

}

function popup($id) {

  $popup = STAN::Vars()->Get('Popup.' . $id);

  if (!$popup) {
    $popup = Item("popup:" . $id);
    //STAN::Vars()->Set('Popup.' . $id, $popup);
  }

  return $popup;

}

function article($file, $object, $option = array()) {

  $file = str_replace(":", "/", $file);

  $image = $item = $object;

  ob_start();

  if (is_file(PATH_MODULES . str_replace("general/articles/", "content/" . $item->collection . "/", $file)) && $option['collection_article']) {

    include(PATH_MODULES . str_replace("general/articles/", "content/" . $item->collection . "/", $file));

  } else if (is_file(PATH_MODULES . "content/" . $item->collection . "/". $file . ".php") && $option['collection_article']) {

    include(PATH_MODULES . "content/" . $item->collection . "/". $file . ".php");

  } else if (is_file(PATH_MODULES . $file)) {

    include(PATH_MODULES . $file);

  } else if (is_file(PATH_MODULES . "general/articles/" . $file . ".php")) {

    include(PATH_MODULES . "general/articles/" . $file . ".php");

  } else if (is_file(PATH_MODULES . "content/" . $file . ".php")) {

    include(PATH_MODULES . "content/" . $file . ".php");

  } else if (is_file(PATH_MODULES . "content/" . $file . ".article.php")) {

    include(PATH_MODULES . "content/" . $file . ".article.php");
  }

  return ob_get_clean();

}

function snippet($file, $item, $option = array()) {

  $file = str_replace(":", "/", $file);

  ob_start();

  if (is_file(PATH_MODULES . $file)) {
    include(PATH_MODULES . $file);
  } else if (is_file(PATH_MODULES . "general/snippets/" . $file . ".php")) {
    include(PATH_MODULES . "general/snippets/" . $file . ".php");
  } else if (is_file(PATH_MODULES . "content/" . $file . ".php")) {
    include(PATH_MODULES . "content/" . $file . ".php");
  } else if (is_file(PATH_MODULES . "content/" . $file . ".snippet.php")) {
    include(PATH_MODULES . "content/" . $file . ".snippet.php");
  }

  return ob_get_clean();

}

function inc($file, $option = array()) {

  ob_start();
  if (is_file($file)) include($file);
  return ob_get_clean();

}

function wrapper($file, $option) {

  ob_start();
  include(PATH_IMAGES . "wrappers/" . $file);
  $wrapper = ob_get_clean();

  return explode("[MODULE]", $wrapper);

}

function html($string)
{
  return html_entity_decode($string, ENT_QUOTES);
}

function timesToSchema($day, $str){

  if (strpos($str, '-') !== false) {

    $times = explode('-', $str);

    $time1 = date("H:i", strtotime($times[0]));
    $time2 = date("H:i", strtotime($times[1]));

    return ' content="'.$day.' '. $time1 . '-' . $time2 .'"';

  }else{

    return '';

  }
}


function geoSchema($item, $options = array()) {

  $options = array_merge(array(
    'class'         => '',
    'title_tag'     => 'li',
    'show_title'    => true,
    'show_icons'    => true,
    'show_spacer'   => true,
    'show_tel'      => true,
    'show_email'    => true,
    'show_website'  => true,
    'show_map'      => true
  ), $options);

  if($options['show_icons']) {
    $telIcon   = "<i class='material-icons icon-sm mar-right-xs'>phone</i>";
    $emailIcon = "<i class='material-icons icon-sm mar-right-xs'>email</i>";
    $webIcon   = "<i class='material-icons icon-sm mar-right-xs'>launch</i>";
    $mapIcon   = "<i class='material-icons icon-sm mar-right-xs'>place</i>";
  }

  $html = "<section itemscope itemtype='http://schema.org/LocalBusiness' class='".$options['class']."'>";

  if($options['show_title'] && $options['title_tag'] != 'li') $html .= "<".$options['title_tag']." itemprop='legalName'>" . $item->title . "</".$options['title_tag'].">";

  $html .= "<ul class='schema' itemprop='address' itemscope itemtype='http://schema.org/PostalAddress'>";

  if($options['show_title'] && $options['title_tag'] == 'li') $html .= "<li itemprop='legalName'>" . $item->title . "</li>";

  $html .= "<li itemprop='streetAddress'>" . $item->address . "</li>";
  if($item->address2) $html .= "<li itemprop='streetAddress'>" . $item->address2 . "</li>";
  if($item->city)     $html .= "<li itemprop='addressLocality'>" . $item->city . "</li>";
  if($item->county)   $html .= "<li itemprop='addressRegion'>" . $item->county . "</li>";
  if($item->postcode) $html .= "<li itemprop='postalCode'>" . $item->postcode . "</li>";

  if($options['show_spacer'])                          $html .= "<li><div class='space-xs'></div></li>";
  if($item->tel && $options['show_tel'])               $html .= "<li>" . $telIcon . "<a href='tel:" . $item->tel . "' itemprop='telephone'>" . $item->tel . "</a></li>";
  if($item->email && $options['show_email'])           $html .= "<li>" . $emailIcon . "<a href='mailto:" . $item->email . "' itemprop='email'>" . $item->email . "</a></li>";
  if($item->website && $options['show_website'])       $html .= "<li>" . $webIcon . "<a href='" . $item->website . "' target='_blank' rel='noopener' itemprop='website'>View Website</a></li>";
  if($item->google_maps_link && $options['show_map'])  $html .= "<li>" . $mapIcon . "<a href='" . $item->google_maps_link . "' target='_blank' rel='noopener'>View Map</a></li>";
  $html .= "</ul>";

  $html .= "</section>";

  return $html;

}

function geoAddress($item, $divide = ", ") {

  $address = $item->address;
  if($item->address2) $address .= $divide . $item->address2;
  if($item->city)     $address .= $divide . $item->city;
  if($item->county)   $address .= $divide . $item->county;
  if($item->postcode) $address .= $divide . $item->postcode;
  if($item->country)  $address .= $divide . $item->country;

  return $address;

}

function geoContact($item, $divide = "<br/>") {

  $contact = '';
//echo $item->google_maps_link.'--';
  if($item->tel)              $contact .= $divide . "<i class='material-icons icon-sm'>phone</i> " . $item->tel;
  if($item->mobile)           $contact .= $divide . "<i class='material-icons icon-sm'>phone</i> " . $item->mobile;
  if($item->email)            $contact .= $divide . "<i class='material-icons icon-sm'>email</i> <a href='mailto:" . $item->email . "'>" . $item->email . "</a>";
  if($item->website)          $contact .= $divide . "<i class='material-icons icon-sm'>launch</i> <a href='" . $item->website . "' target='_blank' rel='noopener'>View Website</a>";
  if($item->google_maps_link) $contact .= $divide . "<i class='material-icons icon-sm'>place</i> <a href='" . $item->google_maps_link . "' target='_blank' rel='noopener'>View Map</a>";

  return substr($contact, strlen($divide));

}

function _ago($time)
{

  $nextminute = time() + 60;
  $nexthour = time() + (60 * 60);
  $nextday = time() + (60 * 60 * 24);
  $thisweek = time() + (60 * 60 * 24 * 7);
  $nextweek = time() + (60 * 60 * 24 * 14);
  $thismonth = time() + (60 * 60 * 24 * 30);
  $nextmonth = time() + (60 * 60 * 24 * 30);

  $minute = time() - 60;
  $hour = time() - (60 * 60);
  $day = time() - (60 * 60 * 24);
  $week = time() - (60 * 60 * 24 * 7);
  $lastweek = time() - (60 * 60 * 24 * 14);
  $month = time() - (60 * 60 * 24 * 30);
  $lastmonth = time() - (60 * 60 * 24 * 30);

  if($time > $nextmonth)
  {
    $string = _date($time);
  }
  else if($time > $thismonth)
  {
    $string = "next month";
  }
  else if($time > $nextweek)
  {
    $string = "this month";
  }
  else if($time > $thisweek)
  {
    $string = "next week";
  }
  else if($time > $nextday)
  {
    $days = round(((($time - time()) / 60) / 60) / 24);
    $string = "in " . $days . " day" . ($days>1 ? "s" : "");
  }
  else if($time > $nexthour)
  {
    $hours = round((($time - time()) / 60) / 60);
    $string = "in " . $hours . " hour" . ($hours>1 ? "s" : "");
  }
  else if($time > $nextminute)
  {
    $minutes = round(($time - time()) / 60);
    $string = "in " . $minutes . " minute" . ($minutes>1 ? "s" : "");
  }
  else if($time > time())
  {
    $seconds = $time - time();
    $string = "in " . $seconds . " second" . ($seconds>1 ? "s" : "");
  }
  else if($time == time())
  {
    $string = "now";
  }
  else if($time > $minute)
  {
    $seconds = time() - $time;
    $string = $seconds > 1 ? $seconds . " seconds ago" : $seconds . " second ago";
  }
  else if($time > $hour)
  {
    $mins = round((time() - $time) / 60);
    $string = $mins > 1 ? $mins . " minutes ago" : $mins . " minute ago";
  }
  else if($time > $day)
  {
    $hours = round(((time() - $time) / 60) / 60);
    $string = $hours > 1 ? $hours . " hours ago" : $hours . " hour ago";
  }
  else if($time > $week)
  {
    $days = round((((time() - $time) / 60) / 60) / 24);
    $string = $days > 1 ? $days . " days ago" : $days . " day ago";
  }
  else if($time > $lastweek)
  {
    $string = "last week";
  }
  else if($time > $month)
  {
    $string = "this month";
  }
  else if($time > $lastmonth)
  {
    $string = "last month";
  }
  else
  {
    $string = _date($time);
  }

  return $string;

}

function _date($time, $format = 'full')
{

  if(!$time) return;

  switch ($format){

    case  'full':
          $date = 'jS F Y'; break;

    case  'full time':
          $date = 'H:i jS F Y'; break;

    case  'short':
          $date = 'jS M Y'; break;

    case  'short time':
          $date = 'H:i jS M Y'; break;

    case  'time':
          $date = 'H:i'; break;

    case  'picker':
          $date = 'd/m/Y'; break;

    case  'picker-alt':
          $date = 'Y-m-d'; break;

    case  'dob':
          $date = 'd F Y'; break;

  }

  return date($date, $time);

}

function _time($date, $format, $type = 'start')
{

  // Set hours, minutes and seconds
  if($type == 'start')
  {
    $hour = $minute = $second = 0;
  }
  else
  {
    $hour = 23;
    $minute = $second = 59;
  }

  // Make time
  if($format == 'picker')
  {
    if(strstr($date, "-"))
    {
      $parts = explode("-", $date);
      $time = mktime($hour, $second, $minute, $parts[1], $parts[2], $parts[0]);
    }
    else
    {
      $parts = explode("/", $date);
      $time = mktime($hour, $second, $minute, $parts[1], $parts[0], $parts[2]);
    }

  }

  return $time;

}

function _dateFromTo($start, $finish, $day = 'j', $month = 'F', $year = 'Y', $seperator = '-') {

  $startDay = date($day, $start);
  $startMonth = date($month, $start);
  $startYear = date($year, $start);
  $finishDay = date($day, $finish);
  $finishMonth = date($month, $finish);
  $finishYear = date($year, $finish);

  if ($startDay == $finishDay && $startMonth == $finishMonth && $startYear == $finishYear) {

    return $finishDay . " " . $finishMonth . " " . $finishYear;

  } else if ($startMonth == $finishMonth && $startYear == $finishYear) {

    return $startDay . $seperator . $finishDay . " " . $finishMonth . " " . $finishYear;

  } else if ($startYear == $finishYear) {

    return $startDay . " " . $startMonth . $seperator . $finishDay . " " . $finishMonth . " " . $finishYear;

  } else {

    return $startDay . " " . $startMonth . " " . $startYear . $seperator . $finishDay . " " . $finishMonth . " " . $finishYear;

  }

}

function tableItems($type){

  $items = getVar('Config.tableItems');

  foreach($items as $item => $table)
  {
    if(matchPattern($type, $item)) return $table;
  }

  return 'items';

}

function tableData($type){

  $datas = getVar('Config.tableData');

  foreach($datas as $data => $table)
  {
    if(matchPattern($type, $data)) return $table;
  }

  return 'data';

}

function tableLinks($type)
{

  $links = getVar('Config.tableLinks');

  foreach($links as $link => $table)
  {
    if(matchPattern($type, $link)) return $table;
  }

  return 'links';

}

function matchPattern($subject, $pattern)
{
  if(preg_match("/^(" . $pattern . ")$/i", $subject))
  {
    return true;
  }
  else
  {
    return false;
  }
}


function DateToStamp($date){
	$parts=explode("/",$date);

	return mktime(0,0,0,$parts[1],$parts[0],$parts[2]);
}

function GetContents($file){
  if(is_file($file)){
	   return trim(file_get_contents($file,FILE_USE_INCLUDE_PATH));
  }
}

function AZ($str, $lowercase = false, $allowdots = false){
	$str=str_replace(" ","_",$str);
	if($lowercase) $str=strtolower($str);

  if(!$allowdots)
  {
    $str = preg_replace("/[\\.]/i", "", $str);
  }

	return preg_replace("/[^A-Za-z0-9\\.\\_]/i", "", $str);
}

function numberOnly($str){
	return preg_replace("/[^0-9]/i", "", $str);
}

function floatOnly($str){
	return preg_replace("/[^0-9\\.\\,]/i", "", $str);
}

function Strip($txt,$tags=array()){
	return str_replace($tags,"",$txt);
}

function SAE($txt){

    $txt = ucwords(str_replace(array("_","-")," ",$txt));

    return str_replace(['Url', 'Id'], ['URL', 'ID'], $txt);

}

function curl($url){

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
	return curl_exec($ch);

}





function array_sort_by_column(&$arr, $col, $dir = SORT_ASC) {
    $sort_col = array();
    foreach ($arr as $key=> $row) {
        $sort_col[$key] = $row[$col];
    }

    array_multisort($sort_col, $dir, $arr);

	return $arr;
}

function arrsrch($array,$key,$value){

	foreach($array as $id=>$a){
		if(is_array($a)){
			if($a[$key]==$value) return $id;
		}else{
			if($a->{$key}==$value) return $id;
		}
	}

	return -1;
}



function BytesToBlock($bytes,$force='tb'){

	$block=array('b','kb','mb','gb','tb');

  $i=0;
  $blocksize=false;
	while($blocksize==false){

		if((floor($bytes/1024)==0) || $block[$i]==$force){ $blocksize=round($bytes,2); $blockunit=$block[$i]; }else{ $bytes=$bytes/1024; }
		$i++;

		//stop endless loop
		if($i==10) return $bytes;

	}

	return $blocksize.$blockunit;

}

function stringAfter($string, $split) {

  if (strstr($string, $split)) {
    return substr(strrchr($string,$split),1);
  }else {
    return $string;
  }

}

function Ext($file){

  return strtolower(substr(strrchr($file,"."),1));

}

function explodeLast($deliminator, $string) {

  $parts = explode($deliminator, $string);

  return end($parts);

}


function pregStr($str,$start,$end){

		preg_match("/".$start."(.*)".$end."/U",$str,$match);

		return $match[1] ?? '';

}


function cutstr($string,$start,$end){
	$string = " ".$string;
	$ini = strpos($string,$start);
	if ($ini == 0) return "";
	$ini += strlen($start);
	$len = strpos($string,$end,$ini) - $ini;
	return substr($string,$ini,$len);
}





function clean($v){
	$v=preg_replace("/[^A-Za-z0-9\\_\\ \\&\\!\\(\\)\\-]/i", "", $v);
	return $v;
}

function hex2rgb($hex) {
   $hex = str_replace("#", "", $hex);

   if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
   } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
   }
   $rgb = array($r, $g, $b);
   //return implode(",", $rgb); // returns the rgb values separated by commas
   return $rgb; // returns an array with the rgb values
}

function getDistance($lat1, $lng1, $lat2, $lng2, $unit='m'){

  if( !is_numeric($lat1) || !is_numeric($lat2) || !is_numeric($lng1) || !is_numeric($lng2) ) return 9999999999999999;

  // Calculate
  $theta = $lng1 - $lng2;
  $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
  $dist = acos($dist);
  $dist = rad2deg($dist);
  $miles = $dist * 60 * 1.1515;

  // Set units
  if ($unit == "k") 			$dist=$miles*1.609344; 	// Kilometres
  else if($unit == "n") 	$dist=$miles*0.8684; 		// Nautical Miles
  else 										$dist=$miles;						// Miles

  // Return
  return $dist;

}

function getCliOptions(){
  $args = (object)[];
  $argv = $_SERVER['argv'];
  foreach ($argv as $arg) {
      if (preg_match('/^--([^=]+)=(.*)/', $arg, $match)) {
          $args->{$match[1]} = $match[2];
      }
  }
  return $args;
}

function mkhandle($str){
  $str = str_replace(['/', ':'], '-', $str);
  $str = trim($str, '-');
  return $str;
}

if(!function_exists('str_starts_with')){
  function str_starts_with($haystack, $needle){
      return substr($haystack, 0, strlen($needle)) === $needle;
  }
}

if(!function_exists('str_contains')){
  function str_contains($haystack, $needle){
      return (strpos($haystack, $needle) !== false);
  }
}
