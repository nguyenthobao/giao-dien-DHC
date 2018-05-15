<?php

class AccessApi
{
    const BASE_API = 'http://dhc.blo.com.vn/';

    public function __construct()
    {
        $key = '';

        if(isset($_POST['key'])) {
            $key = $_POST['key'];
        }

        if(!isset($_GET['action'])) {
            $action = 'login';
        } else {
            $action = $_GET['action'];
        }

        switch ($action) {
            /*User*/
            case "login":
                $url = self::BASE_API.'user/login';
                $this->accessApi($url, $_POST);
                break;
            case "check-login":
                $url = self::BASE_API.'user/check-login';
                $this->accessApi($url, $_POST);
                break;
            /*Point*/
            case "get-all-point":
                $url = self::BASE_API.'point/get-all-point';
                $this->accessApi($url, $_POST);
                break;
            case "get-point":
                $url = self::BASE_API.'point/get-point';
                $this->accessApi($url, $_POST);
                break;
            case "get-type":
                $url = self::BASE_API.'type/get-type';
                $this->accessApi($url, $_POST);
                break;
            case "add-point":
                $url = self::BASE_API.'point/add-point';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            case "edit-point":
                $url = self::BASE_API.'point/edit-point';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            case "delete-point":
                $url = self::BASE_API.'point/delete-point';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            /*Promotion*/
            case "get-all-promotion":
                $url = self::BASE_API.'promotion/get-all-promotion';
                $this->accessApi($url, $_POST);
                break;
            case "get-promotion":
                $url = self::BASE_API.'promotion/get-promotion';
                $this->accessApi($url, $_POST);
                break;
            case "edit-promotion":
                $url = self::BASE_API.'promotion/edit-promotion';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            case "add-promotion":
                $url = self::BASE_API.'promotion/add-promotion';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            case "delete-promotion":
                $url = self::BASE_API.'promotion/delete-promotion';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            /*News*/
            case "get-all-news":
                $url = self::BASE_API.'news/get-all-news';
                $this->accessApi($url, $_POST);
                break;
            case "get-news":
                $url = self::BASE_API.'news/get-news';
                $this->accessApi($url, $_POST);
                break;
            case "add-news":
                $url = self::BASE_API.'news/add-news';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            case "edit-news":
                $url = self::BASE_API.'news/edit-news';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
            case "delete-news":
                $url = self::BASE_API.'news/delete-news';
                unset($_POST['key']);
                $this->accessApi($url, $_POST, $key);
                break;
        }
    }

    public function accessApi($url, $param, $key = ''){
        $curl = curl_init();

        $param = json_encode($param);

        curl_setopt($curl, CURLOPT_POSTFIELDS, $param);

        curl_setopt($curl, CURLOPT_URL, $url);

        if(!empty($key)) {
            curl_setopt($curl, CURLOPT_HTTPHEADER, [
                '_accesstoken: '.$key,
            ]);
        }

        $result = curl_exec($curl);

        curl_close($curl);

        return $result;
    }
}

new AccessApi();