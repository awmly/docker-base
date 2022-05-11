<?php

function material ($component, $option = [])
{
  $file = PATH_BACKEND . 'modules/components/material/' . $component . '.php';
  if (is_file($file))
  {
    include ($file);
  }
}

function formatOptions($options)
{
  $_options = [];

  foreach ($options as $value => $display)
  {
    $_options[] = ['value' => $value, 'display' => $display];
  }

  return $_options;
}

function checkDB(){

  if(getVar('App.server') != 'LOCAL' || !$_ENV['SYNC_MYSQL'] || $_ENV['IS_BASE']) return;

  $cache = STAN::Cache();

  $cache->setMd5();

  $remoteMD5 = \STAN\Utils\HTTP::curl(getVar("App.remote_url") . '/module/scripts:ajax:md5/async');

  if($remoteMD5 != $cache->md5){
    // print("<div class='alert alert-danger'>
    //     <button type='button' class='close-alert'>×</button>
    //       Local database is out of sync
    //       <br/><code class='shell'>base db synclocal</code>
    // </div>");
    material('alert-error', [
      'message' => "Local database is out of sync<br/><code class='shell'>base db synclocal</code>"
    ]);
  }

}


function DigItems($param=array(), $links=array(), $json=array()){

    $items = Search()
            ->setCollection($param["database"])
            ->setParams($param)
            ->setFilters($links)
            ->setFilterLogic('and')
            ->setOption('debug', $param['debug'] ?? '')
            ->get();

    foreach($items as $item){

      $param['parent'] = $item->said;

      $item->Children = DigItems($param, $links, $json);

    }

    return $items;

}

function DisplayItems($items,$options){

    foreach($items as $item)
    {
      include(PATH_BACKEND . "modules/components/list-displays/" . $options['display']);
    }

}


function SAUpdateModules($group,$id,$deleteOld=false){

  $scripts = array_diff(scandir(PATH_MODULES.$group."/"), array('..', '.', '.DS_Store'));
	foreach($scripts as $type){

    //echo "OK -> $group $type <br/>";

	    $x=DBQuery("SELECT * FROM collections where scgid=$id and sclink='".$group.":".$type."'", "GetNumRows");

	    //$json='{"active_super_admin":1,"active_admin":1,"nav_super_admin":0,"nav_admin":0}';

	    if(!$x) DBQuery("INSERT INTO collections VALUES (null,1,$id,99,'".$group.":".$type."','".ucwords($type)."','$json','')");

	    $modules = array_diff(scandir(PATH_MODULES.$group."/".$type), array('..', '.', '.DS_Store'));

	    foreach($modules as $module){

	        if(is_file(PATH_MODULES.$group."/".$type."/".$module)){

				$instance=str_replace(".php","",$module);

				$x=DBQuery("SELECT * FROM items_modules where satype='".$group.":".$type."' and satitle='$instance'", "GetNumRows");

				if( !$x && !strstr($module,".include.php") && !strstr($module,".inc.php") && !strstr($module,".ini") ){
                    DBInsert('items_modules',array(
                      'satype'=>$group.":".$type,
                      'satitle'=>$instance,
                      'salive'=>2
                    ));
                }

	        }


	    }

	}



  if($deleteOld){

    $query_string="SELECT * FROM collections where scgid=$id";
    $res=DBArray($query_string);
    foreach($res as $rs){

      $scid=$rs['scid'];
      $scord=$rs['scord'];
      $type=$sclink=$rs['sclink'];

      if( !is_dir(PATH_MODULES.str_replace(":", "/", $type)) ){
        DBQuery("DELETE FROM collections where scid=".$scid);
        //echo PATH_MODULES.$group."/".$type."<br/>";
      }


      $query_string2="SELECT * FROM items_modules where satype='".$type."'";
      $res2=DBArray($query_string2);
      foreach($res2 as $rs2){

          $zsatitle=$rs2['satitle'];
          $zsaid=$rs2['said'];

          if( !is_file(PATH_MODULES.str_replace(":", "/", $type)."/".$zsatitle.".php") ){
            DBQuery("DELETE FROM items_modules where said=".$zsaid);
            //echo PATH_MODULES.$group."/".$type."/".$zsatitle.".php<br/>";
          }

      }

    }

  }

}

function DBArray($query){

  $db = new \STAN\Utils\Database\Query;

  $results = $db->Query($query)->GetMulti('array');

  if($results){
    return $results;
  }else{
    return array();
  }

}

function statusLabel($id) {

  $statusTitle = STAN::Status()->getTitle($id);

  return "<span class='status status-" . mkfilename($statusTitle) . "'>" . $statusTitle . "</span>";

}
