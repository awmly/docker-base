<?php

function configSearch($field,$param,$value){

    $sql = DBQuery("SELECT * FROM collections where sc".$field." like '%\"".$param."\":\"".$value."\"%' or '%\"".$param."\":".$value."%'", "GetSingle");


    if($sql){
        return getConfig($sql->sclink);
    }else{
        return false;
    }

}

function getConfig($link){

    $sql =  DBQuery("SELECT * FROM collections left join collections_containers on collections.scgid=collections_containers.scgid where sclink='".$link."'", "GetSingle");


  if(!$sql) return false;

	$sql->ID=$sql->scid;
	$sql->Link=$link;
	$sql->Title=$sql->scstitle ?? '';
	$sql->Switch=json_decode($sql->scswitch);
	$sql->Labels=json_decode($sql->sclabels);
  $sql->DB=$link;

	return $sql;

}

function getParamFromItem($item, $param){

    $q="SELECT collections_params.scpid, collections_params.scid, collections_params.scpparams, collections_params.scptype FROM collections_params
        left join collections on collections.scid=collections_params.scid
        left join ".tableItems($item->database)." on ".tableItems($item->database).".satype=collections.sclink
        where ".tableItems($item->database).".said=".$item->id." and collections_params.scptitle='".$param."'";

        $sql =  DBQuery($q, "GetSingle");


        if($sql->scpparams)
        {
          $sql->params=json_decode($sql->scpparams);
        }

        return $sql;

}

function getParam($configid,$param){

    if(is_numeric($configid)) $q="SELECT * FROM collections_params where scid=".$configid." and scptitle='".$param."'";
    else $q="SELECT * FROM collections_params left join collections on collections.scid=collections_params.scid where collections.sclink='".$configid."' and collections_params.scptitle='".$param."'";
    $sql =  DBQuery($q, "GetSingle");


	if($sql->scpparams) $sql->Params=json_decode($sql->scpparams);

	return $sql;

}

function getDatabases($ids=false){

    $res=array();

    if($ids) $idsql="where scgid in (".$ids.")"; else $idsql=false;

    $results =  DBQuery("select * from collections ".$idsql." order by sctitle ASC", "GetMulti");

    foreach($results as $data){

		$data->scswitch=json_decode($data->scswitch);
		$data->sclabels=json_decode($data->sclabels);

		array_push($res,$data);

	}

    return $res;

}
