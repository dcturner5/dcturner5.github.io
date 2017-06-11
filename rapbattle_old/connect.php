<?php
$user = 'gamma';
$pass = 'zj6Xcm15';
$name = 'rapbattle';
$dbh = null;
//97.117.160.168
try {
    $dbh = new PDO('mysql:host=138.197.199.138;dbname='.$name, $user, $pass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print "Error: " . $e->getMessage() . "<br/>";
    die();
}