<?php
//runs the autoload.php file that is in vendor folder and contains the Google OAuth dependencies
require_once __DIR__.'/vendor/autoload.php';

session_start();

//create a new instance of the Google Client
$client = new Google\Client();
//Connects to Oauth client by using code in client_secret.json
$client->setAuthConfig('client_secret.json');
//set the redirect URI
$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php');
//setting a scope to authorize the app (won’t authorise without a scope set)
$client->addScope('https://www.googleapis.com/auth/userinfo.email');

//if the user isn’t authorized to use the app, they will get sent to the google sign in page
if (!isset($_SESSION['access_token']) && !isset($_GET['code'])) {
    $auth_url = $client->createAuthUrl();
    header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
} else {
    //otherwise get the user sign in information and redirect them to the index.php page
    if (isset($_GET['code'])) {
        $client->authenticate($_GET['code']);
        $_SESSION['access_token'] = $client->getAccessToken();
        $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/index.php';
        header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
    }
}
?>
