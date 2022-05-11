<?php

$server = $_ENV['SERVER'];
$vhost  = $_ENV['VHOST'];

$domain   = $_ENV[$server . '_DOMAIN'];
$protocol = $_ENV[$server . '_PROTOCOL'];
$url      = $protocol . '://'. $domain;

$production_domain  = $_ENV['PRODUCTION_DOMAIN'];
$production_url     = $_ENV['PRODUCTION_PROTOCOL'] . '://'. $_ENV['PRODUCTION_DOMAIN'];

$remote_domain      = $production_domain;
$remote_url         = $production_url;

setVar('App', [
  'server'              => $server,             // local, staging or production
  'vhost'               => $vhost,              // permenant domain reference
  'domain'              => $domain,             // current servers domain
  'protocol'            => $protocol,           // current servers protocol
  'url'                 => $url,                // current servers url
  'public_dir'          => '/',                 // public url
  'admin_dir'           => '/base/',            // admin dir
  'production_domain'   => $production_domain,  // production servers domain
  'production_url'      => $production_url,     // production servers url
  'remote_domain'       => $remote_domain,      // staging domain if staging server active, else production
  'remote_url'          => $remote_url,         // staging url if staging server active, else production
  'firebase_url'        => $_ENV['FIREBASE_URL'],// firebase url
]);
