<?php

namespace STAN\Utils;

use STAN;

class Request
{

    //external vars
    public $url;
    public $fail=false;

    public $post;
    public $get;


    public function __construct()
    {
        $this->post = new \stdClass();
        $this->post_raw = new \stdClass();
        $this->get = new \stdClass();
        $this->get_raw = new \stdClass();

        foreach ($_POST as $var=>$val) {
            $this->post_raw->{$var}=$this->stripQuotes($val);
            $this->post->$var=$this->clean($val);
        }

        foreach ($_GET as $var=>$val) {
            $this->get_raw->{$var}=$this->stripQuotes($val);
            $this->get->$var=$this->clean($val);
        }

        if (isset($_REQUEST['debug'])) {
          $this->post = $this->get;
          $this->post_raw = $this->get_raw;
        }

        $this->request = count($_POST) ? $this->post : $this->get;

        if (!empty($_REQUEST['PostData'])) {
            parse_str(str_replace("&amp;", "&", $_REQUEST['PostData']), $vars);

            foreach ($vars as $var=>$val) {
                $this->post_raw->{$var} = $this->stripQuotes($val);
                $this->post->{$var} = $this->clean($val);
            }

            $this->request = $this->post;
        }

        if (!empty($_REQUEST['PostJSON'])) {
            $vars = json_decode(stripslashes($_REQUEST['PostJSON']), true);
            if (is_array($vars)) {
                foreach ($vars as $var=>$val) {
                    $this->post_raw->{$var} = $this->stripQuotes($val);
                    $this->post->{$var} = $this->clean($val);
                }
            }

            $this->request = $this->post;
        }

        if (file_get_contents('php://input')) {
            $vars = json_decode(file_get_contents('php://input'), true);
            if (is_array($vars)) {
                foreach ($vars as $var=>$val) {
                    $this->post_raw->{$var} = $this->stripQuotes($val);
                    $this->post->{$var} = $this->clean($val);
                }
            }

            $this->request = $this->post;
        }
    }

    public function getHTML($var)
    {
        $val = $this->post_raw->{$var} ?? '';

        $val = str_replace(array("\r\n", "\n\r", "\r", "\n"), "", $val);

        return $val;
    }

    public function clean($v)
    {
        // if (get_magic_quotes_gpc()==1) {
        //     $v=stripslashes($v);
        // }

        $v=trim($v);
            //$v=strip_tags($v);
            $v=htmlentities($v, ENT_QUOTES, "utf-8");
        $v=str_replace(array("\r\n", "\n\r", "\r", "\n"), "<br />", $v);
            //$v=mysql_real_escape_string($v);
            $v=stripslashes($v);
            //$v=urldecode($v);

            //STUPID WORD CHARS � � � � -
            $v=str_replace("&amp;#8217;", "&#39;", $v);
        $v=str_replace("&amp;#8216;", "&#39;", $v);
        $v=str_replace("&amp;#8220;", '"', $v);
        $v=str_replace("&amp;#8221;", '"', $v);
        $v=str_replace("&amp;#8211;", "-", $v);
        $v=str_replace("&amp;#8226;", "&bull;", $v);
        $v=str_replace("&amp;#8230;", "...", $v);

        return $v;
    }

    public function stripQuotes($var){
        if(function_exists('stripslashes_deep')){
            return stripslashes_deep($var);
        }
        return stripslashes($val);
    }
}
