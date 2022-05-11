<?php

function replaceHeadings($text) {

  // $text = str_replace("<h1>", "<div class='heading-h1 wf-text'>", $text);
  // $text = str_replace("<h2>", "<div class='heading-h2 wf-text'>", $text);
  // $text = str_replace("<h3>", "<div class='heading-h3 wf-text'>", $text);
  // $text = str_replace("<h4>", "<div class='heading-h4 wf-text'>", $text);
  // $text = str_replace("<h5>", "<div class='heading-h5 wf-text'>", $text);
  // $text = str_replace("<h6>", "<div class='heading-h6 wf-text'>", $text);

  // $text = str_replace(["</h1>", "</h2>", "</h3>", "</h4>", "</h5>", "</h6>"], "</div>", $text);

  return $text;

}

function linkTarget($link) {
  if (substr($link,0,4) == 'http') {
    return '_blank';
  } else {
    return;
  }
}

function articleOptions($item, $option) {

  // Set class
  $class = $option['article_class'] . " " . $item->article_class;

  // Set attr
  $attr = $option['article_attr'] . " " . $item->article_attr;

  // Set link
  $link = $item->custom_url ?: ($item->url ?: $item->JSON->link);

  // Prefix
  if ($option['link_prefix']) {
    $link = $option['link_prefix'] . $link;
  }

  // Suffix
  if ($option['link_suffix']) {
    $link = $link . $option['link_suffix'];
  }

  if ($link && is_string($link)) {
    if (strstr($link, 'http://')) $target = " target='_blank'";
    $link_start   = "<a href='".$link."'".$target." class='no-style'".$option['link_attr'].">";
    $link_end     = "</a>";
    $class        .= " has-hover hover-btn";
  }


  // Set text
  if (!$option['article_param']) $option['article_param'] = 'excerpt';
  $text = $option['article_html'] ?: ($item->text->{$option['article_param']} ?:($item->text->banner ?: ($item->text->html ?: $item->title)));

  if ($item->isItem) {
    $text = $item->replaceVars($text);
  }


  // Remove a links from text if there is a wrapper link
  if ($link_start) {
    $text = aToButton($text);
  }

  return array(
    'text'        => $text,
    'link_start'  => $link_start,
    'link_end'    => $link_end,
    'link'        => $link,
    'class'       => $class,
    'attr'        => $attr
  );

}

function displayText($item, $text, $return = false, $additionalHtml = false){

  if ($additionalHtml && !empty($item->text->$text))
  {
    $item->text->$text = "<div class='text-holder'>" . $item->text->$text . "</div>";
  }
  
  $output = replaceVars(($item->text->$text ?? '') . $additionalHtml, true);

  $outputCheck = STAN\Utils\TinyMCE\TinyMCE::output($output);
  
  if ($outputCheck == '' || strip_tags($outputCheck) == 'null' || strip_tags($outputCheck) == 'blank')
  {
    $output = false;
  }

  $output = str_replace([
    '<h1></h1>',
    '<h2></h2>',
    '<h3></h3>',
    '<h4></h4>',
    '<h5></h5>',
    '<h6></h6>',
    '<p></p>',
  ], '', $output);

  $html = '';
  $background = '';
  
  if ($output)
  {
    $textModule = $item->links("text_" . $text . "_module", true, false, 'text')->single();
    if ($textModule)
    {
      $textModule->text->html = $output;
      $html = Module($textModule, [
        'return' => true
      ]);
    }
    else
    {
      if (!empty($item->text->{$text."_background"}))
      {
        $background = $item->text->{$text."_background"};
        
        if (!empty($item->text->{$text."_opacity"}))
        {
          //$background = str_replace('bg-', 'bga' . $item->text->{$text."_opacity"} . '-', $background);
          $background .= " bg-opacity-" .  $item->text->{$text."_opacity"};
        }

        //$background .= " cms-pad-text";

      }
      if (!empty($item->text->{$text."_padding"}))
      {
        $background .= ' pad-text';
      }
      if (!empty($item->text->{$text."_foreground"}))
      {
        $background .= ' ' . $item->text->{$text."_foreground"};
      }
      if (!empty($item->text->{$text."_constrain"}))
      {
        $background .= ' constrain-text';
      }
      if (!empty($item->text->{$text."_flex"}))
      {
        $background .= ' cms-flex cms-' . $item->text->{$text."_flex"};
      }

      if (!empty($item->text->{$text."_width"}))
      {
        $background .= ' ' . $item->text->{$text."_width"};
      }

      $proseClass = 'prose md:prose-lg max-w-none';
      $prose = '';

      if(!str_contains($output, 'data-module')){

        $prose = $proseClass;
        
      }
      else{
        
        $dom = new DomDocument();
        //wrapper root div added becuase libxml_html options only work properly with single root element
        $dom->loadHTML("<div>{$output}</div>", LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD); 

        $currentNodes = [];
        $childNodes = $dom->documentElement->childNodes;

        for ($i=0; $i < $childNodes->length; $i++){

          $node = $childNodes->item($i);

          if(!isModule($node)){
            $currentNodes[] = $node;
          }

          if(!isModule($node) && ($i + 1 >= $childNodes->length || isModule($childNodes->item($i + 1)))){
            //wrap current elements in div with prose class
            $wrapper = $dom->createElement('div');
            $wrapper->setAttribute('class', $proseClass);
            $node->parentNode->replaceChild($wrapper, $node);

            foreach($currentNodes as $currentNode){
              $wrapper->appendChild($currentNode);
            }

            //multiple elements changed to single parent element so need to change index
            $i -= count($currentNodes) - 1;
            $currentNodes = [];
          }

        }

        //remove root div and add children back
        $container = $dom->getElementsByTagName('div')->item(0);
        $container = $container->parentNode->removeChild($container);
        while ($container->firstChild) {
          $dom->appendChild($container->firstChild);
        }

        $output = $dom->saveHTML();

      }

      $html = "<div class='cms {$prose} text-".$text." ".($item->text->{$text."_class"} ?? '')." ".$background."'>".$output."</div>";

      if (!empty($item->text->{$text."_url"}))
      {
        $html = "<a class='group' href='".$item->text->{$text."_url"}."'>".aToButton($html)."</a>";
      }
    }
  }

  if($return) return $html; else echo $html;

}

function isModule($node){
  foreach($node->attributes as $attr){
    if(str_contains($attr->name, 'data-module')){
      return true;
    }
  }
  return false;
}

function displayColumns($cnt, $xs, $sm, $md, $lg, $class, $attr, $spacer){

  if ($xs && $xs != 'none') {
    if ($xs == 'constrain') {
      $xs = 1;
      $col_xs = " col-xs-constrain";
    } else if ($xs == 'auto') {
      $col_xs = "col-xs-auto";
    } else {
      $col_xs = "col-xs-" . (12 / $xs);
    }
  }

  if ($sm && $sm != 'none') {
    if ($sm == 'constrain') {
      $sm = 1;
      $col_sm = " col-sm-constrain";
    } else if ($sm == 'auto') {
      $col_sm = "col-sm-auto";
    } else {
      $col_sm = "col-sm-" . (12 / $sm);
    }
  }

  if ($md && $md != 'none') {
    if ($md == 'auto') {
      $col_md = "col-md-auto";
    } else {
      $col_md = "col-md-" . (12 / $md);
    }
  }

  if ($lg && $lg != 'none') {
    if ($lg == 'auto') {
      $col_lg = "col-lg-auto";
    } else {
      $col_lg = "col-lg-" . (12 / $lg);
    }
  }

  $start = '';

  if (!empty($col_xs) || !empty($col_sm) || !empty($col_md) || !empty($col_lg) || !empty($class) || !empty($attr)) {
    if ($col_xs && $col_sm && $col_md && $col_lg && $spacer) $start = displayClears($cnt, $xs, $sm, $md, $lg, $spacer, true);
    $start .= "<div class='col-".$cnt;
    if ($col_xs)  $start .= " " . $col_xs;
    if ($col_sm)  $start .= " " . $col_sm;
    if ($col_md)  $start .= " " . $col_md;
    if ($col_lg)  $start .= " " . $col_lg;
    if ($class)   $start .= " " . $class;
    $start .= "'";
    if ($attr)    $start .= " " . $attr;
    $start .= ">";
    $end = "</div>";
  } else {
    $start = $end = false;
    if ($spacer && $cnt) {
      //$start = "<div class='row-spacer'></div>";
    }
  }

  return array('start' => $start, 'end' => $end);

}

function displayClears($cnt, $xs, $sm, $md, $lg, $spacer = 'row-spacer', $return = false){

  $spacer = 'row-spacer';
  
  if ($xs == 'constrain') {
    $xs = 1;
  }

  if ($sm == 'constrain') {
    $sm = 1;
  }

  if ($xs == 'auto' || $sm == 'auto' || $md == 'auto' || $lg == 'auto') {
    return false;
  }

  $html = '';

  if($cnt){ // && !$Flag['HIDE_CLEARS']

    if($cnt%$xs==0 && $cnt%$sm==0 && $cnt%$md==0 && $cnt%$lg==0) $html = "<div class='" . $spacer . "'></div>";
    else if($cnt%$xs==0 && $cnt%$sm==0 && $cnt%$md==0) $html = "<div class='" . $spacer . " hidden-lg'></div>";
    else if($cnt%$xs==0 && $cnt%$sm==0 && $cnt%$lg==0) $html = "<div class='" . $spacer . " hidden-md'></div>";
    else if($cnt%$xs==0 && $cnt%$md==0 && $cnt%$lg==0) $html = "<div class='" . $spacer . " hidden-sm'></div>";
    else if($cnt%$sm==0 && $cnt%$md==0 && $cnt%$lg==0) $html = "<div class='" . $spacer . " hidden-xs'></div>";
    else{
      if($cnt%$xs==0) $html .= "<div class='" . $spacer . " visible-xs'></div>";
      if($cnt%$sm==0) $html .= "<div class='" . $spacer . " visible-sm'></div>";
      if($cnt%$md==0) $html .= "<div class='" . $spacer . " visible-md'></div>";
      if($cnt%$lg==0) $html .= "<div class='" . $spacer . " visible-lg'></div>";
    }

  }

  if($return) return $html; else echo $html;

}
