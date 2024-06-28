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
    //if there's no access token, sends user to login page to get access token by signing in
    $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/index.php';
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
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

    <!-- Nav bar -->
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

    <!-- Redirects to index.php to sign in -->
    <main>
        <section>
            <h2 class="active">Login</h2>
            <p>
                Please login here to access this page
                <br>
                <a href="index.php">Sign In</a>
            </p>
        </section>
    </main>

    <!-- Footer section -->
    <footer>
        <p>&copy 2024 Living Planet, all rights have been reserved by us</p>
    </footer>

</body>
</html>