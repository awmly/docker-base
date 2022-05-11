<?php

/*
$task = addTask(array(
  'title'     => 'Task for ' . $item->title,
  'item_ref'  => $item->dbid,
  'file_ref'  => 'scripts/shopify/task-run-get-product.php',
  'json'      => ['an' => 'array', 'of' => 'data', 'stored' => 'in ro']
));
*/
function addTask($data) {

  $task = Search()->setCollection('tasks')->setParams(array(
    'title'   => $data['title'],
  ))->get('GetSingle');

  if (!$task || $task->running) {

    if (!$data['date']) $data['date'] = time();

    if ($data['json']) {
      $json = $data['json'];
      unset($data['json']);
    }

    $task = newItem('tasks', $data);

    if ($json) {
      $task->set('ro', $json)->save();
    }

  }

  return $task;

}


function addVar($str, $var = false){

  if (is_array($str)) {

    STAN::Vars()->Add($str);

  }else if ($var) {

    $val = STAN::Vars()->Get($str);

    if (is_array($val)) {
      if (is_array($var)) {
        STAN::Vars()->Merge($str, $var);
      } else if (!in_array($var, $val)) {
        STAN::Vars()->Push($str, $var);
      }
    } else if($val) {
      STAN::Vars()->Append($str, " " . $var);
    } else {
      STAN::Vars()->Set($str, $var);
    }

  }

}

function setVar($str, $var = false){

  if (is_array($str)) {

    STAN::Vars()->Add($str);

  }else{ // if ($var)

    STAN::Vars()->Set($str, $var);

  }

}

function replaceVars($str, $removeIfEmpty = false){

  return STAN::Vars()->Replace($str, $removeIfEmpty);

}

function getVar($var){

  return STAN::Vars()->Get($var);

}

function price($number, $options = array()) {

  return \STAN\Utils\Numbers::price($number, $options);
}

/**
 * Possible methods: Execute, GetInsertID, GetNumRows, GetSingle, GetMulti
 */
function DBQuery($query, $method='Execute'){

  $DB = new \STAN\Utils\Database\Query;
  return $DB->Query($query)->{$method}();

}


function DBInsert($table, $data){

  $DB = new \STAN\Utils\Database\Insert;
  return $DB->Insert($table, $data);

}


function DBUpdate($table, $data, $conditions){

  $DB = new \STAN\Utils\Database\Update;
  return $DB->Update($table, $data, $conditions);

}

function DBSingle($table, $conditions, $sql = false){

  $DB = new \STAN\Utils\Database\Select;
  return $DB->Select($table, $conditions, $sql)->GetSingle();

}

function DBMulti($table, $conditions, $sql = false){

  $DB = new \STAN\Utils\Database\Select;
  return $DB->Select($table, $conditions, $sql)->GetMulti();

}

function sidebar($id)
{

  if($id)
  {
  $sidebar = Item($id);

    if($sidebar)
    {
      $modules = $sidebar->modules();

      foreach($modules['content'] as $module)
      {
        Module($module['id'], $module['params']);
      }
    }
  }
}

function newItem($collection, $data = false)
{

  if (!is_object($collection)) {
    $collection = Collection($collection);
  }

  $item = $collection->items()->new();

  $item->setFromData($collection->params()->multi(), (object) $data);

  $item->save();

  return $item;

}

function Container($id)
{

  $containers = new STAN\Items\Containers\Containers();
  $container = $containers->single($id);

  return $container ?: false;

}

function Collection($id)
{

  $collections = new \STAN\Items\Collections\Collections();
  $collection = $collections->single($id);

  return $collection ?: false;

}

function Item($data, $field='id', $type=false, $status='allowed', $class = false){

  return STAN::Factory()->build('Items\Item', [
    'data'    => $data,
    'field'   => $field,
    'type'    => $type,
    'status'  => $status,
    'class'   => $class
  ]);

}

function Module($id, $params=array()){

  global $moduleDepth;
  if(!$moduleDepth) $moduleDepth=1;

  if(!is_object($id)){
    $module = Item($id);
  } else {
    $module = $id;
  }

  // Return if item is not an object
  if(!is_object($module)) {

    //$item = Item('settings:2');

    //$module = new STAN\Items\Items\Item\Module\Module($item);

    //$module->path = PATH_MODULES . str_replace(":", "/", $id) . ".php";
    //$module->showModuleClass = false;
    $file = PATH_MODULES . str_replace(":", "/", $id) . ".php";

    if (is_file($file)) {
      $option = $params;
      include($file);
    }

  } else {

    if(getVar('SHOW_MODULE_TAG')) {
      echo "{%".$sub."Module.".$module->database.":".$module->slug.".".$moduleDepth."%}";
      $moduleDepth++;
    }

    Register('Module', $module);

    // Set defaults
    $module->setDefaults();

    // Set options
    $module->setOptions($params);

    // Check condition
    $module->checkCondition();

    $module->setContent();

    //$module->setWrapper();

    // Get module HTML
    $module->loadModule();

    // Load collapsanel
    //$module->loadCollapsanel();

    if(getVar('SHOW_MODULE_TAG')) {
      $moduleDepth--;
    }

    // Display module
    return $module->displayModule();

  }

}


function Model($json){

  // print_r($json);

  $id = $json->model;
  $order = $json->modelorder ?? 0;
  $limit = $json->modellimit ?? 0;
  $start = $json->modelstart ?? 0;

  $model = Item($id);

  if(!$model) return;

  $model->setLimit($limit);
  $model->setStart($start);
  $model->setPage(getVar("Route.page"));
  $model->setAttributes();
  
  $model->buildSearch();

  return $model;

}


function Register($var, $closure){

  if(is_callable($closure)){

    \STAN\Core\Registry::$var($closure);

  }else{

    \STAN\Core\Registry::$var(function() use ($closure){

        return $closure;

    });

  }

}

function Logs($type = false, $filter = false, $display = false){

  return new \STAN\Log($type, $filter, $display);

}

function Sections($database, $order = 'satitle asc'){

  $sections = Search()->setParams(array(
    'database'  => $database,
    'order'	    => $order,
    'parent'    => array('<', '1')
  ))->get();

  foreach($sections as $section)
  {

    $section->items = Search()->setParams(array(
      'database'  => $database,
      'order'	    => $order,
      'parent'    => array('=', $section->id)
    ))->get();

  }

  return $sections;

}

function Items($database, $params = array()){

  $params['database'] = $database;

  $params = array_merge(array(
    'method'  => 'GetMulti',
    'order'   => 'satitle asc'
  ),$params);

  return Search()
         ->setTable($database)
         ->setParams($params)
         ->get($params['method']);

}


function Search(){

  $Facade = new \STAN\Items\Search\Items(
                      new \STAN\Items\Search\Items\Params,
                      new \STAN\Items\Search\Items\Filters
                );

  return $Facade;

}
