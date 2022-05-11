<?php

$get = STAN::Request()->get;

// STAN::Vars()->Set('Theme', array(
//
//   'default-head'                => 'head-1',
//   'default-header'              => 'header-1',
//   'default-footer'              => 'footer-1'
//
// ));

setVar('Theme.Colours', [
  'theme'           => 'Theme',
  'theme-light'     => 'Theme Light',
  'theme-dark'      => 'Theme Dark',
  'white'           => 'White',
  'xlight'          => 'XLight',
  'light'           => 'Light',
  'mid'             => 'Mid',
  'dark'            => 'Dark',
  'xdark'           => 'XDark',
  'black'           => 'Black',
  'primary'         => 'Primary',
  'secondary'       => 'Secondary',
  'tertiary'        => 'Tertiary'
]);

// Get timestanp for js/css filename
define('FRONTEND_CSS', GetContents(PATH_PUBLIC . 'cache/assets/.frontend_css') );
define('FRONTEND_TAILWIND', GetContents(PATH_PUBLIC . 'cache/assets/.frontend_tailwind') );
define('FRONTEND_ALL_CSS', GetContents(PATH_PUBLIC . 'cache/assets/.frontend_all_css') );
define('BACKEND_CSS', GetContents(PATH_PUBLIC . 'cache/assets/.backend_css') );
define('FRONTEND_JS', GetContents(PATH_PUBLIC . 'cache/assets/.frontend_js') );
define('BACKEND_JS', GetContents(PATH_PUBLIC . 'cache/assets/.backend_js') );
define('FIREBASE_JS', GetContents(PATH_PUBLIC . 'cache/assets/.firebase_js') );

// Webfonts - https://github.com/typekit/webfontloader
// DO NOT USE THIS - THE JS IS TOO HEAVY
/*$frontend_fonts=array(
  'google'=>array(
    'families'=>array('Open+Sans:300,400,600,700')
  ),
  'typekit'=>array(
    'id'=>'eqp3chx'
  ),
  'monotype'=>array( // fonts.com
  'projectId'=>'3e5a6ce9-d3a2-41b2-824d-0aa0eb9968d3',
  'version'=>1 // (optional, flushes the CDN cache)
  )
);*/

// Set CSS/JS Libs
$frontend_css_dev=array(
  '/cache/assets/base-'.FRONTEND_CSS.'-map.css',
  '/cache/assets/tailwind-'.FRONTEND_TAILWIND.'.css',
);

$frontend_css_live=array(
  getVar('App.asset_url') . '/cache/assets/base-'.FRONTEND_CSS.'.css',
  getVar('App.asset_url') . '/cache/assets/tailwind-'.FRONTEND_TAILWIND.'.css',
  // getVar('App.asset_url') . '/cache/assets/all-'.FRONTEND_ALL_CSS.'.css',
);


$frontend_js_dev=array(
  '/cache/assets/frontend-'.FRONTEND_JS.'.js',
  '/cache/assets/firebase-'.FIREBASE_JS.'.js',
);

$frontend_js_live=array(
  getVar('App.asset_url') . '/cache/assets/' . $_ENV['VHOST'] . '-'.FRONTEND_JS.'.js',
  getVar('App.asset_url') . '/cache/assets/firebase-'.FIREBASE_JS.'.js',
);

if(getVar('App.server') == 'LOCAL'){
  $frontend_css = $frontend_css_dev;
  $frontend_js = $frontend_js_dev;
}
else if (empty($_SERVER['HTTP_X_SHOPIFY']) && !getVar('App.shopify_app_proxy')){
  $frontend_css = $frontend_css_live;
  $frontend_js = $frontend_js_live;
}
else {
  $frontend_css = [];
  $frontend_js = [];
}

$backend_url = $_ENV['LOCAL_PROTOCOL'] == 'https' ? getVar('App.production_url') : '';

// Set libraries
STAN::Vars()->Set('Libraries',array(

    'frontend_fonts'=>json_encode($frontend_fonts ?? ''),

    'frontend_css'=>$frontend_css,
    'frontend_js'=>$frontend_js,

    'backend_css'=>array(
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
        'https://fonts.googleapis.com/css?family=Montserrat:400,600,700',
        $backend_url.'/libs/jquery/themes/smoothness/jquery-ui.min.css',
        $backend_url.'/libs/material-design-icons/material-icons.css',
        '/cache/assets/backend-'.BACKEND_CSS.'.css',
        '/cache/assets/backend-scss-'.BACKEND_CSS.'.css'
    ),

    'backend_wp_css'=>array(
      //$backend_url.'/libs/jquery/themes/smoothness/jquery-ui.min.css',
      $backend_url.'/cache/libs/pikaday/pikaday.css',
      '/cache/libs/material-design-icons/material-icons.css',
      '/cache/assets/backend-scss-'.BACKEND_CSS.'.css'
  ),

    'backend_js'=>array(
        $backend_url.'/libs/jquery/jquery.min.js',
        $backend_url.'/cache/libs/sortablejs/Sortable.min.js',
        $backend_url.'/cache/libs/ace/ace.js',
        $backend_url.'/cache/libs/tinymce/tinymce.min.js',
        '/ajax/backend/tinymce/styles',
        //'/assets/backend/libs/tinymce-typekit.js',
        '/cache/assets/firebase-'.FIREBASE_JS.'.js',
        '/cache/assets/backend-'.BACKEND_JS.'.js'
    ),

    'backend_wp_js' => [
      'https://unpkg.com/material-components-web@11.0.0/dist/material-components-web.min.js',
      //$backend_url.'/libs/jquery/jquery.min.js',
      $backend_url.'/cache/libs/sortablejs/Sortable.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
      $backend_url.'/cache/libs/pikaday/pikaday.js',
      $backend_url.'/cache/libs/ace/ace.js',
      $backend_url.'/cache/libs/tinymce/tinymce.min.js',
      '/wp-admin/admin-ajax.php?action=base_backend&route=/ajax/backend/tinymce/styles',
      '/cache/assets/backend-wp-'.BACKEND_JS.'.js'
    ],

    'tinymce_css'=>array(
        '/cache/assets/tailwind-'.FRONTEND_TAILWIND.'.css',
        $backend_url.'/libs/tinymce/tinymce.css',
        '/cache/assets/base-'.FRONTEND_CSS.'.css',
    )

));

$server = getVar('App.server');

setVar('DIR', [
  'admin'        => '/base/',
]);
