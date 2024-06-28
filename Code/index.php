<?php
//runs the autoload.php file that is in vendor folder and contains the Google OAuth dependencies
require_once __DIR__.'/vendor/autoload.php';

session_start();

//create a new instance of the Google Client
$client = new Google\Client();
//Connects to Oauth client by using code in client_secret.json
$client->setAuthConfig('client_secret.json');
//setting a scope to authorize the app (won’t authorise without a scope set)
$client->addScope('https://www.googleapis.com/auth/userinfo.email');

//check to see if there is an access token
if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
    //set the token to stay logged in
    $client->setAccessToken($_SESSION['access_token']);
    //html to let user know that they are logged in and allows them to log out
} else {
    //if there's no access token, sends user to login page to get access token by signing in
    $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php';
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
    exit;
}

//check to see if the sign out button has been pressed
if ($_SERVER['REQUEST_METHOD'] == 'POST' and isset($_POST['signOut'])) {
    //remove token so user no longer has token unless they sign in again
    $client->revokeToken($_SESSION['access_token']);
    //destroy the session
    session_destroy();
    //redirects to index.html page
    $redirect = 'http://' . $_SERVER['HTTP_HOST'] . '/index.html';
    header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Living Planet</title>
    <link rel="stylesheet" type="text/css" href="/css/Living_planet.css">
</head>
<body>
    <nav>
        <header>
            <h1><a href="/index.html">Living Planet</a></h1>
        </header>
        <ul>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/webpages/about.html">About</a></li>
            <li><a href="/Login.php">OAuth</a></li>
        </ul>
    </nav>
    <main>
        <section>
            <h1>Oauth description</h1>
            <p>OAuth (Open Authorization) is a framework that is designed to allow a website or app to access resources hosted by other web apps on behalf of a user. Google OAuth uses OAuth 2.0 and will allow a user access once they sign in with a Google account.</p>
            <h1>What is the OAuth process? - Front-end</h1>
            <p>User will request access to a third party application, if they are not signed in they will then be redirected to the sign in page hosted by Google where they will then sign in, once they have signed in, they will be given access. Once they have signed out, they will be redirected back to the home page.</p>
            <h1>What is the OAuth process? - back-end</h1>
            <p>User will request access to a third party application which will check if the user has a token, if the user does not have a token then the app will authenticate the user, however if they do not have a token then the user will be redirected to the Google sign in page. The user will then be authorised and given a token, once they have been given a token they will be redirected back to the third party application and allowed access to it. Once the user signs out, the token will then be destroyed and they will be redirected back to the home page.</p> 
            <h1>Why is OAuth more secure than an API key?</h1>
            <p>OAuth is more secure as it does not require users to provide their details directly to third party organizations, this in turn greatly reduces the risk of credential exposure.</p>
            <!-- Sign out button -->
            <div class="sign-out-container">                        
                <form action='index.php' method='post'>
                    <input type='submit' name='signOut' value='Sign Out' />
                </form>
            </div>
        </section>
    </main>
    <!-- Footer section -->
    <footer>
        <p>&copy 2024 Living Planet, all rights have been reserved by us</p>
    </footer>
</body>
</html>
